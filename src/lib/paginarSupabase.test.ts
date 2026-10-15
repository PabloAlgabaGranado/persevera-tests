// Copiado de Persevera (src/lib/paginarSupabase.test.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

// ─────────────────────────────────────────────────────────────────────────────
// Gate de `traerTodas`. Se prueba con una consulta de mentira, porque lo que hay
// que comprobar no es Postgres sino las tres decisiones del helper: cuántas
// páginas pide, qué hace cuando una falla, y qué devuelve como total.
//
// La que más importa es la segunda. El helper que ya existía en el repo rompía
// el bucle en silencio ante un error, así que un fallo de red daba una lista
// corta que el llamante pintaba como si estuviera completa. Aquí eso tiene que
// LANZAR, y hay un test que lo fija: más vale una pantalla que falla que una
// pantalla que miente.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { traerTodas, PAGINA } from './paginarSupabase'

/** Una tabla de mentira con `n` filas, que responde como supabase-js: nunca
 *  lanza, siempre devuelve `{ data, error }`. */
function tablaFalsa(n: number, fallaEnPagina?: number) {
  const rangos: [number, number][] = []
  const filas = Array.from({ length: n }, (_, i) => ({ id: i }))
  return {
    rangos,
    contar: () => Promise.resolve({ count: n, error: null }),
    pagina: (desde: number, hasta: number) => {
      rangos.push([desde, hasta])
      if (fallaEnPagina !== undefined && desde === fallaEnPagina * PAGINA) {
        return Promise.resolve({ data: null, error: { message: 'se cayó la red' } })
      }
      return Promise.resolve({ data: filas.slice(desde, hasta + 1), error: null })
    },
  }
}

describe('traerTodas', () => {
  it('trae más de mil filas, que es justo lo que PostgREST no da de una vez', async () => {
    const t = tablaFalsa(3402)
    const { filas, total } = await traerTodas<{ id: number }>(t.contar, t.pagina)
    expect(filas).toHaveLength(3402)
    expect(total).toBe(3402)
    expect(t.rangos).toHaveLength(4)                       // 3402 → 4 páginas
    expect(t.rangos[0]).toEqual([0, 999])
    expect(t.rangos[3]).toEqual([3000, 3999])              // la última, incompleta
    // Sin huecos ni solapes: cada fila una vez y en su sitio.
    expect(filas.map(f => f.id)).toEqual(Array.from({ length: 3402 }, (_, i) => i))
  })

  it('en el borde exacto de mil no pide una página de más', async () => {
    const t = tablaFalsa(PAGINA)
    const { filas } = await traerTodas<{ id: number }>(t.contar, t.pagina)
    expect(filas).toHaveLength(PAGINA)
    expect(t.rangos).toHaveLength(1)
  })

  it('⚠️ si una página falla, LANZA en vez de devolver una lista corta', async () => {
    const t = tablaFalsa(3402, 2)   // se cae la tercera página
    await expect(traerTodas<{ id: number }>(t.contar, t.pagina)).rejects.toBeDefined()
  })

  it('sin filas no pide ninguna página', async () => {
    const t = tablaFalsa(0)
    const { filas, total } = await traerTodas<{ id: number }>(t.contar, t.pagina)
    expect(filas).toEqual([])
    expect(total).toBe(0)
    expect(t.rangos).toHaveLength(0)
  })

  it('si el recuento falla, lanza: sin él no se sabe cuántas páginas hay', async () => {
    const contar = () => Promise.resolve({ count: null, error: { message: 'sin permiso' } })
    const pagina = () => Promise.resolve({ data: [], error: null })
    await expect(traerTodas(contar, pagina)).rejects.toBeDefined()
  })

  it('⚠️ lanza un Error DE VERDAD, no el objeto plano de supabase-js', async () => {
    // supabase-js no envuelve sus errores salvo con `.throwOnError()`, y en este
    // repo no hay ninguno: devuelve `{message, details, hint, code}` pelado.
    // Relanzarlo tal cual rompía a todo el que hiciera `e instanceof Error`, que
    // es el patrón normal de los `catch` de este código — el mensaje se perdía y
    // quedaba un «desconocido» en pantalla.
    const crudo = { message: 'JWT expired', code: 'PGRST301' }
    let capturado: unknown = null
    try {
      await traerTodas(
        () => Promise.resolve({ count: null, error: crudo }),
        () => Promise.resolve({ data: [], error: null }),
      )
    } catch (e) { capturado = e }
    expect(capturado).toBeInstanceOf(Error)
    expect((capturado as Error).message).toContain('JWT expired')
  })

  it('⚠️ `count: null` NO es «cero filas»: lanza en vez de devolver una lista vacía', async () => {
    // Null significa que el servidor no ha dado recuento —RLS, un error blando—.
    // Devolver «cero» ahí sería justo el fallo que este módulo combate: una lista
    // vacía que el llamante da por buena. Cero sí es una respuesta legítima.
    await expect(
      traerTodas(() => Promise.resolve({ count: null, error: null }), () => Promise.resolve({ data: [], error: null })),
    ).rejects.toThrow(/no devolvió recuento/)

    const { filas, total } = await traerTodas(
      () => Promise.resolve({ count: 0, error: null }),
      () => Promise.resolve({ data: [], error: null }),
    )
    expect(filas).toEqual([])
    expect(total).toBe(0)
  })

  it('devuelve el total DEL SERVIDOR, para poder contrastarlo', async () => {
    // El servidor dice 2.500 pero solo llegan 1.500: el llamante tiene que poder
    // notarlo comparando `filas.length` con `total`. Si el helper devolviera
    // `filas.length` como total, el contraste sería imposible por construcción.
    const filas = Array.from({ length: 2500 }, (_, i) => ({ id: i }))
    const { filas: traidas, total } = await traerTodas<{ id: number }>(
      () => Promise.resolve({ count: 2500, error: null }),
      (desde, hasta) => Promise.resolve({ data: filas.slice(desde, Math.min(hasta + 1, 1500)), error: null }),
    )
    expect(total).toBe(2500)
    expect(traidas.length).toBe(1500)
    expect(traidas.length).not.toBe(total)   // el llamante lo detecta y avisa
  })
})
