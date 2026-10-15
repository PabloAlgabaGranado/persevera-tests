// Copiado de Persevera (src/lib/__tests__/pruebaIdioma.test.ts) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual.

import { describe, it, expect } from 'vitest'
import { localizarTemaIdioma, ES_TEMA_IDIOMA } from '../pruebaIdioma'

const t = (id: string, titulo: string) => ({ id, titulo })

describe('localizarTemaIdioma', () => {
  it('encuentra el tema de inglés entre los del temario', () => {
    const temas = [t('1', 'Derechos Humanos'), t('9', 'Lengua inglesa'), t('18', 'Topografía')]
    expect(localizarTemaIdioma(temas)?.id).toBe('9')
  })

  it('tolera cómo se haya escrito el título', () => {
    for (const titulo of ['Inglés', 'inglés', 'Prueba de lengua inglesa', 'Idioma extranjero', 'INGLES']) {
      expect(ES_TEMA_IDIOMA.test(titulo)).toBe(true)
    }
  })

  it('devuelve null si la oposición no tiene prueba de idioma', () => {
    const temas = [t('1', 'Derecho constitucional'), t('2', 'Gestión financiera')]
    expect(localizarTemaIdioma(temas)).toBeNull()
  })

  it('no confunde temas que solo mencionan otra cosa', () => {
    // "Inglaterra" contiene "ingl" pero no es la prueba de idioma: el patrón
    // exige la palabra completa.
    expect(ES_TEMA_IDIOMA.test('Historia de Inglaterra')).toBe(false)
    expect(ES_TEMA_IDIOMA.test('Instituciones internacionales')).toBe(false)
  })

  it('con varios candidatos se queda con el primero, que es el de menor número', () => {
    const temas = [t('a', 'Lengua inglesa'), t('b', 'Idioma: inglés técnico')]
    expect(localizarTemaIdioma(temas)?.id).toBe('a')
  })

  it('aguanta un título vacío o ausente sin romper', () => {
    expect(localizarTemaIdioma([t('x', ''), t('y', 'Inglés')])?.id).toBe('y')
  })
})
