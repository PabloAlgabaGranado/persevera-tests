// Copiado de Persevera (src/lib/desgloseTest.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

// ════════════════════════════════════════════════════════════════════════════
// Desglose por bloque y por tema de la pantalla de resultados de un test
// ════════════════════════════════════════════════════════════════════════════
//
// ⚠️ CADA PREGUNTA CUENTA EN EL BLOQUE Y EL TEMA DE LA OPOSICIÓN DEL OPOSITOR, NO EN
// LOS DE LA OPOSICIÓN PARA LA QUE SE ESCRIBIÓ. Y CADA FILA SE IDENTIFICA POR EL ID DE
// SU BLOQUE O DE SU TEMA, NUNCA POR SU NÚMERO.
//
// El banco se comparte por epígrafe (`tema_epigrafe`, ver oposicionScope.ts), y el
// `tema_id` de una pregunta es el de la oposición para la que se ESCRIBIÓ. Medido el
// 27-sep-2026 sobre las preguntas que ve cada oposición en vivo, llevan tema de otra
// el 95 % en el Auxiliar, el 64 % en Seguridad Social, el 54 % en Agentes de Hacienda
// y el 0,8 % en el Administrativo; en Guardia Civil, ninguna. El desglose salía con
// los bloques del Administrativo: en un test «Todo» de 20 del Auxiliar, seis filas
// «Por bloque», dos de ellas «Bloque 1» y otras tres de bloques que su temario no
// tiene. Decidido con Álvaro el 27-sep-2026: pasarlas a su temario.
//
// La regla, con el criterio de lo que se guarda al terminar (contextoTest.ts): nunca
// un bloque ni un tema de otra oposición.
//   1. El tema de la pregunta es de su oposición → ese, con su bloque.
//   2. Si no, los temas de su oposición que incluyen el epígrafe de la pregunta:
//      - uno solo → ese tema, con su bloque;
//      - varios del mismo bloque → cuenta en ese bloque, pero en ningún tema;
//      - ninguno, o de bloques distintos → no cuenta en ninguna fila: escoger uno
//        sería inventar.
// Medido el mismo día: todas las prestadas caen en un solo bloque suyo, y en un solo
// tema todas menos 397 de Agentes y 91 del Auxiliar, cuyo epígrafe está en varios
// temas suyos del mismo bloque.
//
// Y el número de tema se reinicia en cada bloque: el Administrativo tiene seis
// «tema 1», Agentes tres de cada número del 1 al 5, Seguridad Social y el Auxiliar
// dos de cada uno hasta el 13 y el 12 (solo Guardia Civil numera corrido). TakeTest
// pintaba cada fila con la clave `t-${numero}` (y `b-${numero}`), y en cuanto un test
// abarcaba dos bloques React avisaba de claves repetidas y no garantizaba el
// resultado: al actualizar puede duplicar u omitir filas.
// ════════════════════════════════════════════════════════════════════════════

import { supabase } from './supabase'

/** Lo que se lee de cada pregunta: su id, su tema y su epígrafe. */
export interface PreguntaDesglose {
  id?: string
  temas?: { id?: string | null } | null
  /** Ausente si la fuente del test no lo pidió; null si la pregunta no tiene. */
  epigrafe_id?: string | null
}

export interface TemaPropio { numero: number | null; titulo: string; bloqueId: string }
export interface BloquePropio { numero: number | null; nombre: string }

/** El temario de la oposición del opositor, y dónde caen en él las preguntas prestadas. */
export interface TemarioDesglose {
  temas: ReadonlyMap<string, TemaPropio>
  bloques: ReadonlyMap<string, BloquePropio>
  /** Pregunta con tema de otra oposición → temas de esta que incluyen su epígrafe. */
  temasPropiosDe: ReadonlyMap<string, readonly string[]>
}

export interface FilaDesglose {
  /** Id del bloque o del tema. Es la clave de la fila: el número se repite. */
  id: string
  numero?: number | null
  nombre: string
  correctas: number
  total: number
}

