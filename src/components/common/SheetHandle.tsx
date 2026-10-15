// Copiado de Persevera (src/components/common/SheetHandle.tsx) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual. Lo importa ContextMenu.tsx.

/**
 * PERSEVERA — SheetHandle
 *
 * La "rayita" de arrastre de un bottom sheet, con ZONA DE AGARRE AMPLIA.
 *
 * El envoltorio ocupa TODA la franja superior de la hoja (ancho completo, ~24px
 * de alto por el padding) para que sea fácil de agarrar con el dedo; la rayita
 * visible sigue siendo fina. Se usa junto a `useSheetDrag` (le pasas handleProps).
 *
 *   const { panelRef, handleProps } = useSheetDrag(onClose)
 *   ...
 *   <div ref={panelRef} >        // el panel de la hoja
 *     <SheetHandle handleProps={handleProps} />
 *     ...
 */

import type { CSSProperties } from 'react'
import type { SheetDragHandleProps } from '../../hooks/useSheetDrag'

interface Props {
  handleProps: SheetDragHandleProps
  /** Color de la rayita; usa claro u oscuro según el fondo de la hoja. */
  color?: string
  /** Estilo extra del envoltorio (p.ej. margen inferior). */
  style?: CSSProperties
}

export function SheetHandle({ handleProps, color = '#d4d4d4', style }: Props) {
  return (
    <div
      {...handleProps}
      style={{
        ...handleProps.style,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%',
        padding: '11px 0 13px',
        ...style,
      }}
    >
      <div style={{ width: 44, height: 5, borderRadius: 3, background: color }} />
    </div>
  )
}

export default SheetHandle
