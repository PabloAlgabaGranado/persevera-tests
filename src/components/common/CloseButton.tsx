// Copiado de Persevera (src/components/common/CloseButton.tsx) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual.

/**
 * CloseButton — botón de cerrar (X) CANÓNICO de Persevera.
 * src/components/common/CloseButton.tsx
 *
 * Fuente única para que la X de cerrar sea IDÉNTICA en todos los modales
 * (contraseña, eliminar cuenta, editar nombre, avatar, compra, sesión…).
 * Antes cada modal pintaba su propia X con tamaños/colores distintos.
 *
 * Uso:
 *   <CloseButton onClick={onCancel} />
 *   <CloseButton onClick={onClose} disabled={busy} />
 */

import { X } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

interface CloseButtonProps {
  onClick: () => void
  disabled?: boolean
  ariaLabel?: string
  /** Overrides puntuales (p. ej. posición absoluta en una esquina). */
  style?: CSSProperties
}

export function CloseButton({ onClick, disabled = false, ariaLabel = 'Cerrar', style }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-haptic="light"
      style={{
        width: 38, height: 38, borderRadius: 11,
        border: 'none',
        background: 'rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
        padding: 0,
        ...style,
      }}
    >
      <X size={21} weight="bold" color="rgba(255,255,255,0.78)" />
    </button>
  )
}

export default CloseButton
