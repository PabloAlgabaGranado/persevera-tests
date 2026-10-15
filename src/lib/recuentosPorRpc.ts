// Copiado de Persevera (src/lib/recuentosPorRpc.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. Tests usa dos de estas funciones, banco_de_test_por_tema
// (bancoDeTest.ts) y originales_recuento (OriginalesList.tsx, T6), y T10 crea
// solo esas: apartados_contestables es del plan, y flashcards_por_bloque y
// mapas_indice, de las flashcards y los mapas, que Tests no lleva. Nada aquí
// las llama. La prueba que ata RECUENTOS a la migración
// (recuentosPorRpc.test.ts, la que cita el comentario de RECUENTOS) llega con
// T10, que crea las funciones.

import { supabase } from './supabase'

// ═══════════════════════════════════════════════════════════════════════════
//   RECUENTOS E ÍNDICES POR RPC (fase 3 de la protección, día D)
// ---------------------------------------------------------------------------
//   Desde la fase 3 (docs/dia-d/especificacion.md §7) la RLS solo deja leer a
//   cada cual las preguntas, tarjetas y mapas de lo que tiene, más la muestra
//   gratis. Las pantallas y el planificador que CUENTAN leyendo esas tablas
//   pasarían a contar solo eso: quien no paga vería el banco del Tema 1, el plan
//   del onboarding saldría con tests solo en el Tema 1 y se guardaría así, y los
//   bloques con candado desaparecerían del selector.
//
//   Por eso los recuentos (y el índice de los mapas) se piden a funciones
//   SECURITY DEFINER de la base que escribe la pieza A
//   (`…_proteccion_3_recuentos.sql`): devuelven números y títulos, nunca el
//   contenido, y cuentan el banco entero como lo cuenta hoy la app.
//
//   ⚠️ RESPALDO. La 1.13 sale antes de que esas funciones existan en producción.
//   Si la función no existe (PostgREST: PGRST202; Postgres: 42883), o contesta
//   con una forma que no es la del contrato de abajo, se lee como hoy, de las
//   tablas. Antes de la fase 3 eso da el mismo número; la fase 3 no se enciende
//   hasta que las funciones estén y la 1.13 publicada (§7, condición de la
//   fase 3). Si la función existe y FALLA (un corte, un timeout), quien llama
//   decide: el planificador lanza como hoy (un plan con números falsos se
//   guarda; mejor que no se genere), y las pantallas leen como hoy.
//
//   El contrato de cada función, con sus nombres exactos, está en RECUENTOS: lo
//   comprueba contra la migración de A `recuentosPorRpc.test.ts`.
// ═══════════════════════════════════════════════════════════════════════════

/** Lo que la app espera de cada función: parámetros (por nombre, como los pasa
 *  PostgREST) y columnas que devuelve. Una fila por clave; las de 0 se pueden
 *  omitir salvo donde se dice. */
