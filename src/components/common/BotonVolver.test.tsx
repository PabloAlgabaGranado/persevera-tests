// Copiado de Persevera (src/components/common/BotonVolver.test.tsx) el
// 15-oct-2026, rama claude/dia-d en 54e448e. Copiar, nunca mover: el original
// sigue en Persevera. Tal cual.

import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { BotonVolver } from './BotonVolver'

const texto = (el: React.ReactElement) => renderToStaticMarkup(el).match(/aria-label="([^"]+)"/)?.[1]

describe('el botón de volver dice adónde lleva', () => {
  it('«Volver a» y el destino', () => {
    expect(texto(<BotonVolver a="Contabilidad financiera" onClick={() => {}} />)).toBe('Volver a Contabilidad financiera')
  })

  it('«a el» se contrae en «al»', () => {
    expect(texto(<BotonVolver a="el plan" onClick={() => {}} />)).toBe('Volver al plan')
    expect(texto(<BotonVolver a="El cante" onClick={() => {}} />)).toBe('Volver al cante')
  })

  it('el artículo de un nombre va en minúscula en mitad de la frase', () => {
    expect(texto(<BotonVolver a="La gestión tributaria y el ciclo de la declaración" onClick={() => {}} />))
      .toBe('Volver a la gestión tributaria y el ciclo de la declaración')
    expect(texto(<BotonVolver a="Los módulos" onClick={() => {}} />)).toBe('Volver a los módulos')
  })

  it('sin destino, «Volver»; y una acción se dice tal cual', () => {
    expect(texto(<BotonVolver onClick={() => {}} />)).toBe('Volver')
    expect(texto(<BotonVolver etiqueta="Salir del simulacro" onClick={() => {}} />)).toBe('Salir del simulacro')
  })
})
