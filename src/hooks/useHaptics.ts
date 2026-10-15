// Copiado de Persevera (src/hooks/useHaptics.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. La vibración viene encendida, como en Persevera. La cabecera apaga
// la regla no-empty de ESLint porque el original deja vacíos cuatro catch a
// propósito, y el motor no se arregla aquí.
/* eslint-disable no-empty */

/**
 * useHaptics
 * ──────────
 * Hook centralizado de feedback háptico para PERSEVERA.
 * Reemplaza las funciones `haptic` / `hapticImpact` duplicadas en
 * EstudiarView, TakeTest y otros componentes.
 *
 * Características:
 * - Respeta el flag de usuario `persevera_haptics_enabled` en localStorage.
 * - try/catch silencioso: si falla en web o el plugin no responde,
 *   nunca rompe el flujo.
 * - API clara: light / medium / heavy + success / warning / error
 *   + selectionChanged para sliders y rangos.
 * - Patrones complejos para momentos premium: `celebration` (subir nivel),
 *   `doubleTap` (toggles importantes), `onboardingDemo` (mostrar la
 *   diferencia entre los 4 niveles al usuario).
 *
 * Uso:
 *   import { useHaptics } from '../../hooks/useHaptics'
 *
 *   function MiComponente() {
 *     const haptics = useHaptics()
 *     return (
 *       <button onClick={() => { haptics.light(); doStuff() }}>OK</button>
 *     )
 *   }
 *
 * También se puede importar el objeto directamente sin el hook,
 * útil fuera de componentes (event handlers globales, servicios):
 *
 *   import { haptics } from '../../hooks/useHaptics'
 *   haptics.success()
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const HAPTICS_FLAG = 'persevera_haptics_enabled'

/** Devuelve true si el usuario tiene activos los hápticos. Default: true. */
export const isHapticsEnabled = (): boolean => {
  try {
    return localStorage.getItem(HAPTICS_FLAG) !== 'false'
  } catch {
    return true
  }
}

/** Permite al usuario activar/desactivar los hápticos desde Ajustes. */
export const setHapticsEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(HAPTICS_FLAG, enabled ? 'true' : 'false')
  } catch {}
}

/** Wrapper interno que respeta el flag y silencia errores del plugin.
 *
 * CORTAFUEGOS ANTI-SATURACIÓN: si algo dispara hápticos en RÁFAGA (p. ej. un
 * bucle de re-render o de montaje), en iOS cada llamada es nativa real y
 * cientos por segundo saturan el puente Capacitor hasta tumbar el WebView
 * (web process crash → la app arranca y se queda EN NEGRO). Ignoramos los que
 * llegan demasiado seguidos: un tap humano no supera ~5/seg, así que un mínimo
 * de 60 ms entre pulsos no se nota pero hace imposible la saturación. */
let lastHapticTs = 0
const MIN_HAPTIC_GAP_MS = 60
// Momento en que se carga el módulo (≈ arranque de la app). Durante el primer
// segundo y medio NO disparamos NINGÚN háptico: mata de raíz cualquier ráfaga
// al montar la app (que en iOS satura el puente y crashea el WebView → pantalla
// negra), sin afectar el uso normal (nadie pulsa botones en el primer 1,5 s).
const moduleLoadedAt = Date.now()
const STARTUP_QUIET_MS = 1500

const safe = async (fn: () => Promise<void>): Promise<void> => {
  if (!isHapticsEnabled()) return
  const now = Date.now()
  if (now - moduleLoadedAt < STARTUP_QUIET_MS) return   // silencio en el arranque
  if (now - lastHapticTs < MIN_HAPTIC_GAP_MS) return     // anti-saturación continua
  lastHapticTs = now
  try {
    await fn()
  } catch {
    /* Silenciar: en navegador o si el plugin no está disponible */
  }
}

/** Helper para esperar N ms con seguridad (no rompe si el componente se desmonta). */
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/**
 * Objeto haptics — API estable para usar en cualquier sitio.
 * Cada método es async pero NO necesita ser awaited en handlers UI:
 *   onClick={() => { haptics.light(); restoSinche() }}
 */