export const RECUENTOS = {
  /** Una fila por CADA tema de la oposición (`temas.oposicion_id`), también las
   *  de 0: un tema que no aparece se ofrece «por si acaso», y uno a 0 se esconde.
   *  Cuenta como `cargarBancoDeTestPorTemaDeTabla`: preguntas `verificada` con
   *  `fuente <> 'conv_real'` (una `fuente` NULL no cuenta, como el `.neq` de
   *  PostgREST), de los epígrafes del tema por `tema_epigrafe` si tiene alguno,
   *  y por `preguntas.tema_id` si no. */
  banco_de_test_por_tema: {
    parametros: { p_oposicion: 'uuid' },
    columnas: { tema_id: 'uuid', preguntas: 'integer' },
  },
  /** Las preguntas CONTESTABLES de cada caso de la oposición en `p_tabla`
   *  (`supuesto_original_preguntas` o `supuesto_oficial_preguntas`): `opcion_a ~
   *  PATRON_OPCION_CONTESTABLE` (loader.ts), contadas por `id_caso`, de los casos
   *  de `supuestos_originales` / `supuestos_oficiales` con `oposicion_id =
   *  p_oposicion`. Los casos a 0 se pueden omitir. */
  apartados_contestables: {
    parametros: { p_tabla: 'text', p_oposicion: 'uuid' },
    columnas: { id_caso: 'text', apartados: 'integer' },
  },
  /** Por cada bloque de la oposición, cuántas flashcards OFICIALES
   *  (`is_user_card = false`) distintas tienen sus temas por `tema_epigrafe`. */
  flashcards_por_bloque: {
    parametros: { p_oposicion: 'uuid' },
    columnas: { bloque_id: 'uuid', tarjetas: 'integer' },
  },
  /** `bloque, tema, titulo` de `mind_maps` con `oposicion_id = p_oposicion`, sin
   *  el contenido del mapa. */
  mapas_indice: {
    parametros: { p_oposicion: 'uuid' },
    columnas: { bloque: 'integer', tema: 'integer', titulo: 'text' },
  },
  /** Las preguntas de cada supuesto original de la oposición que el player puede
   *  servir, con el filtro de OriginalesList: `opcion_a ~ '\S'`. */
  originales_recuento: {
    parametros: { p_oposicion: 'uuid' },
    columnas: { id_caso: 'text', preguntas: 'integer' },
  },
} as const

export type NombreRecuento = keyof typeof RECUENTOS

/** El tope de filas de PostgREST, que también corta lo que devuelve una función.
 *  Ninguna de estas llega (los temas o casos de una oposición son cientos):
 *  si una lo alcanza, la respuesta está cortada y no se usa. */
const TOPE_FILAS = 1000

export type ResultadoRecuento<T> =
  | { estado: 'ok'; valor: T }
  /** La función no existe todavía, o contesta otra cosa: se lee como hoy. */
  | { estado: 'sin_rpc' }
  /** La función existe y ha fallado. */
  | { estado: 'error'; error: Error }

interface ErrorPostgrest { code?: string; message?: string }

/** ¿Dice el error que la función no existe? PGRST202 lo da PostgREST cuando no
 *  la encuentra en su caché del esquema; 42883, Postgres. */
export function noExisteLaFuncion(error: ErrorPostgrest | null | undefined): boolean {
  return error?.code === 'PGRST202' || error?.code === '42883'
}

const esEntero = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : NaN
  return Number.isInteger(n) && n >= 0 ? n : null
}
const esTexto = (v: unknown): v is string => typeof v === 'string' && v.length > 0

/** Filas `{clave, número}` → Map, o null si alguna no tiene la forma. */
function mapaDeConteos(data: unknown, clave: string, numero: string): Map<string, number> | null {
  if (!Array.isArray(data) || data.length >= TOPE_FILAS) return null
  const out = new Map<string, number>()
  for (const fila of data) {
    if (!fila || typeof fila !== 'object') return null
    const k = (fila as Record<string, unknown>)[clave]
    const n = esEntero((fila as Record<string, unknown>)[numero])
    if (!esTexto(k) || n === null) return null
    out.set(k, (out.get(k) ?? 0) + n)
  }
  return out
}

export interface EntradaIndiceMapa { bloque: number; tema: number; titulo: string }

/** Las funciones de lectura: lo que devuelve la base → lo que usa la app, o null
 *  si la forma no es la del contrato. Exportadas para atarlas con pruebas. */
export const LECTORES = {
  banco_de_test_por_tema: (d: unknown) => mapaDeConteos(d, 'tema_id', 'preguntas'),
  apartados_contestables: (d: unknown) => mapaDeConteos(d, 'id_caso', 'apartados'),
  flashcards_por_bloque: (d: unknown) => mapaDeConteos(d, 'bloque_id', 'tarjetas'),
  originales_recuento: (d: unknown) => mapaDeConteos(d, 'id_caso', 'preguntas'),
  mapas_indice: (d: unknown): EntradaIndiceMapa[] | null => {
    if (!Array.isArray(d) || d.length >= TOPE_FILAS) return null
    const out: EntradaIndiceMapa[] = []
    for (const fila of d) {
      if (!fila || typeof fila !== 'object') return null
      const { bloque, tema, titulo } = fila as Record<string, unknown>
      const b = esEntero(bloque)
      const t = esEntero(tema)
      if (b === null || t === null || (titulo != null && typeof titulo !== 'string')) return null
      out.push({ bloque: b, tema: t, titulo: (titulo as string | null) ?? '' })
    }
    return out
  },
} satisfies Record<NombreRecuento, (d: unknown) => unknown>

