// Copiado de Persevera (src/lib/oposicionScope.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. Lee bloques, temas y tema_epigrafe con el cliente de Tests
// (src/lib/supabase.ts). La cabecera apaga la regla
// @typescript-eslint/no-explicit-any de ESLint porque el original tipa tres
// filas como any, y el motor no se arregla aquí.
/* eslint-disable @typescript-eslint/no-explicit-any */

// =========================================================================
// PERSEVERA · Scope de contenido por oposición
// =========================================================================
// Dado el id de una oposición, devuelve los `bloque_id` y `tema_id` que le
// pertenecen, para filtrar consultas de contenido (preguntas, etc.) y que NO
// se mezclen oposiciones cuando haya más de una con contenido cargado.
//
// HOY el contenido se ata a la oposición por la jerarquía bloques→temas
// (`bloques.oposicion_id`). En FASE 2 (modelo de epígrafe — ver MULTIOPOSICION.md)
// esto pasará a resolverse por epígrafe, y será el ÚNICO sitio a cambiar: los
// loaders que usan este helper no se tocan.
//
// El temario es estático, así que el resultado se cachea por oposición.
// =========================================================================

import { supabase } from './supabase'

export interface ScopeOposicion {
  /** ids de `bloques` que pertenecen a la oposición. (ESTRUCTURA: árbol/lista) */
  bloqueIds: string[]
  /** ids de `temas` que pertenecen a la oposición. (ESTRUCTURA: árbol/lista) */
  temaIds: string[]
  /**
   * ids de `epigrafes` que el temario de la oposición INCLUYE (vía `tema_epigrafe`).
   * (CONTENIDO: filtra `preguntas`/`flashcards` con `.in('epigrafe_id', epigrafeIds)`).
   * Es la unidad del modelo "compartir, no duplicar": el Auxiliar reutiliza los mismos
   * epígrafes del C1, así que su contenido sale de aquí sin duplicar filas.
   * Para el C1 es idéntico a filtrar por sus temas (sus epígrafes = todo su contenido).
   */
  epigrafeIds: string[]
}

const cache = new Map<string, ScopeOposicion>()

/**
 * Devuelve la estructura (`bloqueIds`, `temaIds`) y el contenido (`epigrafeIds`) de una
 * oposición. Cacheado (el temario es estático). Estructura → filtra `temas`/`bloques`;
 * contenido (`preguntas`/`flashcards`, que tienen `epigrafe_id`) → filtra por `epigrafeIds`.
 */
export async function getScopeOposicion(oposicionId: string): Promise<ScopeOposicion> {
  const hit = cache.get(oposicionId)
  if (hit) return hit

  const { data: bloques, error: eB } = await supabase
    .from('bloques')
    .select('id')
    .eq('oposicion_id', oposicionId)
  if (eB) console.warn('[scope] error leyendo bloques:', eB.message)
  const bloqueIds = (bloques ?? []).map((b: any) => b.id as string)

  let temaIds: string[] = []
  if (bloqueIds.length > 0) {
    const { data: temas, error: eT } = await supabase
      .from('temas')
      .select('id')
      .in('bloque_id', bloqueIds)
    if (eT) console.warn('[scope] error leyendo temas:', eT.message)
    temaIds = (temas ?? []).map((t: any) => t.id as string)
  }

  // Epígrafes que componen el temario de la oposición (vía la tabla puente tema_epigrafe).
  // Defensivo: si la tabla aún no existe o no hay filas, queda vacío y las consultas de
  // contenido degradan (con su guarda `if length > 0`) en lugar de romperse.
  let epigrafeIds: string[] = []
  if (temaIds.length > 0) {
    const { data: te, error: eE } = await supabase
      .from('tema_epigrafe')
      .select('epigrafe_id')
      .in('tema_id', temaIds)
    if (eE) console.warn('[scope] error leyendo tema_epigrafe:', eE.message)
    epigrafeIds = (te ?? []).map((r: any) => r.epigrafe_id as string)
  }

  const scope: ScopeOposicion = { bloqueIds, temaIds, epigrafeIds }
  // NO cachear un scope VACÍO: suele ser un fallo transitorio (red / RLS / caché
  // prematura) y, si se cachea, el contenido queda roto toda la sesión. Solo se cachea
  // si se pudieron leer bloques (la oposición existe y es legible para este usuario).
  if (bloqueIds.length > 0) cache.set(oposicionId, scope)
  return scope
}

/**
 * Épigrafes (ids) que componen un conjunto de temas, vía la tabla puente
 * `tema_epigrafe`. Sirve para expandir una selección de temas/bloques a su
 * CONTENIDO cuando se comparte por epígrafe (el Auxiliar reutiliza épigrafes del
 * C1). Para el C1 (tema_epigrafe poblada por identidad) el resultado equivale a
 * filtrar las preguntas por `tema_id`. Defensivo: sin filas devuelve [].
 */
export async function epigrafesDeTemas(temaIds: string[]): Promise<string[]> {
  if (temaIds.length === 0) return []
  const { data } = await supabase
    .from('tema_epigrafe')
    .select('epigrafe_id')
    .in('tema_id', temaIds)
  return [...new Set((data ?? []).map((r: { epigrafe_id: string }) => r.epigrafe_id))]
}

