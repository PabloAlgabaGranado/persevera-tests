// ─────────────────────────────────────────────────────────────────────────────
// Cargar el catálogo de Tests y la oposición que eligió la cuenta
// ─────────────────────────────────────────────────────────────────────────────
// Reescrito el 15-oct-2026 (T3) a partir de cargaOposicionActiva.ts de
// Persevera (claude/dia-d en 54e448e). De allí se queda la forma: la carga va
// aparte del proveedor para poder probarla con una base de mentira, y devuelve
// null si CUALQUIERA de las dos lecturas falla, porque supabase-js no lanza sin
// red, devuelve { error, data: null }, y eso no es «no tiene oposición».
//
// Cambia lo que se lee:
//   - El catálogo es el de Tests, `catalogo_tests` (T2), en su orden, con la
//     ficha de cada oposición de `oposiciones`. En Persevera eran las
//     oposiciones con `activa = true`, por nombre.
//   - La oposición de la cuenta sale de `eleccion_oposicion` (plaza 1), que la
//     app solo lee: la cambia la función de T17. En Persevera era el puntero
//     `usuario_oposicion`, que la app escribía.
//   - La ficha de la elegida viene con ella, y no del catálogo: quien eligió una
//     oposición que luego sale del catálogo la sigue teniendo.
//   - Sin cuenta no se lee nada: en Tests, `anon` no puede leer ninguna de las
//     dos tablas.
//   - Las dos lecturas traen la ficha de `oposiciones`, que cualquier
//     `authenticated` tiene que poder leer (sin lo retirado), como en
//     Persevera: lo apunta T10. Si la RLS la escondiera, `!inner` quitaría las
//     filas del catálogo sin dar error, y el catálogo saldría vacío.
//
// Aquí van también las formas que lee el motor (OposicionActiva y
// OposicionCatalogo, las de Persevera) y lo que queda tras cada carga, sin
// React, para probarlo y para que oposicionActivaContext.tsx solo exporte el
// proveedor y su hook (fast refresh).
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from './supabase'

export interface FilaCatalogo {
  id: string
  nombre: string
  nombre_corto: string
  slug: string
  /** Para agrupar el selector y el icono de la ficha (T15). */
  organismo?: string | null
}

/** La oposición elegida, con su grupo (dato interno: nunca se enseña). */
export interface FilaElegida extends FilaCatalogo {
  grupo?: string | null
}

export interface CargaOposicion {
  /** Lo que ofrece `catalogo_tests`, en su orden. */
  catalogo: FilaCatalogo[]
  /** El id de la oposición elegida. null = la cuenta aún no ha elegido. */
  elegidaId: string | null
  /** Su ficha. null si eligió pero la ficha no se puede leer. */
  elegida: FilaElegida | null
}

const FICHA = 'id, slug, nombre, nombre_corto, organismo'

/** PostgREST embebe un muchos-a-uno como objeto; supabase-js, sin esquema, lo tipa como lista. */
function unaFila<T>(v: T | T[] | null | undefined): T | null {
  return (Array.isArray(v) ? v[0] : v) ?? null
}

export async function cargarCatalogoYEleccion(
  userId: string | null,
  cliente: typeof supabase = supabase,
): Promise<CargaOposicion | null> {
  if (!userId) return { catalogo: [], elegidaId: null, elegida: null }
  try {
    const { data: cat, error: errorCatalogo } = await cliente
      .from('catalogo_tests')
      .select(`orden, oposiciones!inner(${FICHA})`)
      .is('oposiciones.retirada_at', null)
      .order('orden')
    if (errorCatalogo) return null
    const catalogo = ((cat ?? []) as Array<{ oposiciones: FilaCatalogo | FilaCatalogo[] | null }>)
      .map(f => unaFila(f.oposiciones))
      .filter((o): o is FilaCatalogo => o !== null)

    const { data: fila, error: errorEleccion } = await cliente
      .from('eleccion_oposicion')
      .select(`oposicion_id, oposiciones(${FICHA}, grupo)`)
      .eq('user_id', userId)
      .eq('plaza', 1)
      .maybeSingle()
    if (errorEleccion) return null
    const leida = fila as { oposicion_id?: string; oposiciones?: FilaElegida | FilaElegida[] | null } | null
    if (!leida?.oposicion_id) return { catalogo, elegidaId: null, elegida: null }

    // La ficha viene con la elección. Si no llega, es que la RLS de
    // `oposiciones` no la deja leer: hasta T10 no deja leer ninguna, y después,
    // las retiradas (la clave ajena no deja borrar una oposición elegida, y la
    // copia no borra, retira). La elección existe y no se trata como si no la
    // hubiera, pero tampoco se da por buena: ver `no_disponible`.
    const ficha = unaFila(leida.oposiciones)
    return {
      catalogo,
      elegidaId: leida.oposicion_id,
      elegida: ficha ? { ...ficha, id: leida.oposicion_id } : null,
    }
  } catch {
    return null
  }
}

