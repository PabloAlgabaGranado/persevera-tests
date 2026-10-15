// Copiado de Persevera (src/lib/contextoTest.test.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

import { describe, it, expect, vi } from 'vitest'

// La regla es pura; el cliente de Supabase solo lo usa la carga del temario.
vi.mock('./supabase', () => ({ supabase: {} }))

import { contextoDelTest, type EleccionTest, type PreguntaConTema, type TemarioOposicion } from './contextoTest'

// ─────────────────────────────────────────────────────────────────────────────
// Qué bloque y qué tema se guardan al terminar un test. El caso de fondo: el
// Auxiliar comparte por epígrafe las preguntas del Administrativo, así que sus
// preguntas traen temas y bloques del Administrativo. Antes se guardaba ese bloque
// ajeno y las barras de bloque del Auxiliar salían siempre «sin datos».
// ─────────────────────────────────────────────────────────────────────────────

// Temario del Auxiliar: B1 (temas 1 y 2) y B2 (tema 3). El epígrafe «ce-1» (la
// Constitución) está en el tema 1 del Auxiliar y en el tema 1 del Administrativo.
const AUX: TemarioOposicion = {
  bloqueDeTema: new Map([['aux-t1', 'aux-b1'], ['aux-t2', 'aux-b1'], ['aux-t3', 'aux-b2']]),
  temasDeEpigrafe: new Map([
    ['ce-1', ['aux-t1']], ['ce-2', ['aux-t1']],
    ['lpac-1', ['aux-t2']],
    ['ofi-1', ['aux-t3']],
  ]),
}

/** Pregunta escrita para el Administrativo (tema y bloque del Administrativo). */
const prestada = (tema = 'adm-t1', bloque = 'adm-b1'): PreguntaConTema => ({ temas: { id: tema, bloques: { id: bloque } } })
const propia = (tema: string, bloque: string): PreguntaConTema => ({ temas: { id: tema, bloques: { id: bloque } } })

const cfg = (c: Partial<EleccionTest>): EleccionTest => ({
  modo: 'practica', contenido: 'todo', bloquesSeleccionados: [], temasSeleccionados: [], epigrafeIds: [], ...c,
})

describe('el bloque elegido manda', () => {
  it('Auxiliar, «Por bloque» B1 con preguntas prestadas del Administrativo → su B1', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_bloque', bloquesSeleccionados: ['aux-b1'] }), [prestada(), prestada()], AUX)
    expect(r.bloqueId).toBe('aux-b1')
  })

  it('Administrativo, «Por bloque» con alguna pregunta prestada de otra oposición → el bloque elegido (antes: null por mezcla)', () => {
    const ADM: TemarioOposicion = { bloqueDeTema: new Map([['adm-t1', 'adm-b1'], ['adm-t9', 'adm-b2']]), temasDeEpigrafe: new Map() }
    const r = contextoDelTest(cfg({ contenido: 'por_bloque', bloquesSeleccionados: ['adm-b1'] }),
      [propia('adm-t1', 'adm-b1'), prestada('ss-t4', 'ss-b1')], ADM)
    expect(r.bloqueId).toBe('adm-b1')
  })

  it('dos bloques elegidos → no se escoge uno: cae al deducido, que aquí es ajeno → null', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_bloque', bloquesSeleccionados: ['aux-b1', 'aux-b2'] }), [prestada()], AUX)
    expect(r.bloqueId).toBeNull()
  })

  it('en «Mis fallos» también vale la elección', () => {
    const r = contextoDelTest(cfg({ modo: 'mis_fallos', contenido: 'por_bloque', bloquesSeleccionados: ['aux-b2'] }), [prestada('adm-t20', 'adm-b5')], AUX)
    expect(r.bloqueId).toBe('aux-b2')
  })
})

