// =========================================================================
// La oposición de la cuenta (contexto reactivo)
// =========================================================================
// Reescrito el 15-oct-2026 (T3) a partir de oposicionActivaContext.tsx de
// Persevera (claude/dia-d en 54e448e). El motor copiado lo usa igual que allí:
//   const { oposicionActiva, catalogo, loading, tienePuntero } = useOposicionActiva()
// con las mismas formas (OposicionActiva, OposicionCatalogo) y el mismo
// nombreOposicionLimpio, tal cual. Lo que cambia:
//
//   - Lee la oposición de `eleccion_oposicion` (T2) y nunca la escribe. En
//     Persevera, setOposicionActiva escribía el puntero `usuario_oposicion`.
//     Aquí no hay setOposicionActiva: la oposición la cambia la función de T17
//     (y la primera elección, T15), y después se llama a `recargar()`.
//   - No hay oposición por defecto. En Persevera, sin puntero o sin red, la
//     activa era el Administrativo. Si la lectura fallaba, `loading` pasaba a
//     false con el Administrativo puesto (líneas 126-130), y una pantalla que
//     esperara a `loading` enseñaba lo del Administrativo a quien prepara otra
//     (hoja de ruta, «Fallos del motor», Descubrir). Aquí, mientras no hay una
//     lectura buena, `loading` sigue en true, también si falla (`estado:
//     'error'`), y se reintenta al volver la red o la app, como en Persevera.
//   - Mientras no está leída, `oposicionActiva` va vacía (id ''): al arrancar,
//     al recargar, si la lectura falla, si la cuenta no ha elegido
//     (`sin_eleccion`) y si la que eligió está retirada (`no_disponible`); en
//     estos dos últimos, con `loading` en false. Con id '', getScopeOposicion
//     da el alcance vacío, y el motor copiado, con el alcance vacío, deja de
//     filtrar y trae lo de todas las oposiciones (en Persevera,
//     TestSelectorModal.tsx 371-381 y MisFallosView.tsx 128-130, 155 y 187).
//     Por eso el motor se monta solo con `estado === 'lista'`, nunca con
//     `!loading`. Sin elección, la app lleva a elegir (T15), y con la elegida
//     retirada, a elegir otra (T17).
//   - `estado` y `recargar` son nuevos, para el armazón de la app (T15 y T16).
//     `recargar()` vuelve a `cargando`, con id '', hasta que llega la lectura
//     nueva: el armazón desmonta el motor y lo monta con la oposición nueva.
//     Es lo que piden sus pantallas, que cargan una sola vez al montarse.
//   - El catálogo es el de `catalogo_tests`, en su orden. La carga y lo que
//     queda tras ella van en cargaOposicionActiva.ts, sin React.
// =========================================================================

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  cargarCatalogoYEleccion, estadoTrasCarga, SIN_OPOSICION,
  type EstadoOposicion, type OposicionActiva, type OposicionCatalogo,
} from './cargaOposicionActiva'
import { clearScopeCache, setActiveOposicionId } from './oposicionScope'
import { supabase } from './supabase'

export type { EstadoOposicion, OposicionActiva, OposicionCatalogo } from './cargaOposicionActiva'
// El motor lo importa de aquí, como en Persevera. Fast refresh recarga la
// página entera al tocar este fichero: es solo en desarrollo.
// eslint-disable-next-line react-refresh/only-export-components
export { nombreOposicionLimpio } from './cargaOposicionActiva'

interface OposicionActivaContextValue {
  /** La oposición elegida. Vacía (id '') mientras `estado` no sea `lista`: el motor no se monta con ella. */
  oposicionActiva: OposicionActiva
  /** Lo que ofrece Tests (`catalogo_tests`), en su orden. */
  catalogo: OposicionCatalogo[]
  /** True mientras no hay una lectura buena, también si la última falló. */
  loading: boolean
  /** ¿La cuenta tiene una oposición elegida y leída? Es `estado === 'lista'`. */
  tienePuntero: boolean
  estado: EstadoOposicion
  /** Vuelve a leer: tras elegir o cambiar de oposición (T15 y T17). */
  recargar: () => void
}

