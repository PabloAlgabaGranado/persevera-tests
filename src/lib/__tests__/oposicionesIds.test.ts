// Copiado de Persevera (src/lib/__tests__/oposicionesIds.test.ts) el
// 15-oct-2026, rama claude/dia-d en 54e448e. Copiar, nunca mover: el original
// sigue en Persevera. Tal cual.

import { describe, it, expect } from 'vitest'
import {
  ID_ADMINISTRATIVO, ID_AUXILIAR, ID_HACIENDA, ID_SEGURIDAD_SOCIAL,
  ID_GUARDIA_CIVIL, esGuardiaCivil, conGuardiaCivil, GUARDIA_CIVIL_VOLCADA,
  ID_GESTION_CIVIL, ID_TECNICO_HACIENDA,
} from '../oposicionesIds'

const VIVAS = [ID_ADMINISTRATIVO, ID_AUXILIAR, ID_HACIENDA, ID_SEGURIDAD_SOCIAL]

describe('los ids de las oposiciones', () => {
  it('son cinco y todos distintos', () => {
    const ids = [...VIVAS, ID_GUARDIA_CIVIL]
    expect(new Set(ids).size).toBe(5)
    for (const id of ids) expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('las volcadas sin activar tampoco se repiten con ninguna viva', () => {
    const ids = [...VIVAS, ID_GUARDIA_CIVIL, ID_TECNICO_HACIENDA, ID_GESTION_CIVIL]
    expect(new Set(ids).size).toBe(7)
    for (const id of ids) expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })
})

describe('esGuardiaCivil · la guarda del id vacío', () => {
  // Esta función existe por lo que pasaba ANTES del volcado: con el id a '',
  // comparar a pelo (`oposicionId === ID_GUARDIA_CIVIL`) daba TRUE para cualquier
  // llamada sin id, encendiendo la configuración de Guardia Civil en la oposición
  // equivocada. El id ya está puesto, pero la guarda se queda: la próxima
  // oposición que se prepare volverá a pasar por ese estado.
  it('un id ausente NUNCA es Guardia Civil', () => {
    expect(esGuardiaCivil('')).toBe(false)
    expect(esGuardiaCivil(null)).toBe(false)
    expect(esGuardiaCivil(undefined)).toBe(false)
  })

  it('reconoce a Guardia Civil, y solo a ella', () => {
    expect(esGuardiaCivil(ID_GUARDIA_CIVIL)).toBe(true)
    for (const id of VIVAS) expect(esGuardiaCivil(id)).toBe(false)
  })
})

describe('conGuardiaCivil · no ensucia los mapas', () => {
  it('añade la entrada de Guardia Civil bajo SU id', () => {
    const mapa = { [ID_ADMINISTRATIVO]: 'admin', ...conGuardiaCivil('gc') }
    expect(mapa[ID_GUARDIA_CIVIL]).toBe('gc')
    expect(mapa[ID_ADMINISTRATIVO]).toBe('admin')
    expect(Object.keys(mapa)).toHaveLength(2)
  })

  it('jamás crea la clave vacía, que capturaría a quien no debe', () => {
    const mapa: Record<string, string> = { ...conGuardiaCivil('gc') }
    expect(mapa['']).toBeUndefined()
    expect(Object.keys(mapa).every(k => k.length === 36)).toBe(true)
  })

  it('el flag de volcado concuerda con el id', () => {
    expect(GUARDIA_CIVIL_VOLCADA).toBe(true)
    expect(GUARDIA_CIVIL_VOLCADA).toBe(Boolean(ID_GUARDIA_CIVIL))
  })
})
