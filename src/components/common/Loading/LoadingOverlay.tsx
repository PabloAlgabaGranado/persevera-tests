// Copiado de Persevera (src/components/common/Loading/LoadingOverlay.tsx) el
// 15-oct-2026, rama claude/dia-d en 54e448e. Copiar, nunca mover: el original
// sigue en Persevera. Tal cual.

import { Loading } from './Loading'

/**
 * Loader a pantalla completa para acciones en curso (generar/construir/cargar).
 * El flexo va centrado SOBRE el velo, SIN caja — mismo lenguaje que el loader de
 * los mapas mentales. Úsalo en lugar de envolver `<Loading>` en un cuadrado.
 */
export function LoadingOverlay({ label }: { label?: string }) {
  return (
    <div
      className="pv-fade-in-quick"
      role="status"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 260,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loading variant="flexo" onDark label={label} />
    </div>
  )
}