const OposicionActivaContext = createContext<OposicionActivaContextValue | null>(null)

export function OposicionActivaProvider({ userId, cliente = supabase, children }: {
  userId: string | null
  /** Para las pruebas y las maquetas: una base de mentira, creada fuera del componente (si cambia, se vuelve a leer). */
  cliente?: typeof supabase
  children: ReactNode
}) {
  // Sube con cada reintento o recarga, y vuelve a lanzar la lectura.
  const [intento, setIntento] = useState(0)
  // Cada lectura es de una cuenta y un intento. Mientras la última que ha
  // llegado no sea la de ahora, se está cargando: así no hace falta poner
  // `cargando` a mano al empezar cada una.
  const clave = `${userId ?? ''}#${intento}`
  const [leido, setLeido] = useState<{ clave: string; estado: EstadoOposicion; oposicionActiva: OposicionActiva } | null>(null)
  // El catálogo de la última lectura buena: no se pierde mientras se recarga.
  const [catalogo, setCatalogo] = useState<OposicionCatalogo[]>([])
  const ultimaId = useRef<string | null>(null)

  useEffect(() => {
    let cancelado = false
    void cargarCatalogoYEleccion(userId, cliente).then(carga => {
      if (cancelado) return
      const r = estadoTrasCarga(carga)
      if (r.estado === 'error') {
        console.warn('[OposicionActiva] no se pudo leer la oposición (¿sin red?); se reintenta al volver la conexión')
      } else {
        // Al cambiar de oposición, los loaders vuelven a acotar el contenido.
        if (ultimaId.current !== null && ultimaId.current !== r.oposicionActiva.id) clearScopeCache()
        ultimaId.current = r.oposicionActiva.id
        setCatalogo(r.catalogo ?? [])
      }
      setLeido({ clave, estado: r.estado, oposicionActiva: r.oposicionActiva })
    })
    return () => { cancelado = true }
  }, [clave, userId, cliente])

  const vigente = leido?.clave === clave ? leido : null
  const estado: EstadoOposicion = vigente?.estado ?? 'cargando'
  const oposicionActiva = vigente?.oposicionActiva ?? SIN_OPOSICION

  useEffect(() => {
    if (estado !== 'error') return
    const reintentar = () => setIntento(n => n + 1)
    const alVolver = () => { if (document.visibilityState === 'visible') reintentar() }
    window.addEventListener('online', reintentar)
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      window.removeEventListener('online', reintentar)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [estado])

  // El ref de fuera de React (oposicionScope), para quien escribe sin contexto
  // (el registrarActividad de T5). Solo lleva la oposición cuando está leída;
  // si no, null, y quien escribe sabe que no lo sabe.
  useEffect(() => {
    setActiveOposicionId(estado === 'lista' ? oposicionActiva.id : null)
  }, [estado, oposicionActiva.id])

  const recargar = useCallback(() => setIntento(n => n + 1), [])

  const loading = estado === 'cargando' || estado === 'error'
  return (
    <OposicionActivaContext.Provider value={{
      oposicionActiva, catalogo, loading, tienePuntero: estado === 'lista', estado, recargar,
    }}>
      {children}
    </OposicionActivaContext.Provider>
  )
}

/**
 * Lee la oposición de la cuenta desde cualquier componente. Fuera del
 * proveedor no hay oposición: `loading` en true y sin ninguna por defecto. En
 * Persevera caía al Administrativo, y un componente sin envolver enseñaba lo
 * suyo sin avisar.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useOposicionActiva(): OposicionActivaContextValue {
  const ctx = useContext(OposicionActivaContext)
  if (!ctx) {
    return {
      oposicionActiva: SIN_OPOSICION, catalogo: [], loading: true, tienePuntero: false,
      estado: 'cargando', recargar: () => {},
    }
  }
  return ctx
}
