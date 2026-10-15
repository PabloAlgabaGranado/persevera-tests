// Copiado de Persevera (src/lib/contextoTest.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

// ════════════════════════════════════════════════════════════════════════════
// Bloque y tema que se guardan en study_activity_log al terminar un test
// ════════════════════════════════════════════════════════════════════════════
//
// ⚠️ LO ELEGIDO MANDA SOBRE LO DEDUCIDO DE LAS PREGUNTAS, Y NUNCA UN BLOQUE AJENO.
//
// PERSEVERA comparte preguntas entre oposiciones por epígrafe: la misma pregunta
// de la Constitución la sirven varias, y su tema (y con él su bloque) es el de la
// oposición para la que se ESCRIBIÓ, no el de quien la contesta. Deducir el bloque
// de las preguntas guardaba bloques del Administrativo en tests del Auxiliar.
//
// Medido el 26-sep-2026 sobre study_activity_log (tests, flashcards y simulacros):
// el Auxiliar tenía 0 filas con un bloque suyo (194 con bloques del Administrativo);
// Agentes de Hacienda, 158 propias y todas del bloque III; Seguridad Social, 21 y
// todas del II. Ese bloque lo leen:
//   - el reto diario «variedad» (assign_daily_challenges_for_user apunta al bloque
//     menos trabajado, que era justo el que nunca se registraba: Auxiliar 0 de 24
//     cumplidos, SS 0 de 20, Agentes 1 de 62);
//   - fetchBloquesStats (userStats.ts): las barras por bloque de Progreso, el aviso
//     «Refuerza el bloque» y los logros y títulos de Dominio (bloques_pct).
// Reconstruyendo cada test histórico con sus respuestas, con esta regla las barras
// con datos pasarían de 0 a 20 en el Auxiliar, de 13 a 43 en Agentes y de 2 a 15 en
// SS; el Administrativo y Guardia Civil quedan igual. Se aplica solo a lo nuevo: las
// filas guardadas no se reescriben (decidido el 26-sep-2026).
//
// La regla, en orden:
//   1. Eligió UN bloque de su oposición → ese bloque.
//   2. Eligió temas enteros y/o epígrafes que caen TODOS en un mismo bloque de su
//      oposición → ese bloque. Cubre un tema (también la muestra gratuita), varios
//      temas del mismo bloque (la Consolidación del plan) y el test del plan acotado
//      a lo leído, que llega como «Todo» con los epígrafes de UN tema.
//   3. Si no, el bloque deducido de las preguntas (todas del mismo), solo si es de
//      su oposición.
//   4. Si no, null. Un bloque ajeno no se guarda nunca.
//
// El tema sigue el mismo criterio: el único tema de su oposición en el que cabe todo
// lo elegido; si no lo hay, el deducido de las preguntas (comportamiento de siempre:
// un tema ajeno lo descarta después el filtro de scope de fetchTemasDebiles).
//
// «Lo elegido» es lo que el selector de verdad aplica al buscar preguntas, copiado de
// `construirFiltroContenido` (TestSelectorModal.tsx): solo en práctica y mis fallos,
// los bloques solo con «Por bloque», los temas enteros solo con «Por tema» y los
// epígrafes sueltos con «Por tema» o «Todo». Si el opositor marca un bloque y luego
// cambia a «Examen real», la elección sigue viajando en `config` aunque ese examen
// no la aplique: no puede atribuirse un examen oficial entero a ese bloque.
// ════════════════════════════════════════════════════════════════════════════

import { supabase } from './supabase'

/** Lo que el test trae de la elección del opositor (subconjunto de `TestConfig`). */
export interface EleccionTest {
  modo: string
  contenido: 'todo' | 'por_bloque' | 'por_tema'
  bloquesSeleccionados?: string[]
  temasSeleccionados?: string[]
  epigrafeIds?: string[]
}

/** Lo único que se lee de cada pregunta: su tema y el bloque de ese tema. */
export interface PreguntaConTema {
  temas?: { id?: string | null; bloques?: { id?: string | null } | null } | null
}

/** Temario de la oposición activa, lo justo para decidir. */
export interface TemarioOposicion {
  /** Tema de la oposición → su bloque. Sus valores son los bloques de la oposición. */
  bloqueDeTema: ReadonlyMap<string, string>
  /** Epígrafe elegido → temas DE ESTA OPOSICIÓN que lo incluyen. */
  temasDeEpigrafe: ReadonlyMap<string, readonly string[]>
}

export interface ContextoTest {
  bloqueId: string | null
  temaId: string | null
}

/** Lo que el selector de verdad aplicó al buscar las preguntas. */
function eleccionAplicada(c: EleccionTest): { bloques: string[]; temas: string[]; epigrafes: string[] } {
  const nada = { bloques: [], temas: [], epigrafes: [] }
  if (c.modo !== 'practica' && c.modo !== 'mis_fallos') return nada
  if (c.contenido === 'por_bloque') return { ...nada, bloques: c.bloquesSeleccionados ?? [] }
  if (c.contenido === 'por_tema') return { ...nada, temas: c.temasSeleccionados ?? [], epigrafes: c.epigrafeIds ?? [] }
  return { ...nada, epigrafes: c.epigrafeIds ?? [] }
}

