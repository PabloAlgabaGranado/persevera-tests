// Copiado de Persevera (src/hooks/useLongPress.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. La cabecera apaga la regla react-hooks/refs de ESLint porque el
// original guarda la última función en un ref al pintar, y el motor no se
// arregla aquí.
/* eslint-disable react-hooks/refs */

/**
 * useLongPress
 * ────────────
 * Hook que detecta un "long-press" (mantener pulsado) sobre cualquier
 * elemento sin librería externa.
 *
 * Características:
 *   - Threshold configurable (default 500ms).
 *   - Cancela si el dedo se mueve más de 10px (evita falsos positivos
 *     mientras se hace scroll).
 *   - Cancela si el touch se levanta antes del threshold.
 *   - Dispara haptic medium automáticamente al activarse.
 *   - Soporta touch (móvil) y mouse (debug en desktop).
 *
 * Uso:
 *   const longPressHandlers = useLongPress(() => {
 *     setMenuFor(pregunta.id)
 *   })
 *   return <div {...longPressHandlers}>...</div>
 *
 * NOTA: Hace falta combinarlo con onClick normal. Si el long-press se
 * activa, NO debe ejecutarse el onClick (gestionado dentro del hook
 * mediante un flag).
 */

import { useCallback, useRef } from 'react'
import { haptics } from './useHaptics'

interface LongPressOptions {
  /** Tiempo en ms. Default 500ms (estándar iOS). */
  threshold?: number
  /** Distancia en px que cancela el long-press si se supera. Default 10. */
  moveTolerance?: number
  /** Si es true, dispara haptic medium al activarse. Default true. */
  withHaptic?: boolean
}

export function useLongPress(
  onLongPress: () => void,
  options: LongPressOptions = {},
) {
  const {
    threshold = 500,
    moveTolerance = 10,
    withHaptic = true,
  } = options

  // Refs para tracking del gesto
  const timerRef     = useRef<number | null>(null)
  const startXRef    = useRef<number>(0)
  const startYRef    = useRef<number>(0)
  const triggeredRef = useRef<boolean>(false)
  const onLongPressRef = useRef(onLongPress)

  onLongPressRef.current = onLongPress  // siempre la última versión

  const start = useCallback((x: number, y: number) => {
    startXRef.current = x
    startYRef.current = y
    triggeredRef.current = false
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      triggeredRef.current = true
      if (withHaptic) haptics.medium()
      onLongPressRef.current()
      timerRef.current = null
    }, threshold)
  }, [threshold, withHaptic])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const move = useCallback((x: number, y: number) => {
    const dx = x - startXRef.current
    const dy = y - startYRef.current
    if (Math.sqrt(dx * dx + dy * dy) > moveTolerance) cancel()
  }, [cancel, moveTolerance])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    start(t.clientX, t.clientY)
  }, [start])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    move(t.clientX, t.clientY)
  }, [move])

  const onTouchEnd = useCallback(() => {
    cancel()
  }, [cancel])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    start(e.clientX, e.clientY)
  }, [start])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    move(e.clientX, e.clientY)
  }, [move])

  const onMouseUp = useCallback(() => {
    cancel()
  }, [cancel])

  /**
   * Devuelve true si el último click fue resultado de un long-press
   * (para que el onClick consumidor pueda hacer un return temprano).
   */
  const wasTriggered = useCallback(() => triggeredRef.current, [])

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: cancel,
    },
    wasTriggered,
  }
}

export default useLongPress
