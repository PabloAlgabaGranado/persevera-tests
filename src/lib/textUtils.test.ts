// Copiado de Persevera (src/lib/textUtils.test.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

import { describe, it, expect } from 'vitest'
import { dividirEnParrafos } from './textUtils'

// Los enunciados de supuestos del Administrativo llegan de Supabase como un bloque
// de ~1.600 caracteres sin un solo salto: es esta función la que los hace legibles.
// La misma regla vive en PERSEVERA-LIBROS/comun/parrafos.py para los libros.

describe('dividirEnParrafos · saltos que ya trae el texto', () => {
  it('respeta el doble salto', () => {
    expect(dividirEnParrafos('Uno.\n\nDos.')).toEqual(['Uno.', 'Dos.'])
  })

  it('respeta el salto simple, que en los casos de Hacienda separa hechos', () => {
    expect(dividirEnParrafos('HECHO PRIMERO\nEl Ayuntamiento aprueba.')).toEqual(
      ['HECHO PRIMERO', 'El Ayuntamiento aprueba.'])
  })

  it('un texto vacío no da párrafos', () => {
    expect(dividirEnParrafos('   ')).toEqual([])
  })
})

describe('dividirEnParrafos · texto monolítico', () => {
  it('no parte por el punto de una abreviatura', () => {
    // El caso real que lo destapó: salía un párrafo empezando por «A. cuyo objeto…».
    const t = 'En el Ministerio se tramita la adjudicación de un contrato con la empresa '
      + 'TechServ S.A. cuyo objeto es el mantenimiento preventivo de los equipos informáticos '
      + 'de las Oficinas de Asistencia en Materia de Registro, con un valor estimado de 25.000 euros. '
      + 'En la Delegación presta servicios D. Andrés Prieto, funcionario de carrera.'
    const parrafos = dividirEnParrafos(t)
    expect(parrafos.some(p => /^A\.\s/.test(p))).toBe(false)
    expect(parrafos.some(p => p.includes('TechServ S.A. cuyo objeto'))).toBe(true)
  })

  it('tampoco parte por «art.» ni por una inicial', () => {
    const t = 'El interesado invoca el art. 21 de la Ley 39/2015 para pedir la caducidad, '
      + 'y el órgano instructor lo rechaza. Contra esa decisión cabe recurso.'
    expect(dividirEnParrafos(t).some(p => /^(21|Andrés)/.test(p))).toBe(false)
  })

  it('corta cuando una oración empieza por un marcador discursivo', () => {
    const t = 'El funcionario presenta su solicitud el 3 de marzo. Sin embargo, la Administración '
      + 'no resuelve en plazo.'
    expect(dividirEnParrafos(t)).toEqual([
      'El funcionario presenta su solicitud el 3 de marzo.',
      'Sin embargo, la Administración no resuelve en plazo.',
    ])
  })

  it('agrupa oraciones cortas y corta al pasar de ~280 caracteres', () => {
    const frase = 'La unidad tramita el expediente conforme a lo previsto en la norma aplicable. '
    const parrafos = dividirEnParrafos(frase.repeat(6).trim())
    expect(parrafos.length).toBeGreaterThan(1)
    for (const p of parrafos) expect(p.length).toBeLessThan(400)
  })

  it('una sola oración se queda entera', () => {
    expect(dividirEnParrafos('Una única frase sin más.')).toEqual(['Una única frase sin más.'])
  })

  it('no pierde ni una palabra al partir', () => {
    const t = 'Doña Clara presenta una solicitud ante la Confederación. Tras recibir el informe, '
      + 'el organismo inicia un procedimiento. El interesado alega indefensión.'
    expect(dividirEnParrafos(t).join(' ')).toBe(t)
  })
})

describe('dividirEnParrafos · apartados enumerados en línea', () => {
  it('saca cada apartado a su propio párrafo', () => {
    // Van separados por punto y coma, así que sin esta regla son UNA oración
    // larguísima y el lector se come los cuatro de corrido.
    const t = 'En el ámbito del Ministerio se producen las siguientes situaciones: '
      + '(a) La Subdirección necesita contratar el mantenimiento del sistema ERP; '
      + '(b) La Secretaría General Técnica detecta que el crédito es insuficiente; '
      + '(c) El Servicio de Habilitación debe gestionar el pago de dietas.'
    const parrafos = dividirEnParrafos(t)
    expect(parrafos[0]).toBe('En el ámbito del Ministerio se producen las siguientes situaciones:')
    expect(parrafos.filter(p => /^\([abc]\)/.test(p))).toHaveLength(3)
  })

  it('un paréntesis que no es un apartado no abre párrafo', () => {
    const t = 'El contrato tiene un valor estimado de 25.000 euros (IVA excluido) y un plazo de doce meses.'
    expect(dividirEnParrafos(t)).toEqual([t])
  })
})