type Valor<N extends NombreRecuento> = NonNullable<ReturnType<(typeof LECTORES)[N]>>

/** Llama a la función `nombre` y lee su respuesta. Nunca lanza. */
export async function pedirRecuento<N extends NombreRecuento>(
  nombre: N,
  parametros: Record<keyof (typeof RECUENTOS)[N]['parametros'], string>,
): Promise<ResultadoRecuento<Valor<N>>> {
  let respuesta: { data: unknown; error: ErrorPostgrest | null }
  try {
    respuesta = await supabase.rpc(nombre, parametros)
  } catch (e) {
    return { estado: 'error', error: e instanceof Error ? e : new Error(String(e)) }
  }
  const { data, error } = respuesta
  if (error) {
    if (noExisteLaFuncion(error)) return { estado: 'sin_rpc' }
    return { estado: 'error', error: new Error(`${nombre}: ${error.message ?? error.code ?? 'error'}`) }
  }
  const valor = LECTORES[nombre](data) as Valor<N> | null
  if (valor === null) {
    // La función existe pero no contesta lo que se pactó: se avisa y se lee como
    // hoy. Un número a medias es peor que el de siempre.
    console.error(`[recuentos] ${nombre} no devuelve las columnas esperadas; se lee de las tablas`)
    return { estado: 'sin_rpc' }
  }
  return { estado: 'ok', valor }
}

/**
 * El recuento de la función o, si no está, el de hoy (`deTabla`).
 *
 * `siFalla`: qué hacer si la función existe y falla. `'lanzar'` para quien hoy
 * lanza (el planificador: no se guarda un plan con números falsos); `'tabla'`
 * para las pantallas, que hoy enseñan lo que leen.
 */
export async function recuentoConRespaldo<N extends NombreRecuento>(
  nombre: N,
  parametros: Record<keyof (typeof RECUENTOS)[N]['parametros'], string>,
  deTabla: () => Promise<Valor<N>>,
  siFalla: 'lanzar' | 'tabla',
): Promise<Valor<N>> {
  const r = await pedirRecuento(nombre, parametros)
  if (r.estado === 'ok') return r.valor
  if (r.estado === 'error') {
    if (siFalla === 'lanzar') throw r.error
    console.error(`[recuentos] ${r.error.message}; se lee de las tablas`)
  }
  return deTabla()
}

/**
 * El índice de los mapas mentales de una oposición (bloque, tema y título), en
 * orden. Lo usan el selector de mapas y el Dominio. Con la protección de
 * `mind_maps` encendida, leer la tabla solo vería los mapas que la RLS deja leer
 * (a quien no paga, el Tema 1 del Bloque 1), y el selector perdería los temas con
 * candado. Nunca lanza: como la lectura de siempre, un fallo da la lista vacía.
 */
export async function indiceDeMapas(oposicionId: string): Promise<EntradaIndiceMapa[]> {
  try {
    const indice = await recuentoConRespaldo('mapas_indice', { p_oposicion: oposicionId }, async () => {
      const { data } = await supabase.from('mind_maps')
        .select('bloque, tema, titulo')
        .eq('oposicion_id', oposicionId)
        .order('bloque').order('tema')
      return (data ?? []) as EntradaIndiceMapa[]
    }, 'tabla')
    return [...indice].sort((a, b) => a.bloque - b.bloque || a.tema - b.tema)
  } catch (e) {
    console.error('[recuentos] índice de mapas:', e)
    return []
  }
}
