// Copiado de Persevera (src/components/common/BotonVolver.tsx) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual.

/**
 * BotonVolver: EL botón de volver de Persevera, uno solo para toda la app.
 *
 * Dice el verbo y adónde lleva: «← Volver a Contabilidad financiera», «← Volver
 * al plan». Va lo PRIMERO de la pantalla, arriba a la izquierda, que es donde se
 * busca.
 *
 * Por qué así (Álvaro, 19-sep-2026: «que los botones de ir atrás se sepan y
 * sean intuitivos»): había cinco maneras de volver —una flecha sola en un
 * cuadrado, «‹ Atrás», «Volver», una «←» escrita a mano y una píldora verde con
 * el nombre del sitio—, y la del nombre se leía como una etiqueta más, no como un
 * botón. Una sola forma, que diga lo que hace, se aprende una vez.
 *
 *   · `a`: el destino. Si la pantalla tiene NOMBRE —una sección, una
 *     colección, una materia—, tal cual se ve en su título, con mayúscula y
 *     sin artículo: «Volver a Exámenes pasados», «Volver a Banco de
 *     ejercicios» (Álvaro, 19-sep: en minúscula no parecía el nombre de ningún
 *     sitio). Si no lo tiene, en minúscula y con artículo, y «el …» se
 *     contrae: a="el resultado" → «Volver al resultado».
 *   · `etiqueta`: cuando no es volver a un sitio sino salir de algo
 *     («Cancelar», «Salir del simulacro»). Sin `a` ni `etiqueta`: «Volver».
 *   · Neutro, sin verde: el verde es la acción principal de la pantalla, y
 *     volver nunca lo es.
 *
 * NO es para: el paso anterior de un asistente o de una lista de preguntas
 * («Anterior»), ni cerrar un modal (eso es CloseButton, la X).
 */
import { ArrowLeft } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'

export interface BotonVolverProps {
  onClick: () => void
  a?: string
  etiqueta?: string
  /** Sobre fondo oscuro (el navy de la app). En claro, texto oscuro sobre blanco. */
  onDark?: boolean
  disabled?: boolean
  style?: CSSProperties
}

export function BotonVolver({ onClick, a, etiqueta, onDark = false, disabled = false, style }: BotonVolverProps) {
  // «a el plan» se contrae: «al plan». Y un artículo que llega en mayúscula
  // porque es el principio de un nombre («La gestión tributaria…») va en
  // minúscula en mitad de la frase: «Volver a la gestión tributaria…».
  const destino = !a ? null
    : /^el\s/i.test(a) ? { prep: 'Volver al', resto: a.slice(3) }
    : { prep: 'Volver a', resto: a.replace(/^(La|Las|Los|Lo)\s/, m => m.toLowerCase()) }
  const texto = destino ? `${destino.prep} ${destino.resto}` : (etiqueta ?? 'Volver')
  return (
    <button onClick={onClick} disabled={disabled} data-haptic="light" aria-label={texto} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', flexShrink: 0,
      border: onDark ? '1px solid rgba(255,255,255,0.22)' : '1px solid #ECE8DC',
      background: onDark ? 'rgba(255,255,255,0.04)' : '#fff',
      color: onDark ? '#ffffff' : '#22302A', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
      padding: '7px 14px 7px 10px', borderRadius: 999, marginBottom: 12,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
      ...style,
    }}>
      <ArrowLeft size={16} weight="bold" style={{ flexShrink: 0 }} />
      {destino ? (
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {destino.prep}{' '}
          <span style={{ fontWeight: 500, color: onDark ? 'rgba(255,255,255,0.62)' : '#98a49d' }}>{destino.resto}</span>
        </span>
      ) : (
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{texto}</span>
      )}
    </button>
  )
}

export default BotonVolver
