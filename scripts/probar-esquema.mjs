// =========================================================================
// PERSEVERA TESTS: la prueba del esquema (todas las migraciones de
// supabase/migrations, en orden)
// =========================================================================
// Contra un Postgres de verdad (PGlite, en memoria), sin tocar ningún Supabase.
// El arnés (los roles y el auth mínimo de Supabase, y cada petición como la
// hace PostgREST) está en scripts/arnes-supabase.mjs, copiado de Oral. La forma
// de esta prueba (las dos pasadas, la matriz de permisos y la segunda
// cerradura) sale de persevera-oral/scripts/probar-esquema.mjs (main, b8e151a);
// las comprobaciones son las de Tests.
//
// Todo se prueba DOS veces: con los GRANT automáticos que Supabase da a las
// tablas nuevas hasta el 30-oct-2026 (las migraciones tienen que quitarlos) y
// sin ellos, como desde esa fecha (las migraciones tienen que darlos). La
// segunda pasada solo imprime lo que falla.
//
//   1) Permisos: RLS en todas las tablas, las vistas security_invoker, la
//      matriz por rol, tabla y columna (también la de service_role, exacta);
//      funciones: ninguna para anon ni para PUBLIC, cuáles son SECURITY
//      DEFINER, todas con search_path; las políticas con (select auth.uid());
//      los CHECK de varias columnas, con nombre.
//   2) El contenido: el servidor lo carga en cualquier orden (claves ajenas
//      aplazables); la app no lo escribe y, hasta T10, no ve nada; anon, nada;
//      sin rúbrica ni nada de usuarios; UNIQUE parciales que dejan reusar el
//      código de una retirada; las _jugable sin puntos_clave.
//   3) El motor: respuestas, casos, actividad y simulacros, cada uno lo suyo;
//      la oposición de la respuesta la pone la base; las dos vistas; el sorteo.
//   4) La oposición: el catálogo y la elección se leen y no se escriben.
//   5) Las suscripciones y tiene_acceso: el sandbox de una cuenta normal no
//      cuenta; el de una cuenta de prueba, sí; estados, fechas, margen,
//      oposición, y de quién se puede preguntar.
//   6) Nadie salvo el servidor escribe suscripciones, eventos_pago,
//      pruebas_usadas ni cuentas_de_prueba (ni el resto de lo suyo).
//   7) prueba_disponible.
//   8) registrar_aceptacion.
//   9) Reportes, embudo y versión mínima.
//  10) service_role puede todo.
//  11) Borrar la cuenta.
//  12) La segunda cerradura: con permisos de más, los disparadores frenan.
//
// Para correrla:  npm run probar:esquema
// Variable: MIGRACIONES=<carpeta> para probar otra copia de las migraciones
// (por ejemplo, una con un defecto metido a propósito, siempre fuera del
// repositorio).
// Sale con 1 si algo falla y con 0 si todo está en orden.
// =========================================================================
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { SUPABASE, pedir, intenta } from './arnes-supabase.mjs'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const CARPETA = process.env.MIGRACIONES ?? join(RAIZ, 'supabase', 'migrations')
const MIGRACIONES = readdirSync(CARPETA).filter(f => f.endsWith('.sql')).sort()
  .map(f => ({ f, sql: readFileSync(join(CARPETA, f), 'utf8') }))

// ── Contadores y salida ──────────────────────────────────────────────────────
let fallos = 0
let comprobaciones = 0
let verboso = true
const ok = (cond, msg) => {
  comprobaciones++
  if (!cond) fallos++
  if (verboso || !cond) console.log((cond ? '  ✓ ' : '  ✗ ') + msg)
}
const seccion = t => { if (verboso) console.log('\n' + t) }
const reventar = e => { console.log(`  ✗ la prueba no puede seguir: ${e?.stack ?? e}\n\n✗ ${fallos + 1} fallo(s)`); process.exit(1) }
process.on('uncaughtException', reventar)
process.on('unhandledRejection', reventar)

// ── Los datos ────────────────────────────────────────────────────────────────
const U = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
// Los usuarios
const ANA = U(1), BEA = U(2), CAR = U(3), DAN = U(4), EVA = U(5), FER = U(6), GIL = U(7), HUGO = U(8),
  IVAN = U(9), JUAN = U(10), KIKO = U(11), LUZ = U(12)
const USUARIOS = [ANA, BEA, CAR, DAN, EVA, FER, GIL, HUGO, IVAN, JUAN, KIKO, LUZ]
// Las oposiciones, con sus ids de Persevera (los que van escritos en oposicionesIds.ts)
const OPO_A = '1fd3dcce-78b1-423c-bbcb-3c0649eda113'   // Administrativo del Estado
const OPO_G = '693d45f5-e110-416f-9c9f-72d58b5778c9'   // Guardia Civil
// El contenido
const C = n => `c0000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const B1 = C(1), B2 = C(2), T1 = C(11), T2 = C(12), E1 = C(21), E2 = C(22)
const P1 = C(31), P2 = C(32), P3 = C(33), P4 = C(34), P5 = C(35)
const MP1 = C(41), MP2 = C(42), MI1 = C(51), PS1 = C(61)

const q = async (db, sql, p) => (await db.query(sql, p)).rows          // el SQL Editor (postgres)
const one = async (db, sql, p) => (await q(db, sql, p))[0]
const txt = r => r.error ? `«${r.error}»` : `sin error, ${r.filas?.length ?? 0} fila(s)`
const DENEGADO = /permission denied/
const RLS = /row-level security/
const denegado = r => DENEGADO.test(r.error ?? '')

/** Varias sentencias en una sola petición (una transacción), como una función del servidor. */
async function ejecutar(db, quien, sql) {
  const rol = quien === 'anon' || quien === 'service_role' ? quien : 'authenticated'
  const claims = rol === 'authenticated' ? { sub: quien, role: rol } : { role: rol }
  await db.exec('set session authorization authenticator')
  try {
    await db.transaction(async tx => {
      await tx.exec(`set local role ${rol}`)
      await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)])
      await tx.exec(sql)
    })
    return {}
  } catch (e) {
    return { error: e.message }
  } finally {
    await db.exec('set session authorization postgres')
  }
}

// El banco de prueba, como lo cargaría la copia (T10): de las hijas a las
// madres, para ver que el orden no importa dentro de la transacción.
const CONTENIDO = `
insert into public.psico_items_graficos (id, oposicion_id, tipo, enunciado, opciones, correcta)
values ('${PS1}', '${OPO_G}', 'matriz', '¿Qué figura sigue?', '["a","b","c","d"]', 'A');
insert into public.marcado_unidades (item_id, orden, texto, es_incorrecto, forma_correcta) values
  ('${MI1}', 1, 'Hiba', true, 'Iba'), ('${MI1}', 2, 'a casa', false, null);
insert into public.marcado_items (id, oposicion_id, tipo, instruccion, frase)
values ('${MI1}', '${OPO_G}', 'ortografia', 'Marca las palabras mal escritas', 'Hiba a casa');
insert into public.supuesto_oficial_preguntas (id_pregunta, id_caso, orden, enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, estado, revisado_por)
values ('SOF1-1', 'SOF1', 1, '¿Plazo?', '1', '2', '3', '4', 'c', 'vigente', 'plantilla-definitiva-sep2026');
insert into public.supuestos_oficiales (id_caso, oposicion_id, titulo, anio_convocatoria, convocatoria, num_supuesto, par_caso) values
  ('SOF1', '${OPO_A}', 'Supuesto 1', 2024, 'Examen AGE 2024', 1, 'SOF2'),
  ('SOF2', '${OPO_A}', 'Supuesto 2', 2024, 'Examen AGE 2024', 2, 'SOF1');