// ── Lo que lee el motor ─────────────────────────────────────────────────────
// Las formas de Persevera (oposicionActivaContext.tsx, 54e448e), tal cual.

export interface OposicionActiva {
  id: string
  /** Nombre del cuerpo, completo y oficial. */
  nombreCuerpo: string
  /** Nombre CORTO y humano (nombre_corto de la BD, p. ej. "Agente de Hacienda").
   *  Es lo que se muestra en cabeceras/selectores; nombreCuerpo queda de apoyo. */
  nombreCorto: string
  /** Dato interno: nunca se enseña «C1» ni «C2». */
  grupo: string
}

export interface OposicionCatalogo {
  id: string
  nombre: string
  nombre_corto: string
  slug: string
  organismo?: string | null
}

/**
 * - `cargando`: todavía no hay una lectura buena.
 * - `error`: la última lectura falló; se reintenta al volver la red o la app.
 * - `sin_eleccion`: leído, y la cuenta no ha elegido oposición (o no hay cuenta).
 * - `no_disponible`: leído, y la oposición que eligió ya no se puede leer
 *   (retirada). Sin su temario, el alcance sale vacío y el motor dejaría de
 *   filtrar, así que no se da por lista: la cuenta tiene que elegir otra.
 * - `lista`: leído, con su oposición.
 */
export type EstadoOposicion = 'cargando' | 'error' | 'sin_eleccion' | 'no_disponible' | 'lista'

/** Sin oposición: ni el Administrativo ni ninguna otra. */
export const SIN_OPOSICION: OposicionActiva = { id: '', nombreCuerpo: '', nombreCorto: '', grupo: '' }

/**
 * Nombre de la oposición para la UI: sin la coletilla de modalidad
 * («— Ingreso Libre»). En la BD guardamos el nombre oficial completo;
 * para mostrar basta el cuerpo.
 */
export function nombreOposicionLimpio(nombre: string): string {
  return nombre.replace(/\s*[—–-]\s*Ingreso\s+Libre\s*$/i, '').trim()
}

/** La fila de la elegida, como la lee el motor. */
export function fichaActiva(fila: FilaElegida): OposicionActiva {
  return {
    id:           fila.id,
    nombreCuerpo: nombreOposicionLimpio(fila.nombre),
    nombreCorto:  fila.nombre_corto || nombreOposicionLimpio(fila.nombre),
    grupo:        fila.grupo ?? '',
  }
}

/** Lo que queda tras una carga: null es una lectura fallida, nunca «sin oposición». */
export function estadoTrasCarga(carga: CargaOposicion | null): {
  estado: EstadoOposicion
  oposicionActiva: OposicionActiva
  catalogo: OposicionCatalogo[] | null
} {
  if (!carga) return { estado: 'error', oposicionActiva: SIN_OPOSICION, catalogo: null }
  if (!carga.elegidaId) return { estado: 'sin_eleccion', oposicionActiva: SIN_OPOSICION, catalogo: carga.catalogo }
  if (!carga.elegida) return { estado: 'no_disponible', oposicionActiva: SIN_OPOSICION, catalogo: carga.catalogo }
  return { estado: 'lista', oposicionActiva: fichaActiva(carga.elegida), catalogo: carga.catalogo }
}