describe('los temas y epígrafes elegidos dan su bloque', () => {
  it('un tema (y la muestra gratuita, que es el tema 1 forzado) → ese tema y su bloque', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_tema', temasSeleccionados: ['aux-t1'] }), [prestada(), prestada()], AUX)
    expect(r).toEqual({ bloqueId: 'aux-b1', temaId: 'aux-t1' })
  })

  it('varios temas del mismo bloque (Consolidación del plan) → el bloque; el tema no se inventa', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_tema', temasSeleccionados: ['aux-t1', 'aux-t2'] }),
      [prestada('adm-t1'), prestada('adm-t4')], AUX)
    expect(r).toEqual({ bloqueId: 'aux-b1', temaId: null })
  })

  it('temas de bloques distintos → ni bloque ni tema elegidos', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_tema', temasSeleccionados: ['aux-t1', 'aux-t3'] }),
      [prestada('adm-t1', 'adm-b1'), prestada('adm-t20', 'adm-b5')], AUX)
    expect(r).toEqual({ bloqueId: null, temaId: null })
  })

  it('test del plan acotado a lo leído: llega como «Todo» con epígrafes de UN tema → su tema y su bloque', () => {
    const r = contextoDelTest(cfg({ contenido: 'todo', epigrafeIds: ['ce-1', 'ce-2'] }), [prestada(), prestada()], AUX)
    expect(r).toEqual({ bloqueId: 'aux-b1', temaId: 'aux-t1' })
  })

  it('epígrafes sueltos de dos temas del mismo bloque → el bloque, sin tema', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_tema', epigrafeIds: ['ce-1', 'lpac-1'] }), [prestada('adm-t1'), prestada('adm-t4')], AUX)
    expect(r).toEqual({ bloqueId: 'aux-b1', temaId: null })
  })

  it('un tema entero + epígrafes de otro tema → no es «un tema»: el test no es entero de ese tema', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_tema', temasSeleccionados: ['aux-t1'], epigrafeIds: ['ofi-1'] }),
      [prestada('adm-t1', 'adm-b1'), prestada('adm-t20', 'adm-b5')], AUX)
    expect(r).toEqual({ bloqueId: null, temaId: null })
  })

  it('un epígrafe que su oposición pone en dos temas de bloques distintos → no se adivina el bloque', () => {
    const DOBLE: TemarioOposicion = { ...AUX, temasDeEpigrafe: new Map([['ce-1', ['aux-t1', 'aux-t3']]]) }
    const r = contextoDelTest(cfg({ contenido: 'todo', epigrafeIds: ['ce-1'] }), [prestada()], DOBLE)
    expect(r).toEqual({ bloqueId: null, temaId: 'adm-t1' })
  })
})

describe('sin elección: el deducido solo si es de su oposición', () => {
  it('todas las preguntas de un bloque AJENO → null, nunca el ajeno', () => {
    const r = contextoDelTest(cfg({}), [prestada(), prestada()], AUX)
    expect(r.bloqueId).toBeNull()
  })

  it('todas de un bloque PROPIO → ese (Guardia Civil y el Administrativo, igual que antes)', () => {
    const r = contextoDelTest(cfg({}), [propia('aux-t3', 'aux-b2'), propia('aux-t3', 'aux-b2')], AUX)
    expect(r).toEqual({ bloqueId: 'aux-b2', temaId: 'aux-t3' })
  })

  it('mezcladas → null', () => {
    const r = contextoDelTest(cfg({}), [propia('aux-t1', 'aux-b1'), propia('aux-t3', 'aux-b2')], AUX)
    expect(r).toEqual({ bloqueId: null, temaId: null })
  })

  it('el tema deducido sigue como siempre, aunque sea ajeno (lo filtra después fetchTemasDebiles)', () => {
    const r = contextoDelTest(cfg({}), [prestada('adm-t1'), prestada('adm-t1')], AUX)
    expect(r.temaId).toBe('adm-t1')
  })
})

describe('solo cuenta lo que el selector de verdad aplicó', () => {
  it('«Examen real» con un bloque marcado de antes → el examen oficial no se atribuye a ese bloque', () => {
    const r = contextoDelTest(cfg({ modo: 'examen_real', contenido: 'por_bloque', bloquesSeleccionados: ['aux-b1'] }),
      [propia('aux-t1', 'aux-b1'), propia('aux-t3', 'aux-b2')], AUX)
    expect(r.bloqueId).toBeNull()
  })

  it('«Examen real» con un tema marcado de antes → tampoco fija el tema', () => {
    const r = contextoDelTest(cfg({ modo: 'examen_real', contenido: 'por_tema', temasSeleccionados: ['aux-t1'] }),
      [propia('aux-t1', 'aux-b1'), propia('aux-t3', 'aux-b2')], AUX)
    expect(r).toEqual({ bloqueId: null, temaId: null })
  })

  it('bloques en `config` con «Todo» no filtran nada → no cuentan', () => {
    const r = contextoDelTest(cfg({ contenido: 'todo', bloquesSeleccionados: ['aux-b1'] }), [prestada()], AUX)
    expect(r.bloqueId).toBeNull()
  })

  it('un bloque que no es de su oposición no se guarda aunque venga elegido', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_bloque', bloquesSeleccionados: ['adm-b1'] }), [prestada()], AUX)
    expect(r.bloqueId).toBeNull()
  })
})

describe('sin temario (fallo de red)', () => {
  const VACIO: TemarioOposicion = { bloqueDeTema: new Map(), temasDeEpigrafe: new Map() }
  it('el bloque queda null y el tema elegido se conserva, como antes del cambio', () => {
    const r = contextoDelTest(cfg({ contenido: 'por_tema', temasSeleccionados: ['aux-t1'] }), [prestada()], VACIO)
    expect(r).toEqual({ bloqueId: null, temaId: 'aux-t1' })
  })
})
