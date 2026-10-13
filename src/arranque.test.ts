// Lo que se copia de Persevera llega con su verde y sus textos. Estas pruebas
// fallan si alguno se cuela en lo que se ve antes de que monte React: el HTML
// de arranque y las páginas estáticas de public/.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const raiz = join(import.meta.dirname, '..')
const paginas = [
  'index.html',
  ...readdirSync(join(raiz, 'public')).filter(n => n.endsWith('.html')).map(n => join('public', n)),
]

describe('las páginas de arranque', () => {
  it.each(paginas)('%s no lleva el verde de Persevera', pagina => {
    const html = readFileSync(join(raiz, pagina), 'utf8')
    expect(html).not.toMatch(/#0D7C66|#0a6553|rgba\(\s*13\s*,\s*124\s*,\s*102/i)
  })

  it.each(paginas)('%s no usa «·» como separador', pagina => {
    expect(readFileSync(join(raiz, pagina), 'utf8')).not.toContain('·')
  })

  it('index.html arranca con el fondo de la paleta', () => {
    const html = readFileSync(join(raiz, 'index.html'), 'utf8')
    expect(html).toContain('<meta name="theme-color" content="#0F2A31" />')
    expect(html).toMatch(/html, body \{ background: #0F2A31;/)
  })
})
