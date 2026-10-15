// Copiado de Persevera (src/components/common/RejillaRespuestas.tsx) el
// 15-oct-2026, rama claude/dia-d en 54e448e. Copiar, nunca mover: el original
// sigue en Persevera. Tal cual.

// ─────────────────────────────────────────────────────────────────────────────
// PERSEVERA · Hoja de respuestas (rejilla numerada)
// ─────────────────────────────────────────────────────────────────────────────
// Una sola rejilla para todas las pantallas donde se responde. Antes había TRES
// implementaciones independientes —un desplegable de 280px en tests y supuestos
// (duplicado literalmente entre las dos), un modal en el simulacro y una rejilla
// inline en el resultado— con tres tamaños de celda, tres verdes y dos formas
// distintas de señalar "estás aquí". El usuario se encontraba la misma función
// con otra cara según la pantalla.
//
// Lo que se comparte es la REJILLA, no el contenedor: que sea desplegable,
// modal o inline lo decide cada pantalla, porque ahí sí hay motivos (en el
// resultado no hay nada que desplegar). Los colores salen de `styles/examen`.
// ─────────────────────────────────────────────────────────────────────────────

import { Bookmark } from '@phosphor-icons/react'
import { estiloCelda, columnasHoja, fuenteCelda, type EstadoCelda } from '../../styles/examen'

export interface CeldaRespuesta {
  /** Clave de React. El id de la pregunta, o el índice si no hay. */
  clave: string
  estado: EstadoCelda
  /** Marcada para revisar. Manda sobre el estado de respuesta. */
  marcada?: boolean
}

interface Props {
  celdas: CeldaRespuesta[]
  /** Índice de la que se está viendo. -1 o undefined si ninguna (resultado). */
  indiceActual?: number
  /** Si se pasa, las celdas navegan. Sin él la rejilla es solo de lectura. */
  onIr?: (indice: number) => void
}

export function RejillaRespuestas({ celdas, indiceActual = -1, onIr }: Props) {
  const columnas = columnasHoja(celdas.length)
  const fuente = fuenteCelda(celdas.length)
  const navegable = typeof onIr === 'function'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columnas}, 1fr)`, gap: 6 }}>
      {celdas.map((c, i) => {
        const s = estiloCelda(c.estado, { actual: i === indiceActual, marcada: c.marcada })
        return (
          <div
            key={c.clave}
            onClick={navegable ? (e) => { e.stopPropagation(); onIr!(i) } : undefined}
            data-pressable={navegable ? '' : undefined}
            style={{
              aspectRatio: '1',
              background: s.bg,
              border: `1.5px solid ${s.border}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: fuente, fontWeight: 700, color: s.color,
              // Sin esto una celda con «119» ensancha su columna y descuadra la rejilla.
              minWidth: 0, overflow: 'hidden',
              cursor: navegable ? 'pointer' : 'default',
              position: 'relative',
              transition: 'background 0.12s, border-color 0.12s, color 0.12s',
            }}
          >
            {i + 1}
            {c.marcada && (
              <Bookmark size={8} color="#E8863A" weight="fill" style={{ position: 'absolute', top: 2, right: 2 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default RejillaRespuestas
