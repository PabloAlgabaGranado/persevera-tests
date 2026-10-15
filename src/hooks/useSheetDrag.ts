// Copiado de Persevera (src/hooks/useSheetDrag.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. Lo importa ContextMenu.tsx.

/**
 * PERSEVERA — useSheetDrag
 *
 * Hook reutilizable de "arrastrar hacia abajo para cerrar" un bottom sheet.
 *
 * Devuelve:
 *  · panelRef    → ref al PANEL de la hoja (el div que sube desde abajo). Se le
 *                  aplica el translateY del arrastre directamente por estilo
 *                  (sin re-render, para que el arrastre sea fluido).
 *  · handleProps → props para el ENVOLTORIO de la rayita. Ese envoltorio debe
 *                  tener una zona de agarre AMPLIA (padding generoso): el opositor
 *                  agarra toda la franja superior, no solo la rayita de 36×4.
 *                  Úsalo con el componente <SheetHandle>, que ya da esa franja.
 *
 * Usa Pointer Events (touch + ratón) y captura el puntero, así el arrastre sigue
 * aunque el dedo se salga de la rayita. Solo se engancha a la rayita, de modo
 * que NO interfiere con el scroll del contenido de la hoja.
 */

import { useCallback, useRef } from 'react'

interface SheetDragOptions {
  /** Píxeles arrastrados hacia abajo a partir de los cuales se cierra (def. 110). */
  threshold?: number
}

export function useSheetDrag(onClose: () => void, options: SheetDragOptions = {}) {
  const threshold = options.threshold ?? 110
  const panelRef  = useRef<HTMLDivElement | null>(null)
  const startY    = useRef<number | null>(null)
  const dy        = useRef(0)

  const apply = (y: number, animate: boolean) => {
    const el = panelRef.current
    if (!el) return
    el.style.transition = animate ? 'transform 0.24s cubic-bezier(0.16,1,0.3,1)' : 'none'
    el.style.transform  = y > 0 ? `translateY(${y}px)` : 'translateY(0)'
  }

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startY.current = e.clientY
    dy.current = 0
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch { /* noop */ }
    apply(0, false)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (startY.current === null) return
    dy.current = Math.max(0, e.clientY - startY.current)
    apply(dy.current, false)
  }, [])

  const finish = useCallback(() => {
    if (startY.current === null) return
    const dragged = dy.current
    startY.current = null
    dy.current = 0
    if (dragged > threshold) {
      // Animar la hoja fuera de pantalla y cerrar.
      const el = panelRef.current
      if (el) {
        const h = el.offsetHeight || 600
        el.style.transition = 'transform 0.2s ease-in'
        el.style.transform  = `translateY(${h}px)`
      }
      window.setTimeout(onClose, 190)
    } else {
      // No llegó al umbral → vuelve a su sitio.
      apply(0, true)
    }
  }, [onClose, threshold])

  const handleProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp:     finish,
    onPointerCancel: finish,
    style: { touchAction: 'none' as const, cursor: 'grab' as const },
  }

  return { panelRef, handleProps }
}

export type SheetDragHandleProps = ReturnType<typeof useSheetDrag>['handleProps']