export interface FilaTema extends FilaDesglose {
  /** Número del bloque del tema: ordena las filas y las rotula cuando hay varios bloques. */
  bloqueNumero?: number | null
}

export interface DesgloseTest {
  bloques: FilaDesglose[]
  temas: FilaTema[]
}

/** Temas de su oposición en los que cae la pregunta (regla de la cabecera). */
function temasDeSuOposicion(p: PreguntaDesglose, temario: TemarioDesglose): string[] {
  const suyo = p.temas?.id
  if (suyo && temario.temas.has(suyo)) return [suyo]
  const incluyen = p.id ? temario.temasPropiosDe.get(p.id) ?? [] : []
  return [...new Set(incluyen)].filter(t => temario.temas.has(t))
}

/**
 * Aciertos por bloque y por tema de su oposición. Los bloques van por número; los
 * temas, por bloque y luego por número, para que los «tema 1» de bloques distintos
 * no se intercalen. Lo que no tiene número va al final. `respuestas` va por índice
 * de pregunta; sin respuesta, la pregunta cuenta en el total y no en los aciertos.
 */
export function desgloseDelTest(
  preguntas: ReadonlyArray<PreguntaDesglose>,
  respuestas: Readonly<Record<number, { correcta: boolean } | undefined>>,
  temario: TemarioDesglose,
): DesgloseTest {
  const bloques = new Map<string, FilaDesglose>()
  const temas   = new Map<string, FilaTema>()

  /** La fila ya abierta con ese id o, si no la hay, `nueva`. */
  const filaDe = <F extends FilaDesglose>(filas: Map<string, F>, nueva: F): F => {
    const hay = filas.get(nueva.id)
    if (hay) return hay
    filas.set(nueva.id, nueva)
    return nueva
  }
  const contar = (f: FilaDesglose, ok: boolean) => { f.total += 1; if (ok) f.correctas += 1 }

  preguntas.forEach((p, i) => {
    const ok = respuestas[i]?.correcta || false
    const suyos = temasDeSuOposicion(p, temario)
    const bloquesSuyos = new Set(suyos.map(t => temario.temas.get(t)?.bloqueId))
    const [bloqueId] = bloquesSuyos
    if (bloquesSuyos.size === 1 && bloqueId) {
      const b = temario.bloques.get(bloqueId)
      contar(filaDe(bloques, { id: bloqueId, numero: b?.numero, nombre: b?.nombre ?? '', correctas: 0, total: 0 }), ok)
    }
    const t = suyos.length === 1 ? temario.temas.get(suyos[0]) : undefined
    if (t) {
      const bloqueNumero = temario.bloques.get(t.bloqueId)?.numero
      contar(filaDe(temas, { id: suyos[0], numero: t.numero, nombre: t.titulo, bloqueNumero, correctas: 0, total: 0 }), ok)
    }
  })

  const num = (n: number | null | undefined) => n ?? 99
  return {
    bloques: [...bloques.values()].sort((a, b) => num(a.numero) - num(b.numero)),
    temas:   [...temas.values()].sort((a, b) => num(a.bloqueNumero) - num(b.bloqueNumero) || num(a.numero) - num(b.numero)),
  }
}

/**
 * Rótulo de una fila de tema: «Tema 3», o «Bloque 1, tema 3» si el test abarca
 * varios bloques, porque entonces el número solo no dice de qué tema se habla
 * (decidido con Álvaro el 27-sep-2026; es la forma de los avisos del plan).
 */
export function rotuloTema(t: FilaTema, variosBloques: boolean): string {
  return variosBloques
    ? `Bloque ${t.bloqueNumero ?? '?'}, tema ${t.numero ?? '?'}`
    : `Tema ${t.numero ?? '?'}`
}

// ── Carga ─────────────────────────────────────────────────────────────────────

// El temario no cambia en una sesión: el de cada oposición se pide una vez.
const cacheTemario = new Map<string, Pick<TemarioDesglose, 'temas' | 'bloques'>>()

