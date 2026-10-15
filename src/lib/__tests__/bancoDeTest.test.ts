// Copiado de Persevera (src/lib/__tests__/bancoDeTest.test.ts) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Tal cual.

import { describe, it, expect, vi } from 'vitest'

// El módulo importa el cliente de Supabase al cargarse; aquí solo se usan sus
// funciones puras.
vi.mock('../supabase', () => ({ supabase: {} }))

import { preguntasDeTestPorTema, soloConBancoDeTest, type FilaBancoDeTest } from '../bancoDeTest'

// ════════════════════════════════════════════════════════════════════════════
// QUÉ SE PUEDE OFRECER PARA HACER UN TEST
// ----------------------------------------------------------------------------
// El Anexo I.1.4 del Técnico de Hacienda (38 temas, 66,7 % del peso del proceso)
// es la materia del 3.er ejercicio, que se escribe: el BOE deja el test del 1.º
// en los anexos I.1.1 y I.1.2. El selector lo ofrecía igual y al empezar decía
// «No se encontraron preguntas con estos filtros», culpando al opositor.
// Se esconde contando el banco, nunca por `peso_test`: el bloque de Lengua
// inglesa de la Guardia Civil tiene peso 0 y 336 preguntas.
// ════════════════════════════════════════════════════════════════════════════

const bloque = (id: string, numero: number) => ({ id, numero, nombre: `Bloque ${numero}` })
const tema = (id: string, bloque_id: string) => ({ id, bloque_id })

describe('soloConBancoDeTest', () => {
  it('esconde el bloque cuyos temas están todos a cero, y deja el resto', () => {
    const bloques = [bloque('b1', 1), bloque('b2', 2), bloque('b3', 3)]
    const temas = [tema('t1', 'b1'), tema('t2', 'b2'), tema('t3', 'b3'), tema('t4', 'b3')]
    const banco = new Map([['t1', 6189], ['t2', 4280], ['t3', 0], ['t4', 0]])

    const vis = soloConBancoDeTest(bloques, temas, banco)

    expect(vis.bloques.map(b => b.id)).toEqual(['b1', 'b2'])
    expect(vis.temas.map(t => t.id)).toEqual(['t1', 't2'])
  })

  it('mantiene el bloque que tiene banco aunque su peso de test sea 0 (inglés de la Guardia Civil)', () => {
    // El peso no entra en esta función a propósito: aquí solo se cuentan preguntas.
    const bloques = [bloque('b1', 1), bloque('b4', 4)]
    const temas = [tema('t1', 'b1'), tema('ingles', 'b4')]
    const banco = new Map([['t1', 2587], ['ingles', 336]])

    expect(soloConBancoDeTest(bloques, temas, banco).bloques.map(b => b.id)).toEqual(['b1', 'b4'])
  })

  it('sin recuentos no esconde nada: la consulta pudo fallar', () => {
    const bloques = [bloque('b1', 1), bloque('b3', 3)]
    const temas = [tema('t1', 'b1'), tema('t3', 'b3')]

    const vis = soloConBancoDeTest(bloques, temas, new Map())

    expect(vis.bloques).toHaveLength(2)
    expect(vis.temas).toHaveLength(2)
  })

  it('un tema que no aparece en los recuentos se considera con banco', () => {
    const bloques = [bloque('b1', 1)]
    const temas = [tema('t1', 'b1'), tema('nuevo', 'b1')]
    const banco = new Map([['t1', 100]])

    expect(soloConBancoDeTest(bloques, temas, banco).temas.map(t => t.id)).toEqual(['t1', 'nuevo'])
  })

  it('si TODO estuviera a cero devuelve todo: una pantalla vacía delata un fallo, no un temario', () => {
    const bloques = [bloque('b1', 1), bloque('b2', 2)]
    const temas = [tema('t1', 'b1'), tema('t2', 'b2')]
    const banco = new Map([['t1', 0], ['t2', 0]])

    const vis = soloConBancoDeTest(bloques, temas, banco)

    expect(vis.bloques).toHaveLength(2)
    expect(vis.temas).toHaveLength(2)
  })

  it('no juzga al bloque del que no se ha cargado ningún tema', () => {
    const bloques = [bloque('b1', 1), bloque('b9', 9)]
    const temas = [tema('t1', 'b1')]
    const banco = new Map([['t1', 100]])

    expect(soloConBancoDeTest(bloques, temas, banco).bloques.map(b => b.id)).toEqual(['b1', 'b9'])
  })
})

describe('preguntasDeTestPorTema', () => {
  it('suma por epígrafes cuando el tema los tiene, y por tema_id cuando no', () => {
    const filas: FilaBancoDeTest[] = [
      { id: 'conEps', te: [{ ep: { p: [{ count: 30 }] } }, { ep: { p: [{ count: 12 }] } }], pt: [{ count: 999 }] },
      { id: 'sinEps', te: [], pt: [{ count: 44 }] },
      { id: 'vacio',  te: [], pt: [] },
    ]

    const banco = preguntasDeTestPorTema(filas)

    expect(banco.get('conEps')).toBe(42)   // los epígrafes mandan sobre tema_id
    expect(banco.get('sinEps')).toBe(44)
    expect(banco.get('vacio')).toBe(0)
  })
})
