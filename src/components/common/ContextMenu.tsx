// Copiado de Persevera (src/components/common/ContextMenu.tsx) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual. Trae con él useSheetDrag.ts y SheetHandle.tsx, que
// importa, y sus clases están en src/movimientos.css.

/**
 * ContextMenu
 * ───────────
 * Bottom sheet contextual reutilizable. Diseñado para activarse con
 * long-press (vía useLongPress) sobre cualquier elemento — pregunta del
 * Revisar de un test, item de la biblioteca, etc.
 *
 * Estilo: igual que el SupuestoSelectorSheet pero más liviano.
 * Animación: pv-context-menu-up (spring suave) + fade del overlay.
 *
 * Cierre:
 *   - Tap fuera del sheet (overlay)
 *   - Tap en cualquier opción
 *   - Botón "Cancelar" implícito (ESC en desktop)
 *
 * Uso típico:
 *   const [contextFor, setContextFor] = useState<Pregunta | null>(null)
 *   const longPress = useLongPress(() => setContextFor(p))
 *
 *   <div {...longPress.handlers} onClick={() => {
 *     if (longPress.wasTriggered()) return
 *     restoLogica()
 *   }}>...</div>
 *
 *   {contextFor && <ContextMenu
 *     title={contextFor.enunciado}
 *     items={[...]}
 *     onClose={() => setContextFor(null)}
 *   />}
 */

import { useEffect, useState, type ReactNode } from 'react'
import { haptics } from '../../hooks/useHaptics'
import { useSheetDrag } from '../../hooks/useSheetDrag'
import { SheetHandle } from './SheetHandle'

export interface ContextMenuItem {
  /** Identificador único — útil para keys. */
  id: string
  /** Texto principal. */
  label: string
  /** Subtítulo opcional. */
  sub?: string
  /** Icono o emoji a la izquierda. */
  icon?: ReactNode
  /** Color del texto/icono. Default: blanco. Útil para destructive (rojo). */
  tone?: 'default' | 'destructive' | 'success'
  /** Handler. Recibe el item para mantener el estado simple. */
  onSelect: () => void
}

interface Props {
  /** Título mostrado arriba del sheet (corto, max 80 chars). */
  title?: string
  /** Texto descriptivo opcional bajo el título. */
  subtitle?: string
  /** Items a mostrar. */
  items: ContextMenuItem[]
  /** Callback de cierre (tap fuera o tras seleccionar). */
  onClose: () => void
}

export function ContextMenu({ title, subtitle, items, onClose }: Props) {
  // Animación de entrada/salida estilo iOS (similar al SupuestoSelectorSheet)
  const ANIM_MS = 280
  const [closing, setClosing] = useState(false)

  const closeWithAnim = () => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, ANIM_MS)
  }

  const { panelRef, handleProps } = useSheetDrag(closeWithAnim)

  const handleSelect = (item: ContextMenuItem) => {
    haptics.light()
    closeWithAnim()
    // Damos un frame antes de ejecutar para que la animación de cierre
    // arranque limpia sin competir con la siguiente vista que abra el item.
    requestAnimationFrame(() => item.onSelect())
  }

  // ESC en desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWithAnim()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toneStyles: Record<NonNullable<ContextMenuItem['tone']>, { color: string; bg: string }> = {
    default: {
      color: 'white',
      bg:    'rgba(255,255,255,0.04)',
    },
    destructive: {
      color: '#E89090',
      bg:    'rgba(213,84,84,0.10)',
    },
    success: {
      color: '#5BA899',
      bg:    'rgba(91,168,153,0.10)',
    },
  }

  return (
    <div
      onClick={closeWithAnim}
      style={{
        position: 'fixed', inset: 0, zIndex: 240,
        background: closing ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        transition: `background ${ANIM_MS}ms ease-out`,
        pointerEvents: closing ? 'none' : 'auto',
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        className={`pv-sheet-panel ${closing ? '' : 'pv-context-menu-up'}`}
        style={{
          width: '100%',
          maxWidth: 430,
          background: '#1B2A4A',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: '22px 18px calc(20px + env(safe-area-inset-bottom, 0px))',
          border: '1px solid rgba(255,255,255,0.08)',
          maxHeight: '85vh',
          overflowY: 'auto',
          transform: closing ? 'translateY(100%)' : 'translateY(0)',
          transition: `transform ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        }}
      >
        {/* Drag handle — arrastra hacia abajo para cerrar (zona de agarre amplia) */}
        <SheetHandle handleProps={handleProps} color="rgba(255,255,255,0.18)" style={{ margin: '-10px 0 8px' }} />

        {/* Header */}
        {(title || subtitle) && (
          <div style={{ marginBottom: 14, padding: '0 4px' }}>
            {title && (
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.1px',
                lineHeight: 1.4,
                // Si el título es largo (enunciado de pregunta), 2 líneas máx
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 4,
                lineHeight: 1.4,
              }}>
                {subtitle}
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(item => {
            const tone = item.tone ?? 'default'
            const s    = toneStyles[tone]
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                data-pressable=""
                data-haptic="none"  // ya disparamos light en handleSelect
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 14px',
                  borderRadius: 12,
                  background: s.bg,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: s.color,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '-0.1px',
                  transition: 'background 0.15s, transform 0.15s',
                }}
              >
                {item.icon && (
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, fontSize: 18 }}>
                    {item.icon}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div>{item.label}</div>
                  {item.sub && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: 500 }}>
                      {item.sub}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Cancelar */}
        <button
          onClick={closeWithAnim}
          style={{
            width: '100%',
            marginTop: 12,
            padding: '14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default ContextMenu