export const haptics = {
  /** Tap ligero — selecciones suaves, navegación, abrir secciones. */
  light:   () => safe(() => Haptics.impact({ style: ImpactStyle.Light })),

  /** Impacto medio — confirmaciones, terminar test, acciones importantes. */
  medium:  () => safe(() => Haptics.impact({ style: ImpactStyle.Medium })),

  /** Impacto fuerte — final de simulacro, hitos, delete confirmado. */
  heavy:   () => safe(() => Haptics.impact({ style: ImpactStyle.Heavy })),

  /** Notificación success — respuesta correcta, racha, badge desbloqueado. */
  success: () => safe(() => Haptics.notification({ type: NotificationType.Success })),

  /** Notificación warning — advertencia (tiempo agotándose, etc.). */
  warning: () => safe(() => Haptics.notification({ type: NotificationType.Warning })),

  /** Notificación error — fallo de respuesta, validación inválida. */
  error:   () => safe(() => Haptics.notification({ type: NotificationType.Error })),

  /** Inicio de selección continua (sliders, scrubbing). Llamar antes de mover. */
  selectionStart:   () => safe(() => Haptics.selectionStart()),

  /** Cambio durante una selección continua. Llamar en cada step. */
  selectionChanged: () => safe(() => Haptics.selectionChanged()),

  /** Fin de selección continua. Llamar al soltar. */
  selectionEnd:     () => safe(() => Haptics.selectionEnd()),

  // ──────────────────────────────────────────────────────────────────
  // PATRONES COMPLEJOS — secuencias multi-pulso para momentos premium
  // ──────────────────────────────────────────────────────────────────

  /**
   * Patrón "Celebration" — 3 pulsos success encadenados con cadencia
   * deliberada. RESERVADO para subir de nivel y momentos cumbre similares
   * (rachas largas, badges importantes). NO usar en éxitos ordinarios:
   * pierde su impacto si se banaliza.
   *
   * Cadencia: 0ms · 220ms · 440ms (≈600ms total).
   * En iOS suena/se siente como un "bing-bing-BING" ascendente, similar
   * al feedback de Apple Watch al cerrar los anillos.
   */
  celebration: async () => {
    if (!isHapticsEnabled()) return
    try {
      await Haptics.notification({ type: NotificationType.Success })
      await sleep(220)
      await Haptics.notification({ type: NotificationType.Success })
      await sleep(220)
      await Haptics.notification({ type: NotificationType.Success })
    } catch {}
  },

  /**
   * Patrón "Double tap" — dos pulsos medium muy seguidos. Útil para
   * toggles importantes (desactivar simulacro en curso, etc.) donde
   * un solo medium se siente débil.
   *
   * Cadencia: 0ms · 90ms.
   */
  doubleTap: async () => {
    if (!isHapticsEnabled()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
      await sleep(90)
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch {}
  },

  /**
   * Demo de onboarding — secuencia educativa que muestra al usuario los
   * 4 niveles hápticos en orden ascendente con un pequeño descanso entre
   * cada uno. Usado por HapticOnboardingTooltip al pulsar "Probar".
   *
   * Cadencia: light · 360ms · medium · 360ms · heavy · 500ms · success.
   * Devuelve una promesa que resuelve cuando termina la secuencia
   * (~1.6s) por si la UI quiere sincronizar labels.
   */
  onboardingDemo: async () => {
    if (!isHapticsEnabled()) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
      await sleep(360)
      await Haptics.impact({ style: ImpactStyle.Medium })
      await sleep(360)
      await Haptics.impact({ style: ImpactStyle.Heavy })
      await sleep(500)
      await Haptics.notification({ type: NotificationType.Success })
    } catch {}
  },
}

/** Hook React — devuelve el mismo objeto haptics. */
export function useHaptics() {
  return haptics
}

export default useHaptics