/** Si todos los conjuntos comparten exactamente un elemento, ese; si no, null. */
function unicoComun(conjuntos: ReadonlyArray<Iterable<string>>): string | null {
  if (conjuntos.length === 0) return null
  let comun = new Set(conjuntos[0])
  for (const c of conjuntos.slice(1)) {
    const s = new Set(c)
    comun = new Set([...comun].filter(x => s.has(x)))
  }
  return comun.size === 1 ? [...comun][0] : null
}

function unicoDeducido(ids: ReadonlyArray<string | null | undefined>): string | null {
  const s = new Set(ids.filter((x): x is string => !!x))
  return s.size === 1 ? [...s][0] : null
}

/** Regla pura (sin base de datos): ver la cabecera del fichero. */
export function contextoDelTest(
  config: EleccionTest,
  preguntas: ReadonlyArray<PreguntaConTema>,
  temario: TemarioOposicion,
): ContextoTest {
  const e = eleccionAplicada(config)
  const bloquesPropios = new Set(temario.bloqueDeTema.values())

  // ── Tema: el único de su oposición en el que cabe todo lo elegido ──
  // Un tema entero elegido se acepta tal cual, como siempre (viene del selector de
  // su oposición); un epígrafe, por los temas de SU oposición que lo incluyen.
  const temaElegido = unicoComun([
    ...e.temas.map(t => [t]),
    ...e.epigrafes.map(ep => temario.temasDeEpigrafe.get(ep) ?? []),
  ])
  const temaId = temaElegido ?? unicoDeducido(preguntas.map(p => p.temas?.id))

  // ── Bloque ──
  let bloqueId: string | null = null
  if (e.bloques.length === 1 && bloquesPropios.has(e.bloques[0])) {
    bloqueId = e.bloques[0]
  } else if (e.temas.length > 0 || e.epigrafes.length > 0) {
    const bloquesDe = (temas: readonly string[]) =>
      temas.map(t => temario.bloqueDeTema.get(t)).filter((b): b is string => !!b)
    bloqueId = unicoComun([
      ...e.temas.map(t => bloquesDe([t])),
      ...e.epigrafes.map(ep => bloquesDe(temario.temasDeEpigrafe.get(ep) ?? [])),
    ])
  }
  if (bloqueId === null) {
    const deducido = unicoDeducido(preguntas.map(p => p.temas?.bloques?.id))
    bloqueId = deducido && bloquesPropios.has(deducido) ? deducido : null
  }

  return { bloqueId, temaId }
}

// El temario no cambia en una sesión: los temas de cada oposición se piden una vez.
const cacheTemas = new Map<string, ReadonlyMap<string, string>>()

async function temasDeLaOposicion(oposicionId: string): Promise<ReadonlyMap<string, string>> {
  const hit = cacheTemas.get(oposicionId)
  if (hit) return hit
  const { data, error } = await supabase
    .from('temas')
    .select('id, bloque_id, bloques!inner(oposicion_id)')
    .eq('bloques.oposicion_id', oposicionId)
  if (error) throw error
  const mapa = new Map((data ?? []).map((t: { id: string; bloque_id: string }) => [t.id, t.bloque_id]))
  if (mapa.size > 0) cacheTemas.set(oposicionId, mapa)
  return mapa
}

/**
 * Bloque y tema del test para la oposición activa. Nunca lanza: si no se puede
 * leer el temario, el bloque queda null (antes nada que uno ajeno) y el tema
 * sigue la regla con lo que haya.
 */
export async function contextoTest(
  config: EleccionTest,
  preguntas: ReadonlyArray<PreguntaConTema>,
  oposicionId: string,
): Promise<ContextoTest> {
  const e = eleccionAplicada(config)
  try {
    const [bloqueDeTema, filasTE] = await Promise.all([
      temasDeLaOposicion(oposicionId),
      e.epigrafes.length > 0
        ? supabase.from('tema_epigrafe').select('tema_id, epigrafe_id').in('epigrafe_id', e.epigrafes)
            .then(({ data, error }) => { if (error) throw error; return data ?? [] })
        : Promise.resolve([]),
    ])
    const temasDeEpigrafe = new Map<string, string[]>()
    for (const r of filasTE as Array<{ tema_id: string; epigrafe_id: string }>) {
      if (!bloqueDeTema.has(r.tema_id)) continue          // tema de otra oposición
      temasDeEpigrafe.set(r.epigrafe_id, [...(temasDeEpigrafe.get(r.epigrafe_id) ?? []), r.tema_id])
    }
    return contextoDelTest(config, preguntas, { bloqueDeTema, temasDeEpigrafe })
  } catch (err) {
    console.warn('[contextoTest] temario no disponible; el bloque queda null:', err)
    return contextoDelTest(config, preguntas, { bloqueDeTema: new Map(), temasDeEpigrafe: new Map() })
  }
}