type BloqueLeido = { id: string; numero: number | null; nombre: string | null }
type TemaLeido = {
  id: string; numero: number | null; titulo: string | null; bloque_id: string
  // PostgREST embebe un muchos-a-uno como objeto; supabase-js, sin esquema, lo tipa como lista.
  bloques: BloqueLeido | BloqueLeido[] | null
}

async function temarioDeLaOposicion(oposicionId: string): Promise<Pick<TemarioDesglose, 'temas' | 'bloques'>> {
  const hit = cacheTemario.get(oposicionId)
  if (hit) return hit
  const { data, error } = await supabase
    .from('temas')
    .select('id, numero, titulo, bloque_id, bloques!inner(id, numero, nombre, oposicion_id)')
    .eq('bloques.oposicion_id', oposicionId)
  if (error) throw error
  const temas = new Map<string, TemaPropio>()
  const bloques = new Map<string, BloquePropio>()
  for (const t of (data ?? []) as TemaLeido[]) {
    temas.set(t.id, { numero: t.numero, titulo: t.titulo ?? '', bloqueId: t.bloque_id })
    const b = Array.isArray(t.bloques) ? t.bloques[0] : t.bloques
    if (b) bloques.set(b.id, { numero: b.numero, nombre: b.nombre ?? '' })
  }
  const temario = { temas, bloques }
  if (temas.size > 0) cacheTemario.set(oposicionId, temario)
  return temario
}

/**
 * Temario de la oposición del opositor para el desglose de estas preguntas. Nunca
 * lanza: si no se puede leer, null, y el desglose no se enseña (mejor ninguno que
 * uno con los bloques de otra oposición). Si la fuente del test no pidió
 * `epigrafe_id`, el de las preguntas prestadas se lee aparte.
 */
export async function cargarTemarioDesglose(
  oposicionId: string,
  preguntas: ReadonlyArray<PreguntaDesglose>,
): Promise<TemarioDesglose | null> {
  try {
    const { temas, bloques } = await temarioDeLaOposicion(oposicionId)
    if (temas.size === 0) return null

    const prestadas = preguntas.filter((p): p is PreguntaDesglose & { id: string } =>
      !!p.id && !(p.temas?.id && temas.has(p.temas.id)))
    const epigrafeDe = new Map<string, string>()
    const sinPedir: string[] = []
    for (const p of prestadas) {
      if (p.epigrafe_id) epigrafeDe.set(p.id, p.epigrafe_id)
      else if (p.epigrafe_id === undefined) sinPedir.push(p.id)
    }
    if (sinPedir.length > 0) {
      const { data, error } = await supabase.from('preguntas').select('id, epigrafe_id').in('id', sinPedir)
      if (error) throw error
      for (const r of (data ?? []) as Array<{ id: string; epigrafe_id: string | null }>) {
        if (r.epigrafe_id) epigrafeDe.set(r.id, r.epigrafe_id)
      }
    }

    const temasDeEpigrafe = new Map<string, string[]>()
    const epigrafes = [...new Set(epigrafeDe.values())]
    if (epigrafes.length > 0) {
      const { data, error } = await supabase
        .from('tema_epigrafe')
        .select('tema_id, epigrafe_id')
        .in('epigrafe_id', epigrafes)
        .in('tema_id', [...temas.keys()])
      if (error) throw error
      for (const r of (data ?? []) as Array<{ tema_id: string; epigrafe_id: string }>) {
        if (!temas.has(r.tema_id)) continue
        temasDeEpigrafe.set(r.epigrafe_id, [...(temasDeEpigrafe.get(r.epigrafe_id) ?? []), r.tema_id])
      }
    }

    const temasPropiosDe = new Map<string, readonly string[]>()
    for (const [pregunta, epigrafe] of epigrafeDe) temasPropiosDe.set(pregunta, temasDeEpigrafe.get(epigrafe) ?? [])
    return { temas, bloques, temasPropiosDe }
  } catch (err) {
    console.warn('[desgloseTest] temario no disponible; el test se queda sin desglose:', err)
    return null
  }
}

/** Solo para las pruebas: olvida los temarios leídos. */
export function olvidarTemarios(): void {
  cacheTemario.clear()
}