insert into public.supuesto_original_preguntas (id_pregunta, id_caso, orden, enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('SO1-1', 'SO1', 1, '¿Órgano?', 'a', 'b', 'c', 'd', 'b');
insert into public.supuesto_original_preguntas (id_pregunta, id_caso, orden, enunciado) values
  ('SO1-2', 'SO1', 2, 'Indique todas las autoliquidaciones');
insert into public.supuestos_originales (id_caso, oposicion_id, bloque, tema, titulo, orden)
values ('SO1', '${OPO_A}', 'III. Derecho administrativo', 'T8', 'Original 1', 1);
insert into public.minicaso_preguntas (id, id_pregunta, id_caso, num_pregunta, enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta) values
  ('${MP1}', 'MC1-1', 'MC1', 1, '¿Recurso?', 'a', 'b', 'c', 'd', 'a'),
  ('${MP2}', 'MC1-2', 'MC1', 2, '¿Plazo?', 'a', 'b', 'c', 'd', 'd');
insert into public.minicasos (id_caso, oposicion_id, bloque, tema, titulo, num_preguntas, orden)
values ('MC1', '${OPO_A}', 'III', 1, 'Minicaso 1', 2, 1);
insert into public.preguntas (id, codigo, tema_id, epigrafe_id, oposicion_id, enunciado, opcion_a, opcion_b, opcion_c, opcion_d,
                              respuesta_correcta, dificultad, fuente, convocatoria_fuente, orden_examen, estado) values
  ('${P1}', 'C1-ACTO-0001', '${T1}', '${E1}', null, 'P1', 'a', 'b', 'c', 'd', 'A', 1, 'propia', null, null, 'verificada'),
  ('${P2}', 'C1-ACTO-0002', '${T1}', '${E1}', null, 'P2', 'a', 'b', 'c', 'd', 'B', 2, 'propia', null, null, 'verificada'),
  ('${P3}', 'C1-ACTO-0003', '${T1}', '${E1}', null, 'P3', 'a', 'b', 'c', 'd', 'C', 3, 'propia', null, null, 'pendiente'),
  ('${P4}', 'C1-OFI-0001',  '${T1}', null, '${OPO_A}', 'P4', 'a', 'b', 'c', 'd', 'D', 2, 'conv_real', 'Examen AGE 2024', 1, 'verificada'),
  ('${P5}', 'GC-0001',      '${T2}', '${E2}', null, 'P5', 'a', 'b', 'c', 'd', 'A', 2, 'propia', null, null, 'verificada');
insert into public.tema_epigrafe (tema_id, epigrafe_id, orden) values ('${T1}', '${E1}', 1), ('${T2}', '${E2}', 1);
insert into public.epigrafes (id, tema_id, numero, titulo) values ('${E1}', '${T1}', 1, 'El acto'), ('${E2}', '${T2}', 1, 'La Guardia Civil');
insert into public.temas (id, bloque_id, oposicion_id, numero, titulo) values
  ('${T1}', '${B1}', '${OPO_A}', 1, 'El acto administrativo'), ('${T2}', '${B2}', '${OPO_G}', 1, 'La Guardia Civil');
insert into public.bloques (id, oposicion_id, numero, nombre) values
  ('${B1}', '${OPO_A}', 1, 'I. Derecho administrativo'), ('${B2}', '${OPO_G}', 1, 'Ciencias jurídicas');
insert into public.oposiciones (id, slug, nombre, grupo, penalizacion_denominador, activa) values
  ('${OPO_A}', 'c1_age_libre', 'Administrativo del Estado', 'C1', 3, true),
  ('${OPO_G}', 'guardia_civil_libre', 'Guardia Civil', 'C1', 3, true);
`

/** Una base vacía con lo de Supabase, las migraciones, los usuarios y el banco de prueba. */
async function montar(conGrantsAutomaticos) {
  const db = new PGlite()
  await db.exec(SUPABASE(conGrantsAutomaticos))
  for (const { f, sql } of MIGRACIONES) {
    try { await db.exec(sql) } catch (e) { throw new Error(`${f}: ${e.message}`) }
  }
  for (const u of USUARIOS) await db.query('insert into auth.users (id) values ($1)', [u])
  const carga = await ejecutar(db, 'service_role', CONTENIDO)
  if (carga.error) throw new Error(`cargar el banco de prueba: ${carga.error}`)
  return db
}

// ── La matriz de permisos esperada (anon, authenticated y service_role) ─────
const SERVIDOR = ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
const CONTENIDO_TABLAS = ['oposiciones', 'bloques', 'temas', 'epigrafes', 'tema_epigrafe', 'preguntas',
  'minicasos', 'minicaso_preguntas', 'supuestos_originales', 'supuesto_original_preguntas',
  'supuestos_oficiales', 'supuesto_oficial_preguntas', 'marcado_items', 'marcado_unidades', 'psico_items_graficos']
const LEE = { anon: [], authenticated: ['SELECT'], insertar: [], cambiar: [] }
const NADA = { anon: [], authenticated: [], insertar: [], cambiar: [] }
const MATRIZ = {
  ...Object.fromEntries(CONTENIDO_TABLAS.map(t => [t, LEE])),
  // el motor
  respuestas_usuario:  { ...LEE, insertar: ['user_id', 'pregunta_id', 'respuesta', 'es_correcta', 'modo', 'tiempo_segundos'] },
  pregunta_respondida: { ...LEE, insertar: ['user_id', 'tipo_pregunta', 'id_pregunta', 'id_caso', 'respuesta', 'es_correcta',
                                            'modo', 'tiempo_segundos'] },
  study_activity_log:  { ...LEE, insertar: ['user_id', 'tipo', 'duracion_min', 'completado', 'started_at', 'completed_at',
                                            'bloque_id', 'tema_id', 'plan_id', 'step_id', 'oposicion_id', 'metadata'] },
  simulacros: LEE,
  simulacro_sesiones:  { ...LEE, insertar: ['user_id', 'oposicion_id', 'prueba', 'fuente', 'convocatoria', 'duracion_segundos',
                                            'por_tiempo', 'apto', 'puntuacion', 'maximo_posible', 'detalle'] },
  v_estado_pregunta_usuario: { ...LEE, servidor: ['SELECT'], vista: true },
  v_casos_para_revisar:      { ...LEE, servidor: ['SELECT'], vista: true },
  // la cuenta y el cobro
  catalogo_tests: LEE,
  eleccion_oposicion: LEE,
  cambios_oposicion: NADA,
  productos_tienda: NADA,
  suscripciones: LEE,
  cuentas_de_prueba: NADA,
  pruebas_usadas: NADA,
  eventos_pago: NADA,
  version_terminos: NADA,
  aceptaciones_terminos: NADA,
  avisos_renovacion: NADA,
  // la app
  reportes_pregunta: { ...LEE, insertar: ['tabla', 'pregunta_id', 'item', 'motivo', 'texto'] },
  embudo: { ...NADA, insertar: ['paso', 'canal', 'oposicion_id'] },
  version_minima_app: { anon: ['SELECT'], authenticated: ['SELECT'], insertar: [], cambiar: [] },
}
const PRIVILEGIOS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']
const FUNCIONES_APP = ['soy_cuenta_de_prueba()', 'tiene_acceso(uuid,uuid)', 'prueba_disponible()',
  'registrar_aceptacion(text,text)', 'preguntas_aleatorias(uuid[],uuid[],integer,boolean)']
const FUNCIONES_SERVIDOR = ['tipo_cuenta_de_prueba(uuid)']
const DEFINER = ['tipo_cuenta_de_prueba(uuid)', 'soy_cuenta_de_prueba()', 'tiene_acceso(uuid,uuid)',
  'prueba_disponible()', 'registrar_aceptacion(text,text)', 'set_respuesta_oposicion_id()', 'embudo_una_vez_al_dia()']
// Lo que solo escribe el servidor (con el disparador solo_servidor)
const SOLO_SERVIDOR = [...CONTENIDO_TABLAS, 'catalogo_tests', 'eleccion_oposicion', 'cambios_oposicion', 'productos_tienda',
  'suscripciones', 'cuentas_de_prueba', 'pruebas_usadas', 'eventos_pago', 'version_terminos', 'aceptaciones_terminos',
  'avisos_renovacion', 'version_minima_app']


async function bateria(conGrantsAutomaticos) {
  const db = await montar(conGrantsAutomaticos)
  const s = (sql, p) => pedir(db, 'service_role', sql, p)

  // ───────────────────────────────────────────────────────────────────────────
  seccion('1) PERMISOS: RLS, matriz por rol, tabla y columna, y funciones')
  {
    const tablas = await q(db, `select c.relname, c.relkind, c.relrowsecurity,
        coalesce(c.reloptions, '{}') @> array['security_invoker=on'] or coalesce(c.reloptions, '{}') @> array['security_invoker=true'] as invoker
        from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v', 'm', 'p') order by 1`)
    const esperadas = Object.keys(MATRIZ).sort()
    ok(JSON.stringify(tablas.map(t => t.relname)) === JSON.stringify(esperadas),
      `en public están las ${esperadas.length - 2} tablas y las 2 vistas, y nada más ${tablas.length !== esperadas.length
        ? `(sobran ${tablas.map(t => t.relname).filter(t => !MATRIZ[t]).join(', ')}; faltan ${esperadas.filter(t => !tablas.some(x => x.relname === t)).join(', ')})` : ''}`)
    ok(tablas.filter(t => t.relkind !== 'v').every(t => t.relrowsecurity), 'todas las tablas con RLS activada')
    ok(tablas.filter(t => t.relkind === 'v').every(t => t.invoker && MATRIZ[t.relname]?.vista),
      'las dos vistas son security_invoker: se leen con la RLS de quien pregunta')

    const malTabla = [], malColumna = [], malServidor = []
    for (const [tabla, esp] of Object.entries(MATRIZ)) {
      const columnas = (await q(db, `select column_name from information_schema.columns
          where table_schema = 'public' and table_name = $1`, [tabla])).map(c => c.column_name)
      for (const rol of ['anon', 'authenticated']) {
        for (const p of PRIVILEGIOS) {
          const tiene = (await one(db, 'select has_table_privilege($1, $2, $3) x', [rol, `public.${tabla}`, p])).x
          if (tiene !== esp[rol].includes(p)) malTabla.push(`${rol} ${p} ${tabla}: ${tiene}`)
        }
        for (const col of columnas) {
          for (const [p, lista] of [['INSERT', esp.insertar], ['UPDATE', esp.cambiar]]) {
            const debe = rol === 'authenticated' && lista.includes(col)
            const tiene = (await one(db, 'select has_column_privilege($1, $2, $3, $4) x', [rol, `public.${tabla}`, col, p])).x
            if (tiene !== debe) malColumna.push(`${rol} ${p} ${tabla}.${col}: ${tiene}`)
          }
        }
      }
      // service_role: exactamente sus verbos, ni uno más (TRUNCATE, REFERENCES y
      // TRIGGER vendrían de los GRANT automáticos si la migración no los quitara)
      for (const p of PRIVILEGIOS) {
        const tiene = (await one(db, 'select has_table_privilege($1, $2, $3) x', ['service_role', `public.${tabla}`, p])).x
        if (tiene !== (esp.servidor ?? SERVIDOR).includes(p)) malServidor.push(`${p} ${tabla}: ${tiene}`)
      }
    }
    ok(malTabla.length === 0, `permisos de tabla de anon y authenticated, los justos ${malTabla.length ? JSON.stringify(malTabla) : ''}`)
    ok(malColumna.length === 0, `permisos por columna de authenticated, los justos ${malColumna.length ? JSON.stringify(malColumna) : ''}`)
    ok(malServidor.length === 0,
      `service_role lee, crea, cambia y borra en todas las tablas (en las vistas, solo lee), y nada más ${malServidor.length ? JSON.stringify(malServidor) : ''}`)
    const secuencias = await q(db, `select relname from pg_class where relnamespace = 'public'::regnamespace and relkind = 'S'`)
    ok(secuencias.length === 0, `ninguna secuencia en public (las claves son uuid o texto) ${secuencias.map(x => x.relname).join(', ')}`)

    const funciones = await q(db, `select regexp_replace(p.oid::regprocedure::text, '^public\\.', '') as firma,
        p.prosecdef as definer, p.prorettype = 'trigger'::regtype as disparador,
        coalesce(array_to_string(p.proconfig, ','), '') like '%search_path=%' as con_ruta,
        p.proacl is null or exists (select 1 from aclexplode(p.proacl) a where a.grantee = 0) as public_ejecuta,
        has_function_privilege('anon', p.oid, 'EXECUTE') as anon,
        has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth,
        has_function_privilege('service_role', p.oid, 'EXECUTE') as srv
      from pg_proc p where p.pronamespace = 'public'::regnamespace order by 1`)
    const firmas = f => f.map(x => x.firma.replaceAll(', ', ',')).sort()
    ok(funciones.every(f => !f.anon), `anon no ejecuta ninguna de las ${funciones.length} funciones de public`)
    ok(funciones.every(f => !f.public_ejecuta), 'PUBLIC tampoco (a todas se les quitó)')
    ok(JSON.stringify(firmas(funciones.filter(f => f.definer))) === JSON.stringify([...DEFINER].sort()),
      `las SECURITY DEFINER son las ${DEFINER.length} previstas (${firmas(funciones.filter(f => f.definer)).join(', ')})`)
    ok(funciones.every(f => f.con_ruta), `todas fijan search_path ${funciones.filter(f => !f.con_ruta).map(f => f.firma).join(', ')}`)
    ok(JSON.stringify(firmas(funciones.filter(f => f.auth))) === JSON.stringify([...FUNCIONES_APP].sort()),
      `authenticated ejecuta solo las ${FUNCIONES_APP.length} de la app (${firmas(funciones.filter(f => f.auth)).join(', ')})`)
    ok(JSON.stringify(firmas(funciones.filter(f => f.srv))) === JSON.stringify([...FUNCIONES_APP, ...FUNCIONES_SERVIDOR].sort()),
      `service_role ejecuta las del servidor y las de la app, y ninguna de disparador (${firmas(funciones.filter(f => f.srv && f.disparador)).join(', ')})`)

    const politicas = await q(db, `select tablename || ' ' || policyname as nombre,
        coalesce(qual, '') || ' ' || coalesce(with_check, '') as expr from pg_policies where schemaname = 'public'`)
    const aPelo = politicas.filter(p => p.expr.replaceAll('SELECT auth.uid() AS uid', '').includes('auth.uid()'))
    ok(politicas.length === 16 && aPelo.length === 0,
      `las ${politicas.length} políticas usan (select auth.uid()), nunca auth.uid() a pelo ${aPelo.map(p => p.nombre).join(', ')}`)
    const conPolitica = new Set(politicas.map(p => p.nombre.split(' ')[0]))
    ok(CONTENIDO_TABLAS.every(t => !conPolitica.has(t)), 'las 15 del contenido, sin políticas todavía (las pone T10)')

    // Los CHECK de varias columnas llevan nombre (los que Postgres bautiza solo
    // son <tabla>_check, <tabla>_check1...: en inglés y cambian si se añade otro)
    const checks = await q(db, `select conname from pg_constraint
        where connamespace = 'public'::regnamespace and contype = 'c' and cardinality(conkey) > 1 order by 1`)
    const sinNombre = checks.filter(c => /_check\d*$/.test(c.conname)).map(c => c.conname)
    ok(sinNombre.length === 0, `los CHECK de varias columnas tienen nombre propio (${checks.map(c => c.conname).join(', ')})`)
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('2) EL CONTENIDO: lo carga el servidor; la app no lo escribe y hasta T10 no ve nada')
  {
    const cuentas = await s(`select ${CONTENIDO_TABLAS.map(t => `(select count(*) from public.${t})::int as ${t}`).join(', ')}`)
    ok(CONTENIDO_TABLAS.every(t => cuentas[0][t] > 0),
      `el servidor carga las 15 tablas de las hijas a las madres, en una transacción: las claves ajenas esperan al final (${CONTENIDO_TABLAS.map(t => cuentas[0][t]).join(', ')} filas)`)

    const huerfana = await ejecutar(db, 'service_role',
      `insert into public.temas (bloque_id, numero, titulo) values ('${C(999)}', 9, 'Sin bloque')`)
    ok(/foreign key/.test(huerfana.error ?? ''), `pero una fila que apunta a algo que no existe no entra al confirmar: ${txt(huerfana)}`)

    const fks = await q(db, `select h.relname as tabla, m.relnamespace = 'public'::regnamespace as madre_en_public,
        m.relname as madre, k.condeferrable, k.condeferred, k.confdeltype
        from pg_constraint k join pg_class h on h.oid = k.conrelid join pg_class m on m.oid = k.confrelid
        where k.contype = 'f' and h.relnamespace = 'public'::regnamespace and h.relname = any($1)`, [CONTENIDO_TABLAS])
    const entreCopiadas = fks.filter(f => f.madre_en_public && CONTENIDO_TABLAS.includes(f.madre))
    ok(fks.length === entreCopiadas.length,
      `ninguna tabla del contenido apunta fuera del contenido (tampoco a auth.users) ${fks.filter(f => !entreCopiadas.includes(f)).map(f => `${f.tabla} → ${f.madre}`).join(', ')}`)
    ok(entreCopiadas.length >= 20 && entreCopiadas.every(f => f.condeferrable && f.condeferred && f.confdeltype === 'a'),
      `sus ${entreCopiadas.length} claves ajenas son deferrable initially deferred y no borran en cascada`)

    const columnas = await q(db, `select table_name, array_agg(column_name::text) as cols from information_schema.columns
        where table_schema = 'public' and table_name = any($1) group by 1`, [CONTENIDO_TABLAS])
    ok(columnas.length === 15 && columnas.every(t => t.cols.includes('retirada_at')), 'las 15 llevan retirada_at')
    const prohibidas = columnas.flatMap(t => t.cols.filter(c => ['enunciado_examen', 'respuesta_modelo', 'puntos_clave', 'tramo',
      'contenido_md', 'user_id', 'usuario_id'].includes(c)).map(c => `${t.table_name}.${c}`))
    ok(prohibidas.length === 0, `sin rúbrica, sin el tramo del cobro de Persevera y sin usuarios ${prohibidas.join(', ')}`)

    const unicos = await q(db, `select x.relname as indice, pg_get_expr(i.indpred, i.indrelid) as pred
        from pg_index i join pg_class t on t.oid = i.indrelid join pg_class x on x.oid = i.indexrelid
        where i.indisunique and not i.indisprimary and t.relnamespace = 'public'::regnamespace and t.relname = any($1)`,
    [CONTENIDO_TABLAS])
    const conRestriccion = await q(db, `select k.conname from pg_constraint k join pg_class t on t.oid = k.conrelid
        where k.contype = 'u' and t.relnamespace = 'public'::regnamespace and t.relname = any($1)`, [CONTENIDO_TABLAS])
    ok(unicos.length === 3 && unicos.every(u => /retirada_at IS NULL/.test(u.pred ?? '')) && conRestriccion.length === 0,
      `cada UNIQUE que no es la clave primaria es parcial, where retirada_at is null (${unicos.map(u => u.indice).join(', ')})`)

    // Reusar el código de una retirada
    const dup = await intenta(db, 'service_role', `insert into public.minicaso_preguntas (id_pregunta, id_caso, opcion_a, opcion_b, opcion_c, opcion_d, correcta)
        values ('MC1-1', 'MC1', 'a', 'b', 'c', 'd', 'a')`)
    ok(/duplicate key/.test(dup.error ?? ''), `mientras está viva, otra pregunta con el mismo id_pregunta no entra: ${txt(dup)}`)
    const reuso = await ejecutar(db, 'service_role', `
      update public.minicaso_preguntas set retirada_at = now() where id_pregunta = 'MC1-1';
      insert into public.minicaso_preguntas (id_pregunta, id_caso, opcion_a, opcion_b, opcion_c, opcion_d, correcta)
        values ('MC1-1', 'MC1', 'a', 'b', 'c', 'd', 'b');
      update public.oposiciones set retirada_at = now() where slug = 'guardia_civil_libre';
      insert into public.oposiciones (slug, nombre, grupo) values ('guardia_civil_libre', 'Guardia Civil (nueva)', 'C1');
      update public.marcado_unidades set retirada_at = now() where item_id = '${MI1}' and orden = 1;
      insert into public.marcado_unidades (item_id, orden, texto, es_incorrecto) values ('${MI1}', 1, 'Iba', false);`)
    ok(!reuso.error, `retirada la vieja, entra la nueva con el mismo código (id_pregunta, slug y la unidad de su ítem) ${reuso.error ?? ''}`)
    // Se deja como estaba
    await ejecutar(db, 'service_role', `
      delete from public.minicaso_preguntas where id_pregunta = 'MC1-1' and retirada_at is null;
      update public.minicaso_preguntas set retirada_at = null where id = '${MP1}';
      delete from public.oposiciones where slug = 'guardia_civil_libre' and retirada_at is null;
      update public.oposiciones set retirada_at = null where id = '${OPO_G}';
      delete from public.marcado_unidades where item_id = '${MI1}' and orden = 1 and retirada_at is null;
      update public.marcado_unidades set retirada_at = null where item_id = '${MI1}' and orden = 1;`)

    // Las _jugable, sin puntos_clave
    for (const tabla of ['supuesto_original_preguntas', 'supuesto_oficial_preguntas']) {
      const caso = tabla === 'supuesto_original_preguntas' ? 'SO1' : 'SOF1'
      const coja = await intenta(db, 'service_role', `insert into public.${tabla} (id_pregunta, id_caso, orden, opcion_a, opcion_b, opcion_c, correcta)
          values ('X-1', '${caso}', 9, 'a', 'b', 'c', 'a')`)
      const desarrollo = await intenta(db, 'service_role', `insert into public.${tabla} (id_pregunta, id_caso, orden, enunciado)
          values ('X-2', '${caso}', 10, 'Explique...') returning id_pregunta`)
      ok(/_jugable/.test(coja.error ?? '') && !desarrollo.error,
        `${tabla}: con letra correcta y sin la cuarta opción no entra (${txt(coja)}); la de solo desarrollo, sin letra, sí (la deja fuera el alcance)`)
      await s(`delete from public.${tabla} where id_pregunta = 'X-2'`)
    }

    // La app
    const mal = [], vistas = [], anon = []
    for (const t of CONTENIDO_TABLAS) {
      const lee = await intenta(db, ANA, `select * from public.${t}`)
      if (lee.error || lee.filas.length !== 0) vistas.push(`${t}: ${txt(lee)}`)
      const a = await intenta(db, 'anon', `select * from public.${t}`)
      if (!denegado(a)) anon.push(`${t}: ${txt(a)}`)
      for (const sql of [`update public.${t} set retirada_at = now()`, `delete from public.${t}`,
        `insert into public.${t} (retirada_at) values (now())`]) {
        const r = await intenta(db, ANA, sql)
        if (!denegado(r)) mal.push(`${t} ${sql.split(' ')[0]}: ${txt(r)}`)
      }
    }
    ok(vistas.length === 0, `la app las lee sin error y, hasta las políticas de T10, no ve ninguna fila ${vistas.join(' | ')}`)
    ok(anon.length === 0, `anon no lee ninguna ${anon.join(' | ')}`)
    ok(mal.length === 0, `la app no crea, no cambia y no borra en ninguna (permission denied) ${mal.join(' | ')}`)
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('3) EL MOTOR: cada uno escribe y lee lo suyo; la oposición la pone la base')
  {
    const responder = (u, p, resp, bien) => intenta(db, u, `insert into public.respuestas_usuario
        (user_id, pregunta_id, respuesta, es_correcta, modo, tiempo_segundos) values ($1, $2, $3, $4, 'practica', 12) returning id`,
    [u, p, resp, bien])
    const r1 = await responder(ANA, P1, 'B', false)
    await new Promise(r => setTimeout(r, 5))
    await responder(ANA, P1, 'A', true)
    await responder(ANA, P2, 'B', true)
    const r5 = await responder(ANA, P5, 'C', false)
    ok(!r1.error && !r5.error, `la app apunta sus respuestas ${r1.error ?? r5.error ?? ''}`)
    const suyas = await pedir(db, ANA, 'select pregunta_id, oposicion_id from public.respuestas_usuario')
    ok(suyas.length === 4 && suyas.filter(r => r.pregunta_id === P1).every(r => r.oposicion_id === OPO_A)
       && suyas.find(r => r.pregunta_id === P5)?.oposicion_id === OPO_G,
    'la oposición de cada respuesta la pone la base, por el bloque del tema de la pregunta (aunque la app no vea las preguntas)')
    const otra = await intenta(db, BEA, 'select * from public.respuestas_usuario')
    ok(!otra.error && otra.filas.length === 0, 'B no ve las respuestas de A')
    const porOtro = await responder(BEA, P1, 'A', true).then(() => intenta(db, BEA, `insert into public.respuestas_usuario
        (user_id, pregunta_id, respuesta, es_correcta) values ($1, $2, 'A', true)`, [ANA, P1]))
    ok(RLS.test(porOtro.error ?? ''), `B no apunta respuestas a nombre de A: ${txt(porOtro)}`)
    for (const [col, val] of [['oposicion_id', `'${OPO_G}'`], ['created_at', `now() - interval '1 year'`]]) {
      const r = await intenta(db, ANA, `insert into public.respuestas_usuario (user_id, pregunta_id, respuesta, es_correcta, ${col})
          values ($1, $2, 'A', true, ${val})`, [ANA, P2])
      ok(denegado(r), `la app no manda ${col}: ${txt(r)}`)
    }
    const cambia = await intenta(db, ANA, `update public.respuestas_usuario set es_correcta = true`)
    const borra = await intenta(db, ANA, `delete from public.respuestas_usuario`)
    ok(denegado(cambia) && denegado(borra), 'ni cambia ni borra sus respuestas')

    // La vista del estado de cada pregunta
    const estado = await pedir(db, ANA, 'select pregunta_id, estado, veces_vista from public.v_estado_pregunta_usuario order by pregunta_id')
    const e = Object.fromEntries(estado.map(x => [x.pregunta_id, x.estado]))
    ok(estado.length === 3 && e[P1] === 'en_refuerzo' && e[P2] === 'acertada' && e[P5] === 'pendiente',
      `v_estado_pregunta_usuario: fallada y acertada, en refuerzo; acertada a la primera, acertada; fallada, pendiente (${JSON.stringify(e)})`)
    const estadoB = await pedir(db, BEA, 'select user_id from public.v_estado_pregunta_usuario')
    ok(estadoB.every(x => x.user_id === BEA), 'y B solo ve lo suyo')
    const conTema = await s('select tema_id from public.v_estado_pregunta_usuario where user_id = $1 and pregunta_id = $2', [ANA, P1])
    ok(conTema[0]?.tema_id === T1, 'el servidor la ve con el tema de cada pregunta (la app, cuando T10 le deje ver las preguntas)')

    // Las respuestas de los casos y v_casos_para_revisar
    const caso = (u, idp, bien) => intenta(db, u, `insert into public.pregunta_respondida
        (user_id, tipo_pregunta, id_pregunta, id_caso, respuesta, es_correcta, modo) values ($1, 'minicaso', $2, 'MC1', 'a', $3, 'practica')`,
    [u, idp, bien])
    const c1 = await caso(ANA, 'MC1-1', false)
    const c2 = await caso(ANA, 'MC1-2', true)
    ok(!c1.error && !c2.error, `la app apunta sus respuestas a los casos ${c1.error ?? c2.error ?? ''}`)
    const revisar = await pedir(db, ANA, 'select tipo_pregunta, id_caso, contestadas, aciertos, pct_aciertos from public.v_casos_para_revisar')
    ok(revisar.length === 1 && revisar[0].id_caso === 'MC1' && revisar[0].contestadas === 2 && revisar[0].aciertos === 1
       && Number(revisar[0].pct_aciertos) === 50,
    `v_casos_para_revisar: el minicaso con el 50 % sale para revisar (${JSON.stringify(revisar)})`)
    await new Promise(r => setTimeout(r, 5))
    await caso(ANA, 'MC1-1', true)
    const revisar2 = await pedir(db, ANA, 'select id_caso from public.v_casos_para_revisar')
    ok(revisar2.length === 0, 'acertada después la que falló (cuenta la última respuesta), ya no sale')
    await caso(ANA, 'MC1-2', false)
    const revisarB = await pedir(db, BEA, 'select id_caso from public.v_casos_para_revisar')
    ok(revisarB.length === 0 && (await pedir(db, BEA, 'select * from public.pregunta_respondida')).length === 0,
      'B no ve los casos ni las respuestas de A')
    const casoOtro = await intenta(db, BEA, `insert into public.pregunta_respondida (user_id, tipo_pregunta, id_pregunta, respuesta, es_correcta)
        values ($1, 'minicaso', 'MC1-1', 'a', true)`, [ANA])
    ok(RLS.test(casoOtro.error ?? ''), `ni apunta a su nombre: ${txt(casoOtro)}`)

    // La actividad
    const act = await intenta(db, ANA, `insert into public.study_activity_log (user_id, tipo, duracion_min, completado, started_at,
        completed_at, bloque_id, tema_id, plan_id, step_id, oposicion_id, metadata)
        values ($1, 'test', 10, true, now() - interval '10 minutes', now(), $2, $3, null, null, $4, '{"aciertos": 8}') returning id`,
    [ANA, B1, T1, OPO_A])
    ok(!act.error, `la app apunta su actividad con las 12 columnas que manda activityLog.ts ${act.error ?? ''}`)
    const actMal = await intenta(db, ANA, `insert into public.study_activity_log (user_id, tipo) values ($1, 'tutor')`, [ANA])
    ok(/study_activity_log_tipo_check/.test(actMal.error ?? ''), `un tipo que no está en la lista no entra: ${txt(actMal)}`)
    ok((await pedir(db, BEA, 'select * from public.study_activity_log')).length === 0, 'B no ve la actividad de A')

    // Los simulacros
    const viejo = await intenta(db, ANA, `insert into public.simulacros (user_id, oposicion_id) values ($1, $2)`, [ANA, OPO_A])
    const leeViejo = await intenta(db, ANA, 'select * from public.simulacros')
    ok(denegado(viejo) && !leeViejo.error && leeViejo.filas.length === 0,
      `simulacros: la app la lee (vacía) y nadie la escribe desde la app (${txt(viejo)})`)
    const sesion = await intenta(db, ANA, `insert into public.simulacro_sesiones (user_id, oposicion_id, prueba, apto, puntuacion, maximo_posible, detalle)
        values ($1, $2, 'gc_teorico', true, 81.5, 100, '[{"clave":"conocimientos","apto":true}]') returning id`, [ANA, OPO_G])
    const sinDetalle = await intenta(db, ANA, `insert into public.simulacro_sesiones (user_id, oposicion_id, prueba, apto)
        values ($1, $2, 'gc_teorico', false)`, [ANA, OPO_G])
    ok(!sesion.error && /detalle_no_vacio/.test(sinDetalle.error ?? ''),
      `simulacro_sesiones: la app apunta su sesión; sin el desglose, no (${txt(sinDetalle)})`)
    ok((await pedir(db, BEA, 'select * from public.simulacro_sesiones')).length === 0, 'B no ve los simulacros de A')

    // El sorteo
    const lote = await s(`select id from public.preguntas_aleatorias(null, '{}', 20)`)
    ok(lote.length === 3 && !lote.some(p => [P3, P4].includes(p.id)),
      'preguntas_aleatorias: solo las verificadas, sin las de examen oficial')
    const conOficiales = await s(`select id from public.preguntas_aleatorias(null, '{}', 20, true)`)
    const sinP1 = await s(`select id from public.preguntas_aleatorias(array['${E1}']::uuid[], array['${P1}']::uuid[], 20)`)
    const una = await s(`select id from public.preguntas_aleatorias(null, '{}', 1)`)
    ok(conOficiales.length === 4 && sinP1.length === 1 && sinP1[0].id === P2 && una.length === 1,
      'con las oficiales si se piden, por epígrafe, sin las excluidas y con tope')
    const loteApp = await intenta(db, ANA, `select id from public.preguntas_aleatorias(null, '{}', 20)`)
    const loteAnon = await intenta(db, 'anon', `select id from public.preguntas_aleatorias(null, '{}', 20)`)
    ok(!loteApp.error && loteApp.filas.length === 0 && denegado(loteAnon),
      `la app la llama y, con la RLS del contenido (hasta T10), no saca nada; anon no la llama (${txt(loteAnon)})`)
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('4) LA OPOSICIÓN: el catálogo y la elección se leen y no se escriben desde la app')
  {
    await s(`insert into public.catalogo_tests (oposicion_id, orden, desde) values
        ($1, 1, now() - interval '1 day'), ($2, 2, now() + interval '7 days')`, [OPO_A, OPO_G])
    const cat = await pedir(db, ANA, 'select oposicion_id from public.catalogo_tests')
    ok(cat.length === 1 && cat[0].oposicion_id === OPO_A, 'la app ve las oposiciones del catálogo cuyo «desde» ya ha llegado')
    ok(denegado(await intenta(db, 'anon', 'select * from public.catalogo_tests')), 'anon no lee el catálogo')
    const ordenRepe = await intenta(db, 'service_role', `update public.catalogo_tests set orden = 1 where oposicion_id = $1`, [OPO_G])
    ok(/duplicate key/.test(ordenRepe.error ?? ''), `dos oposiciones no comparten puesto en el catálogo: ${txt(ordenRepe)}`)

    for (const [u, o] of [[ANA, OPO_A], [BEA, OPO_A], [CAR, OPO_A], [DAN, OPO_A], [EVA, OPO_A], [FER, OPO_A], [GIL, OPO_A], [HUGO, OPO_A]]) {
      await s('insert into public.eleccion_oposicion (user_id, oposicion_id) values ($1, $2)', [u, o])
    }
    await s(`insert into public.cambios_oposicion (user_id, de_oposicion, a_oposicion, cuenta, motivo) values ($1, null, $2, false, 'eleccion_inicial')`,
      [ANA, OPO_A])
    const mia = await pedir(db, ANA, 'select user_id, plaza, oposicion_id from public.eleccion_oposicion')
    ok(mia.length === 1 && mia[0].user_id === ANA && mia[0].plaza === 1, 'cada uno ve su elección, y solo la suya')
    const elegir = await intenta(db, IVAN, `insert into public.eleccion_oposicion (user_id, oposicion_id) values ($1, $2)`, [IVAN, OPO_A])
    const cambiar = await intenta(db, ANA, `update public.eleccion_oposicion set oposicion_id = $1`, [OPO_G])
    ok(denegado(elegir) && denegado(cambiar), 'la app no elige ni cambia la oposición (lo hace la función de T17)')
    const plaza2 = await intenta(db, 'service_role', `insert into public.eleccion_oposicion (user_id, plaza, oposicion_id) values ($1, 2, $2)`, [ANA, OPO_G])
    ok(/eleccion_oposicion_una_plaza/.test(plaza2.error ?? ''), `la plaza 2 («Añadir otra») todavía no existe: ${txt(plaza2)}`)
    const malMotivo = await intenta(db, 'service_role', `insert into public.cambios_oposicion (user_id, de_oposicion, a_oposicion, cuenta, motivo)
        values ($1, $2, $3, true, 'exento_prueba')`, [ANA, OPO_A, OPO_G])
    ok(/cuenta_segun_motivo/.test(malMotivo.error ?? ''), `un cambio exento no gasta los 30 días: ${txt(malMotivo)}`)
    ok(denegado(await intenta(db, ANA, 'select * from public.cambios_oposicion')), 'la app no lee el historial')
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('5) LAS SUSCRIPCIONES Y tiene_acceso: el sandbox de una cuenta normal no cuenta')
  {
    const sus = (u, { plataforma = 'apple', entorno = 'produccion', estado = 'activa', fin = `now() + interval '20 days'`,
      producto = 'com.persevera.tests.una.mensual', duracion = 'mensual', ext } = {}) => intenta(db, 'service_role',
      `insert into public.suscripciones (user_id, plataforma, entorno, producto, duracion, estado, fin_periodo, id_externo)
       values ($1, $2, $3, $4, $5, $6, ${fin}, $7) returning id`,
      [u, plataforma, entorno, plataforma === 'manual' ? null : producto, plataforma === 'manual' ? null : duracion, estado,
        ext ?? `${u}-${plataforma}-${estado}-${Math.random()}`])
    const altas = []
    for (const alta of [
      () => sus(ANA),
      () => sus(BEA, { entorno: 'sandbox' }),
      () => sus(CAR, { entorno: 'sandbox', plataforma: 'google', producto: 'tests_una:anual', duracion: 'anual' }),
      () => sus(DAN, { estado: 'caducada' }),
      () => sus(EVA, { estado: 'reembolsada', plataforma: 'web', producto: 'tests_una_semestral', duracion: 'semestral' }),
      () => sus(FER, { estado: 'cancelada', plataforma: 'web', producto: 'tests_una_sinprueba_anual', duracion: 'anual' }),
      () => sus(GIL, { fin: `now() - interval '2 hours'` }),
      () => sus(HUGO, { plataforma: 'manual', fin: 'null' }),
      () => sus(IVAN),
    ]) altas.push(await alta())
    ok(altas.every(a => !a.error), `el servidor da de alta las compras ${altas.filter(a => a.error).map(a => a.error).join(' | ')}`)
    await s(`insert into public.cuentas_de_prueba (user_id, tipo, nota) values ($1, 'qa', 'pruebas del equipo')`, [CAR])

    const acceso = async (quien, u, o = OPO_A) => (await pedir(db, quien, 'select public.tiene_acceso($1, $2) x', [u, o]))[0].x
    ok(await acceso(ANA, ANA) === true, 'A, con una compra de producción activa y su oposición: sí')
    ok(await acceso(ANA, ANA, OPO_G) === false, 'A, con otra oposición que no es la suya: no')
    ok(await acceso(BEA, BEA) === false, 'B, cuenta normal con una compra de sandbox: no')
    ok(await acceso('service_role', BEA) === false, 'tampoco preguntando desde el servidor')
    ok(await acceso(CAR, CAR) === true, 'C, cuenta de prueba (qa) con una compra de sandbox: sí')
    ok(await acceso(DAN, DAN) === false && await acceso(EVA, EVA) === false, 'D (caducada) y E (reembolsada): no')
    ok(await acceso(FER, FER) === true, 'F, cancelada pero pagada hasta fin de periodo: sí')
    ok(await acceso(GIL, GIL) === true, 'G, con la renovación de hace 2 horas sin llegar: sí (24 horas de margen)')
    await s(`update public.suscripciones set fin_periodo = now() - interval '25 hours' where user_id = $1`, [GIL])
    ok(await acceso(GIL, GIL) === false, 'G, pasadas 25 horas: no')
    ok(await acceso(HUGO, HUGO) === true, 'H, acceso manual activo sin fecha: sí')
    ok(await acceso(IVAN, IVAN) === false, 'I, que paga pero no ha elegido oposición: no')
    for (const est of ['pausada', 'caducada', 'reembolsada']) {
      await s('update public.suscripciones set estado = $2, fin_periodo = now() + interval \'5 days\' where user_id = $1', [DAN, est])
      ok(await acceso(DAN, DAN) === false, `D, ${est} aunque su fecha de fin no haya llegado: no`)
    }
    ok(await acceso(ANA, FER) === false && await acceso('service_role', FER) === true,
      'A, preguntando por F (que sí tiene acceso): false; el servidor, sin sesión, sí lo sabe')
    ok(await acceso(ANA, null) === false && await acceso(ANA, ANA, null) === false, 'sin usuario o sin oposición: no')
    ok(denegado(await intenta(db, 'anon', 'select public.tiene_acceso($1, $2)', [ANA, OPO_A])), 'anon no la llama')

    await s(`update public.cuentas_de_prueba set caduca_at = now() - interval '1 minute' where user_id = $1`, [CAR])
    ok(await acceso(CAR, CAR) === false, 'C, con su cuenta de prueba caducada, ya no cuenta el sandbox')
    await s(`update public.cuentas_de_prueba set caduca_at = null where user_id = $1`, [CAR])

    const verB = await pedir(db, BEA, 'select * from public.suscripciones')
    const verC = await pedir(db, CAR, 'select * from public.suscripciones')
    const verA = await pedir(db, ANA, 'select user_id from public.suscripciones')
    ok(verB.length === 0 && verC.length === 1 && verA.length === 1 && verA[0].user_id === ANA,
      'cada uno ve sus compras; las de sandbox, solo una cuenta de prueba')
    const soy = async u => (await pedir(db, u, 'select public.soy_cuenta_de_prueba() x'))[0].x
    ok(await soy(CAR) === true && await soy(BEA) === false, 'soy_cuenta_de_prueba: C sí, B no')
    ok(denegado(await intenta(db, ANA, 'select public.tipo_cuenta_de_prueba($1)', [CAR])), 'la app no pregunta de qué tipo es otra cuenta')

    // Lo que no entra
    const malas = [
      ['un producto que no está en productos_tienda', () => sus(JUAN, { producto: 'com.persevera.tests.una.trimestral' }), /suscripciones_producto_conocido/],
      ['un producto con otra duración', () => sus(JUAN, { producto: 'com.persevera.tests.una.mensual', duracion: 'anual' }), /suscripciones_producto_conocido/],
      ['un producto de otra plataforma', () => sus(JUAN, { plataforma: 'google' }), /suscripciones_producto_conocido/],
      ['una activa sin fecha de fin', () => sus(JUAN, { fin: 'null' }), /suscripciones_con_fin/],
      ['una manual cancelada sin fecha', () => sus(JUAN, { plataforma: 'manual', estado: 'cancelada', fin: 'null' }), /suscripciones_con_fin/],
      ['la misma compra dos veces', () => sus(JUAN, { ext: 'repetida' }).then(() => sus(KIKO, { ext: 'repetida' })), /suscripciones_compra/],
    ]
    for (const [que, intento, patron] of malas) {
      const r = await intento()
      ok(patron.test(r.error ?? ''), `no entra ${que}: ${txt(r)}`)
    }
    await s(`delete from public.suscripciones where id_externo = 'repetida'`)
    const manualProd = await intenta(db, 'service_role', `insert into public.suscripciones (user_id, plataforma, producto, duracion, estado, id_externo)
        values ($1, 'manual', 'tests_una_mensual', 'mensual', 'activa', 'x1')`, [JUAN])
    ok(/suscripciones_producto_de_tienda/.test(manualProd.error ?? ''), `una manual no lleva producto de tienda: ${txt(manualProd)}`)

    // Los productos: los identificadores de la guía (anexo C.1)
    const producto = (plat, id, dur) => intenta(db, 'service_role',
      `insert into public.productos_tienda (plataforma, product_id, duracion, importe_centimos) values ($1, $2, $3, 1999) returning product_id`, [plat, id, dur])
    const buenos = [await producto('apple', 'com.persevera.tests.dos.anual', 'anual'),
      await producto('google', 'tests_dos:mensual', 'mensual'), await producto('web', 'tests_dos_sinprueba_semestral', 'semestral')]
    ok(buenos.every(b => !b.error), `entran los de «dos» oposiciones con su forma de cada tienda ${buenos.map(b => b.error ?? '').join('')}`)
    const malos = []
    for (const [plat, id] of [['apple', 'tests_una_mensual'], ['google', 'tests_una.mensual'],
      ['web', 'com.persevera.tests.una.mensual'], ['web', 'tests_tres_mensual']]) malos.push(await producto(plat, id, 'mensual'))
    ok(malos.every(m => /productos_tienda_id_valido/.test(m.error ?? '')),
      `un identificador con la forma de otra tienda, o inventado, no entra ${malos.filter(m => !/productos_tienda_id_valido/.test(m.error ?? '')).map(txt).join(' | ')}`)
    const durMal = await producto('web', 'tests_dos_anual', 'mensual')
    ok(/productos_tienda_duracion_del_id/.test(durMal.error ?? ''), `la duración es la del identificador: ${txt(durMal)}`)
    await s(`delete from public.productos_tienda where product_id like 'tests_dos%' or product_id like 'com.persevera.tests.dos%'`)
    ok((await one(db, 'select count(*)::int n from public.productos_tienda')).n === 12, 'quedan los 12 productos de lanzamiento')

    // Las fechas de la fila
    const antes = await one(db, 'select creada_at, actualizada_at from public.suscripciones where user_id = $1', [ANA])
    const fecha = await intenta(db, 'service_role', `update public.suscripciones set creada_at = now() - interval '1 year' where user_id = $1`, [ANA])
    ok(/fecha de creación/.test(fecha.error ?? ''), `la fecha de alta no se cambia, ni desde el servidor: ${txt(fecha)}`)
    await new Promise(r => setTimeout(r, 5))
    await s(`update public.suscripciones set renueva = false where user_id = $1`, [ANA])
    const despues = await one(db, 'select creada_at, actualizada_at from public.suscripciones where user_id = $1', [ANA])
    ok(+despues.creada_at === +antes.creada_at && despues.actualizada_at > antes.actualizada_at, 'y la de cambio la pone la base')
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('6) NADIE SALVO EL SERVIDOR ESCRIBE suscripciones, eventos_pago, pruebas_usadas NI cuentas_de_prueba')
  {
    await s(`insert into public.pruebas_usadas (user_id, plataforma, id_externo) values ($1, 'apple', 'prueba-kiko')`, [KIKO])
    await s(`insert into public.eventos_pago (fuente, evento_id, tipo, user_id, payload) values ('revenuecat', 'ev-1', 'INITIAL_PURCHASE', $1, '{}')`, [ANA])
    const intentos = {
      suscripciones: [`insert into public.suscripciones (user_id, plataforma, estado, id_externo) values ('${ANA}', 'manual', 'activa', 'gratis')`,
        `update public.suscripciones set fin_periodo = now() + interval '10 years'`, 'delete from public.suscripciones'],
      eventos_pago: [`insert into public.eventos_pago (fuente, evento_id, tipo, payload) values ('revenuecat', 'ev-falso', 'RENEWAL', '{}')`,
        `update public.eventos_pago set procesado_at = now()`, 'delete from public.eventos_pago'],
      pruebas_usadas: [`insert into public.pruebas_usadas (user_id, plataforma, id_externo) values ('${ANA}', 'web', 'x')`,
        'update public.pruebas_usadas set user_id = null', 'delete from public.pruebas_usadas'],
      cuentas_de_prueba: [`insert into public.cuentas_de_prueba (user_id, tipo) values ('${ANA}', 'qa')`,
        `update public.cuentas_de_prueba set caduca_at = null`, 'delete from public.cuentas_de_prueba'],
    }
    for (const [tabla, sqls] of Object.entries(intentos)) {
      const mal = []
      for (const quien of ['anon', ANA, CAR]) {
        for (const sql of [`select * from public.${tabla}`, ...sqls]) {
          if (tabla === 'suscripciones' && quien !== 'anon' && sql.startsWith('select')) continue
          const r = await intenta(db, quien, sql)
          if (!denegado(r)) mal.push(`${quien === 'anon' ? 'anon' : quien === ANA ? 'A' : 'C'} ${sql.split(' ')[0]}: ${txt(r)}`)
        }
      }
      ok(mal.length === 0, `${tabla}: ni anon ni la app ${tabla === 'suscripciones' ? 'la escriben (la app solo lee las suyas)' : 'la leen ni la escriben'}, tampoco una cuenta de prueba ${mal.join(' | ')}`)
    }
    const resto = []
    for (const t of ['catalogo_tests', 'eleccion_oposicion', 'cambios_oposicion', 'productos_tienda', 'version_terminos',
      'aceptaciones_terminos', 'avisos_renovacion', 'version_minima_app']) {
      for (const sql of [`update public.${t} set ${t === 'version_minima_app' ? 'version' : t === 'productos_tienda' ? 'importe_centimos' : t === 'version_terminos' ? 'version' : t === 'aceptaciones_terminos' ? 'version' : t === 'avisos_renovacion' ? 'resend_id' : t === 'catalogo_tests' ? 'orden' : t === 'eleccion_oposicion' ? 'oposicion_id' : 'motivo'} = null`, `delete from public.${t}`]) {
        const r = await intenta(db, ANA, sql)
        if (!denegado(r)) resto.push(`${t} ${sql.split(' ')[0]}: ${txt(r)}`)
      }
    }
    ok(resto.length === 0, `y lo mismo con el resto de lo del servidor (catálogo, elección, historial, productos, términos, avisos y versión mínima) ${resto.join(' | ')}`)
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('7) prueba_disponible: una prueba por persona, en cualquier canal')
  {
    const disp = async u => (await pedir(db, u, 'select public.prueba_disponible() x'))[0].x
    ok(await disp(JUAN) === true, 'sin compras ni pruebas: sí')
    ok(await disp(ANA) === false, 'con una compra de tienda (aunque no fuera de prueba): no')
    ok(await disp(HUGO) === true, 'con solo un acceso manual: sí')
    ok(await disp(KIKO) === false, 'con una prueba ya empezada: no')
    ok(await disp(BEA) === true, 'cuenta normal con solo compras de sandbox: sí (el sandbox no cuenta)')
    ok(await disp(CAR) === false, 'cuenta de prueba con una compra de sandbox: no')
    ok((await pedir(db, 'service_role', 'select public.prueba_disponible() x'))[0].x === false, 'sin sesión (el servidor): false')
    ok(denegado(await intenta(db, 'anon', 'select public.prueba_disponible()')), 'anon no la llama')
    const huella = await intenta(db, 'service_role', `insert into public.pruebas_usadas (user_id, plataforma, id_externo, huella_tarjeta)
        values ($1, 'apple', 'x-huella', 'fp_1')`, [JUAN])
    ok(/pruebas_usadas_huella_solo_web/.test(huella.error ?? ''), `la huella de la tarjeta solo existe en la web: ${txt(huella)}`)
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('8) registrar_aceptacion: la versión la pone el servidor')
  {
    const sin = await intenta(db, ANA, `select public.registrar_aceptacion('web', 'registro')`)
    ok(/todavía no hay términos publicados/.test(sin.error ?? ''), `sin términos publicados no apunta nada: ${txt(sin)}`)
    await s(`insert into public.version_terminos (version) values ('2026-11-01')`)
    const dos = await intenta(db, 'service_role', `insert into public.version_terminos (id, version) values (true, 'otra')`)
    ok(/duplicate key/.test(dos.error ?? ''), 'una sola versión vigente')
    const r = await intenta(db, ANA, `select public.registrar_aceptacion('ios', 'muro')`)
    const fila = await one(db, 'select user_id, version, canal, origen from public.aceptaciones_terminos')
    ok(!r.error && fila?.user_id === ANA && fila.version === '2026-11-01' && fila.canal === 'ios' && fila.origen === 'muro',
      `A acepta en el muro de iOS: se apunta con la versión vigente (${JSON.stringify(fila)})`)
    const mal = await intenta(db, ANA, `select public.registrar_aceptacion('stripe', 'muro')`)
    ok(/canal no válido/.test(mal.error ?? ''), `un canal que no existe, no: ${txt(mal)}`)
    ok(denegado(await intenta(db, 'anon', `select public.registrar_aceptacion('web', 'registro')`)), 'anon no la llama')
    ok(denegado(await intenta(db, ANA, 'select * from public.aceptaciones_terminos')), 'la app no lee las aceptaciones')
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('9) REPORTES, EMBUDO Y VERSIÓN MÍNIMA')
  {
    const reportar = (u, tabla, id, item = null, motivo = 'respuesta') => intenta(db, u,
      `insert into public.reportes_pregunta (tabla, pregunta_id, item, motivo, texto) values ($1, $2, $3, $4, 'La correcta es la B') returning id, user_id, estado`,
      [tabla, id, item, motivo])
    const r1 = await reportar(ANA, 'preguntas', P1)
    ok(!r1.error && r1.filas[0].user_id === ANA && r1.filas[0].estado === 'pendiente', `A reporta una pregunta: queda a su nombre y pendiente ${r1.error ?? ''}`)
    const r2 = await reportar(ANA, 'preguntas', P1)
    ok(/duplicate key/.test(r2.error ?? ''), 'la misma pregunta, una vez por persona')
    const gen = await reportar(ANA, 'psicotecnico_generado', null, JSON.stringify({ enunciado: '2, 4, 8, ?', opciones: ['10', '12', '16', '18'] }))
    const genMal = await reportar(ANA, 'psicotecnico_generado', 'abc')
    ok(!gen.error && /reportes_pregunta_id_o_copia/.test(genMal.error ?? ''),
      `un psicotécnico generado se reporta con la copia del ítem, no con un id (${txt(genMal)})`)
    const estadoPropio = await intenta(db, ANA, `insert into public.reportes_pregunta (tabla, pregunta_id, motivo, estado) values ('preguntas', 'x', 'otro', 'corregida')`)
    const aOtro = await intenta(db, ANA, `insert into public.reportes_pregunta (user_id, tabla, pregunta_id, motivo) values ($1, 'preguntas', 'x', 'otro')`, [BEA])
    ok(denegado(estadoPropio) && denegado(aOtro), 'la app no pone el estado ni reporta a nombre de otro')
    const largo = await intenta(db, ANA, `insert into public.reportes_pregunta (tabla, pregunta_id, motivo, texto) values ('preguntas', 'y', 'otro', repeat('a', 501))`)
    ok(/check constraint/.test(largo.error ?? ''), 'el texto, hasta 500 letras')
    ok((await pedir(db, BEA, 'select * from public.reportes_pregunta')).length === 0, 'B no ve los reportes de A')
    const cambia = await intenta(db, ANA, `update public.reportes_pregunta set estado = 'descartada'`)
    const borra = await intenta(db, ANA, 'delete from public.reportes_pregunta')
    ok(denegado(cambia) && denegado(borra), 'ni los cambia ni los borra')
    const errores = []
    for (let i = 1; i <= 20; i++) {
      const r = await reportar(BEA, 'marcado_items', `item-${i}`)
      if (r.error) errores.push(`el ${i}.º: ${r.error}`)
    }
    const veintiuno = await reportar(BEA, 'marcado_items', 'item-21')
    ok(errores.length === 0 && /tope de reportes de hoy/.test(veintiuno.error ?? ''),
      `tope de 20 al día: entran los 20 de B y el 21.º da ${txt(veintiuno)} ${errores.join(' | ')}`)
    const servidor = await intenta(db, 'service_role', `update public.reportes_pregunta set estado = 'corregida', revisado_at = now() where user_id = $1 returning id`, [ANA])
    const delServidor = await intenta(db, 'service_role', `insert into public.reportes_pregunta (user_id, tabla, pregunta_id, motivo) values ($1, 'preguntas', 'srv', 'otro')`, [BEA])
    ok(!servidor.error && servidor.filas.length === 2 && !delServidor.error, 'el servidor los revisa, y para él no hay tope')

    // El embudo
    const apuntar = (u, paso, opo = OPO_A) => intenta(db, u, `insert into public.embudo (paso, canal, oposicion_id) values ($1, 'web', $2)`, [paso, opo])
    const e1 = await apuntar(ANA, 'paywall_visto')
    const e2 = await apuntar(ANA, 'paywall_visto')
    const e3 = await apuntar(ANA, 'compra_empezada')
    const e4 = await apuntar(ANA, 'paywall_visto', OPO_G)
    const filas = (await one(db, 'select count(*)::int n from public.embudo where user_id = $1', [ANA])).n
    ok(![e1, e2, e3, e4].some(e => e.error) && filas === 3,
      `un paso cuenta una vez al día por persona y oposición: la repetición se ignora sin error (${filas} filas)`)
    ok(denegado(await intenta(db, ANA, 'select * from public.embudo')), 'la app apunta en el embudo y no lo lee')
    const embudoOtro = await intenta(db, ANA, `insert into public.embudo (user_id, paso, canal) values ($1, 'paywall_visto', 'ios')`, [BEA])
    ok(denegado(embudoOtro) && denegado(await apuntar('anon', 'muestra_empezada')), 'ni apunta por otro, ni anon apunta')
    const pasoMal = await apuntar(ANA, 'pagado')
    ok(/check constraint/.test(pasoMal.error ?? ''), 'solo los tres pasos de la lista (el pago sale de RevenueCat)')

    // La versión mínima
    const vAnon = await intenta(db, 'anon', 'select plataforma, version from public.version_minima_app order by 1')
    const vApp = await intenta(db, ANA, 'select plataforma, version from public.version_minima_app')
    ok(!vAnon.error && vAnon.filas.length === 2 && vAnon.filas.every(f => f.version === '0.0.0') && vApp.filas?.length === 2,
      'la versión mínima la leen anon y la app; arranca en 0.0.0 (no obliga a nadie)')
    const vMal = await intenta(db, 'service_role', `update public.version_minima_app set version = '1.x' where plataforma = 'ios'`)
    ok(/check constraint/.test(vMal.error ?? ''), 'una versión con otra forma no entra')
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('10) SERVICE_ROLE PUEDE TODO')
  {
    const mal = []
    for (const [tabla, esp] of Object.entries(MATRIZ)) {
      if (esp.vista) continue
      const col = (await one(db, `select column_name from information_schema.columns
          where table_schema = 'public' and table_name = $1 order by ordinal_position limit 1`, [tabla])).column_name
      const lee = await intenta(db, 'service_role', `select count(*)::int n from public.${tabla}`)
      const cambia = await intenta(db, 'service_role', `update public.${tabla} set ${col} = ${col} returning 1`)
      if (lee.error || cambia.error || (lee.filas[0].n > 0 && cambia.filas.length === 0)) mal.push(`${tabla}: ${lee.error ?? cambia.error ?? 'no cambió'}`)
    }
    ok(mal.length === 0, `lee y cambia todas las filas de todas las tablas (también las del contenido, con su disparador) ${mal.join(' | ')}`)
    const vistas = await intenta(db, 'service_role', `select (select count(*) from public.v_estado_pregunta_usuario)::int a,
        (select count(*) from public.v_casos_para_revisar)::int b`)
    ok(!vistas.error && vistas.filas[0].a >= 3, 'y lee las dos vistas, de todos los usuarios')
    const borra = await ejecutar(db, 'service_role', `
      delete from public.eventos_pago where evento_id = 'ev-1';
      delete from public.cuentas_de_prueba where user_id = '${CAR}';
      insert into public.cuentas_de_prueba (user_id, tipo) values ('${CAR}', 'revisor');`)
    ok(!borra.error, `borra y da de alta en lo suyo ${borra.error ?? ''}`)
  }

  // ───────────────────────────────────────────────────────────────────────────
  seccion('11) BORRAR LA CUENTA')
  {
    await s(`insert into public.pruebas_usadas (user_id, plataforma, id_externo, huella_tarjeta) values ($1, 'web', 'prueba-ana', 'fp_ana')`, [ANA])
    await s(`insert into public.eventos_pago (fuente, evento_id, tipo, user_id, payload) values ('revenuecat', 'ev-ana', 'RENEWAL', $1, '{}')`, [ANA])
    await s(`insert into public.avisos_renovacion (user_id, plataforma, fecha_renovacion, duracion) values ($1, 'apple', current_date + 30, 'anual')`, [ANA])
    const tablasDeA = ['respuestas_usuario', 'pregunta_respondida', 'study_activity_log', 'simulacro_sesiones', 'eleccion_oposicion',
      'cambios_oposicion', 'suscripciones', 'aceptaciones_terminos', 'avisos_renovacion', 'reportes_pregunta', 'embudo']
    const cuenta = async () => one(db, `select ${tablasDeA.map(t => `(select count(*) from public.${t} where user_id = $1)::int as ${t}`).join(', ')}`, [ANA])
    const antes = await cuenta()
    ok(tablasDeA.every(t => antes[t] > 0), `A tiene filas en las ${tablasDeA.length} tablas suyas (${JSON.stringify(antes)})`)
    // auth.admin.deleteUser: lo hace supabase_auth_admin, el dueño de auth.users
    await db.exec('set session authorization supabase_auth_admin')
    let errBorrar = null
    try { await db.query('delete from auth.users where id = $1', [ANA]) } catch (e) { errBorrar = e.message } finally {
      await db.exec('set session authorization postgres')
    }
    ok(!errBorrar, `se borra la cuenta de A (${errBorrar ?? 'sin error'})`)
    const despues = await cuenta()
    ok(tablasDeA.every(t => despues[t] === 0), `no queda nada suyo en esas tablas ${JSON.stringify(despues)}`)
    const prueba = await one(db, `select user_id, huella_tarjeta from public.pruebas_usadas where id_externo = 'prueba-ana'`)
    ok(prueba && prueba.user_id === null && prueba.huella_tarjeta === 'fp_ana',
      'su prueba se queda sin usuario: lo que impide repetirla sobrevive al borrado')
    const evento = await one(db, `select user_id from public.eventos_pago where evento_id = 'ev-ana'`)
    ok(evento?.user_id === ANA, 'sus avisos de pago se quedan (qué hacer con ellos lo decide T21)')
    ok((await one(db, 'select count(*)::int n from public.respuestas_usuario where user_id = $1', [BEA])).n === 1, 'lo de B, intacto')
  }
  await db.close()

  // ───────────────────────────────────────────────────────────────────────────
  seccion('12) LA SEGUNDA CERRADURA: con permisos de más, los disparadores frenan')
  {
    const db2 = await montar(conGrantsAutomaticos)
    // Una fila en cada tabla del servidor que no tenga ya alguna
    await ejecutar(db2, 'service_role', `
      insert into public.catalogo_tests (oposicion_id, orden) values ('${OPO_A}', 1);
      insert into public.eleccion_oposicion (user_id, oposicion_id) values ('${ANA}', '${OPO_A}');
      insert into public.cambios_oposicion (user_id, a_oposicion, cuenta, motivo) values ('${ANA}', '${OPO_A}', false, 'eleccion_inicial');
      insert into public.suscripciones (user_id, plataforma, producto, duracion, estado, fin_periodo, id_externo)
        values ('${ANA}', 'apple', 'com.persevera.tests.una.mensual', 'mensual', 'caducada', now() - interval '1 day', 'c1');
      insert into public.cuentas_de_prueba (user_id, tipo) values ('${BEA}', 'qa');
      insert into public.pruebas_usadas (user_id, plataforma, id_externo) values ('${ANA}', 'apple', 'p1');
      insert into public.eventos_pago (fuente, evento_id, tipo, payload) values ('revenuecat', 'e1', 'TEST', '{}');
      insert into public.version_terminos (version) values ('1');
      insert into public.aceptaciones_terminos (user_id, version, canal, origen) values ('${ANA}', '1', 'web', 'registro');
      insert into public.avisos_renovacion (user_id, plataforma, fecha_renovacion) values ('${ANA}', 'web', current_date);`)
    const disparadores = (await q(db2, `select c.relname from pg_trigger t join pg_class c on c.oid = t.tgrelid
        where t.tgname = 'solo_servidor' and c.relnamespace = 'public'::regnamespace order by 1`)).map(x => x.relname)
    ok(JSON.stringify(disparadores) === JSON.stringify([...SOLO_SERVIDOR].sort()),
      `las ${SOLO_SERVIDOR.length} tablas del servidor llevan el disparador solo_servidor (${disparadores.length})`)
    // Alguien, por error, da todos los permisos a authenticated y abre las políticas
    const abrir = SOLO_SERVIDOR.map(t => `grant all on public.${t} to authenticated;
      create policy abierta on public.${t} for all to authenticated using (true) with check (true);`).join('\n')
    await db2.exec(abrir)
    const mal = []
    for (const t of SOLO_SERVIDOR) {
      const col = (await one(db2, `select column_name from information_schema.columns
          where table_schema = 'public' and table_name = $1 order by ordinal_position limit 1`, [t])).column_name
      if ((await one(db2, `select count(*)::int n from public.${t}`)).n === 0) { mal.push(`${t}: sin filas para probar`); continue }
      for (const sql of [`update public.${t} set ${col} = ${col}`, `delete from public.${t}`]) {
        const r = await intenta(db2, ANA, sql)
        if (!/solo la escribe el servidor/.test(r.error ?? '')) mal.push(`${t} ${sql.split(' ')[0]}: ${txt(r)}`)
      }
    }
    ok(mal.length === 0, `en las ${SOLO_SERVIDOR.length}, la app sigue sin cambiar ni borrar nada («solo la escribe el servidor») ${mal.join(' | ')}`)
    const altas = [
      ['suscripciones', `insert into public.suscripciones (user_id, plataforma, estado, id_externo) values ('${ANA}', 'manual', 'activa', 'gratis')`],
      ['eventos_pago', `insert into public.eventos_pago (fuente, evento_id, tipo, payload) values ('revenuecat', 'falso', 'RENEWAL', '{}')`],
      ['pruebas_usadas', `insert into public.pruebas_usadas (plataforma, id_externo) values ('web', 'borrar-rastro')`],
      ['cuentas_de_prueba', `insert into public.cuentas_de_prueba (user_id, tipo) values ('${ANA}', 'revisor')`],
      ['eleccion_oposicion', `insert into public.eleccion_oposicion (user_id, oposicion_id) values ('${CAR}', '${OPO_A}')`],
      ['preguntas', `insert into public.preguntas (enunciado) values ('inventada')`],
    ]
    const malAltas = []
    for (const [t, sql] of altas) {
      const r = await intenta(db2, ANA, sql)
      if (!/solo la escribe el servidor/.test(r.error ?? '')) malAltas.push(`${t}: ${txt(r)}`)
    }
    ok(malAltas.length === 0, `ni da de alta: suscripciones, eventos_pago, pruebas_usadas, cuentas_de_prueba, la elección ni el banco ${malAltas.join(' | ')}`)
    const fecha = await intenta(db2, 'service_role', `update public.suscripciones set creada_at = now() - interval '1 year'`)
    ok(/fecha de creación/.test(fecha.error ?? ''), 'la fecha de alta de una compra sigue fija')

    // Y si alguien quita el CHECK de la fecha de fin, tiene_acceso sigue sin dar
    // acceso a lo que no tiene fecha (falla cerrada)
    await db2.exec('alter table public.suscripciones drop constraint suscripciones_con_fin')
    let abiertas = 0
    for (const estado of ['activa', 'gracia', 'cancelada']) {
      await db2.query(`delete from public.suscripciones where user_id = $1`, [ANA])
      await db2.query(`insert into public.suscripciones (user_id, plataforma, producto, duracion, estado, id_externo)
          values ($1, 'apple', 'com.persevera.tests.una.mensual', 'mensual', $2, 'sin-fin')`, [ANA, estado])
      if ((await pedir(db2, ANA, 'select public.tiene_acceso($1, $2) x', [ANA, OPO_A]))[0].x) abiertas++
    }
    ok(abiertas === 0, 'sin la CHECK de la fecha de fin, una compra de tienda sin fecha sigue sin dar acceso')
    await db2.close()
  }
}


// ── Las dos pasadas ──────────────────────────────────────────────────────────
console.log(`Migraciones: ${MIGRACIONES.map(m => m.f).join(', ')}`)
console.log('\nPASADA 1: con los GRANT automáticos de Supabase (hasta el 30-oct-2026)')
await bateria(true)
const tras1 = { fallos, comprobaciones }
console.log(`\n→ pasada 1: ${tras1.comprobaciones} comprobaciones, ${tras1.fallos} fallo(s)`)

verboso = false
console.log('\nPASADA 2: sin GRANT automáticos (desde el 30-oct-2026); solo se imprime lo que falla')
await bateria(false)
console.log(`→ pasada 2: ${comprobaciones - tras1.comprobaciones} comprobaciones, ${fallos - tras1.fallos} fallo(s)`)

console.log(fallos ? `\n✗ ${fallos} fallo(s)` : `\n✓ Todo en orden: ${comprobaciones} comprobaciones en las dos pasadas`)
process.exit(fallos ? 1 : 0)