/**
 * Filtro de contenido "por EPÍGRAFE **o** por TEMA", listo para `.or(...)`.
 *
 * Casi todas las preguntas se acotan por `epigrafe_id`, que es lo que permite
 * COMPARTIR contenido entre oposiciones (el Auxiliar reutiliza los épigrafes del
 * Administrativo). Pero hay preguntas SIN épigrafe: los exámenes oficiales de
 * Seguridad Social, Hacienda y Auxiliar se ingirieron sin etiquetar, y un
 * `IN (...)` nunca casa con NULL. Filtrando solo por épigrafe desaparecen —lo
 * que en "Mis fallos" significa decirle al opositor que no tiene fallos justo
 * después de suspender un examen oficial.
 *
 * `tema_id` sí está poblado en el 100% de las preguntas, así que la rama de tema
 * las rescata sin arrastrar nada ajeno: un tema pertenece a UNA oposición.
 *
 * Cuando esas oficiales estén etiquetadas por épigrafe, la segunda rama pasará a
 * ser redundante — inofensiva, pero se podrá quitar.
 */
export function filtroEpigrafeOTema(epigrafeIds: string[], temaIds: string[]): string | null {
  const ramas: string[] = []
  if (epigrafeIds.length > 0) ramas.push(`epigrafe_id.in.(${epigrafeIds.join(',')})`)
  if (temaIds.length > 0) ramas.push(`tema_id.in.(${temaIds.join(',')})`)
  return ramas.length > 0 ? ramas.join(',') : null
}

/** Invalida la caché (p. ej. al cambiar de oposición activa). */
export function clearScopeCache(): void {
  cache.clear()
}

// ── Ref de la oposición activa para usos FUERA de React ──
// Algunos escritores (p. ej. activityLog) no están en el árbol de React y no
// pueden leer el contexto. `oposicionActivaContext` mantiene este ref sincronizado
// con la oposición activa para que esos escritores etiqueten la fila correcta.
let _activaId: string | null = null
export function setActiveOposicionId(id: string | null): void { _activaId = id }
export function getActiveOposicionId(): string | null { return _activaId }

// =========================================================================
// PROBE · ¿la tabla `simulacros` ya tiene `oposicion_id`?
// -------------------------------------------------------------------------
// La columna se añade por migración (20260617_simulacros_oposicion_id.sql).
// Mientras el usuario no la aplique, NO existe. Este probe permite cablear el
// scoping de simulacros de forma DEFENSIVA: funciona igual antes y después de
// la migración. Una sola comprobación por sesión (cacheada).
// =========================================================================

let _simulacrosTieneOpos: boolean | null = null

/**
 * Devuelve true si la tabla `simulacros` expone la columna `oposicion_id`.
 * Cacheado (una comprobación por sesión). Si la columna no existe, el select
 * falla y devolvemos false sin romper nada.
 */
export async function simulacrosTieneOposicionId(): Promise<boolean> {
  if (_simulacrosTieneOpos !== null) return _simulacrosTieneOpos
  const { error } = await supabase.from('simulacros').select('oposicion_id').limit(1)
  _simulacrosTieneOpos = !error
  return _simulacrosTieneOpos
}

const _vistaTieneOpos: Record<string, boolean> = {}

// Vistas de stats GLOBALES por diseño: agrupan solo por user_id y así se quieren
// (los contadores de preguntas/aciertos/días activos/minutos son globales del
// usuario — ver buildUserSnapshot en activityLog.ts; los logros/títulos los leen
// así). No tienen `oposicion_id`, así que el probe de red devolvía un 400 en cada
// carga y ensuciaba la consola sin aportar nada (la respuesta es siempre false).
// Para estas vistas devolvemos false sin tocar la red. Si algún día se decide
// scopear estas stats por oposición, hay que (1) añadir oposicion_id a la vista,
// (2) sacar el nombre de este set y (3) revisar buildUserSnapshot (usa maybeSingle,
// que fallaría con varias filas por usuario).
//
// OJO: "global" aquí no significa "correcto para todo". El mapa de calor leía
// v_user_daily_activity y por eso pintaba la actividad de TODAS las oposiciones,
// hasta el punto de que reiniciar el progreso de una parecía no hacer nada. Desde
// ago-2026 el heatmap agrega en cliente desde study_activity_log, que sí lleva
// oposicion_id (ver src/lib/heatmap.ts), y ya nadie lee esta vista.
const VISTAS_GLOBALES_SIN_OPOSICION = new Set<string>(['v_user_stats', 'v_user_daily_activity'])

/**
 * Devuelve true si una tabla/vista expone `oposicion_id`. Cacheado por nombre.
 * Para las vistas globales conocidas responde false sin consultar (evita el 400).
 */
export async function vistaTieneOposicionId(vista: string): Promise<boolean> {
  if (VISTAS_GLOBALES_SIN_OPOSICION.has(vista)) return false
  if (vista in _vistaTieneOpos) return _vistaTieneOpos[vista]
  const { error } = await supabase.from(vista).select('oposicion_id').limit(1)
  _vistaTieneOpos[vista] = !error
  return _vistaTieneOpos[vista]
}
