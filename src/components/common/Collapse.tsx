// Copiado de Persevera (src/components/common/Collapse.tsx) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual. La clase pv-collapse y la curva --pv-ease-out están en
// src/movimientos.css.

import type { ReactNode } from 'react'

/**
 * Collapse — despliegue/plegado con ALTURA animada y suave, sin medir en JS.
 *
 * Truco CSS: el contenedor es un grid cuya única fila pasa de `0fr` (cerrado) a
 * `1fr` (abierto); animar `grid-template-rows` interpola la altura aunque el
 * contenido sea de alto `auto`. El hijo va con `overflow:hidden` + `min-height:0`
 * para recortarse mientras crece/encoge.
 *
 * El contenido permanece montado (clipado cuando está cerrado) para que la
 * animación sea suave EN AMBOS sentidos. Respeta `prefers-reduced-motion` vía la
 * clase `.pv-collapse` (definida en index.css), que anula la transición.
 *
 * Uso:
 *   <Collapse open={abierto}>
 *     <div> …contenido del acordeón… </div>
 *   </Collapse>
 */
export function Collapse({
  open,
  children,
  durationMs = 320,
}: {
  open: boolean
  children: ReactNode
  durationMs?: number
}) {
  return (
    <div
      className="pv-collapse"
      aria-hidden={!open}
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: open ? 1 : 0,
        transition: `grid-template-rows ${durationMs}ms var(--pv-ease-out), opacity ${durationMs}ms var(--pv-ease-out)`,
      }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  )
}

export default Collapse
