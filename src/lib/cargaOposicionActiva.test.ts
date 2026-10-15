// La carga de la oposición de la cuenta (T3), con una base de mentira. Sigue la
// prueba de Persevera (src/lib/cargaOposicionActiva.test.ts, claude/dia-d en
// 54e448e), con las tablas de Tests: catalogo_tests y eleccion_oposicion.
import { describe, it, expect, vi } from 'vitest'
vi.mock('./supabase', () => ({ supabase: {} }))
import { cargarCatalogoYEleccion, estadoTrasCarga, fichaActiva, SIN_OPOSICION } from './cargaOposicionActiva'
import { ID_ADMINISTRATIVO, ID_HACIENDA } from './oposicionesIds'
import type { supabase } from './supabase'

// Cada tabla responde lo que se le diga, con el mismo encadenado que
// supabase-js (select → is → order; select → eq → eq → maybeSingle), y apunta
// las tablas que se leen.
type Resp = { data: unknown; error: { message: string } | null }
function cliente(tablas: Record<string, Resp>) {
  const leidas: string[] = []
  const consulta = (t: string) => {
    leidas.push(t)
    const r = tablas[t] ?? { data: null, error: { message: `la tabla ${t} no está en la prueba` } }
    const q: Record<string, unknown> = {}
    q.select = () => q; q.eq = () => q; q.is = () => q
    q.order = async () => r; q.maybeSingle = async () => r
    return q
  }
  return { c: { from: consulta } as unknown as typeof supabase, leidas }
}

const AGENTE = { id: ID_HACIENDA, slug: 'agente_hacienda_libre', nombre: 'Agentes de la Hacienda Pública — Ingreso Libre', nombre_corto: 'Agente de Hacienda', organismo: 'AEAT' }
const ADMIN = { id: ID_ADMINISTRATIVO, slug: 'c1_age_libre', nombre: 'Cuerpo General Administrativo de la Administración del Estado — Ingreso Libre', nombre_corto: 'Administrativo del Estado', organismo: 'AGE' }
// PostgREST trae la oposición embebida en cada fila del catálogo, en su orden.
const CATALOGO = { data: [{ orden: 1, oposiciones: ADMIN }, { orden: 2, oposiciones: AGENTE }], error: null }
const SIN_RED = { data: null, error: { message: 'Failed to fetch' } }

describe('la carga de la oposición', () => {
  it('con red: el catálogo de Tests en su orden y la elegida, con su ficha', async () => {
    const { c } = cliente({
      catalogo_tests: CATALOGO,
      eleccion_oposicion: { data: { oposicion_id: ID_HACIENDA, oposiciones: { ...AGENTE, grupo: 'C1' } }, error: null },
    })
    expect(await cargarCatalogoYEleccion('u', c)).toEqual({ catalogo: [ADMIN, AGENTE], elegidaId: ID_HACIENDA, elegida: { ...AGENTE, grupo: 'C1' } })
  })

  it('sin elección: elegida null, y la carga vale', async () => {
    const { c } = cliente({ catalogo_tests: CATALOGO, eleccion_oposicion: { data: null, error: null } })
    expect(await cargarCatalogoYEleccion('u', c)).toEqual({ catalogo: [ADMIN, AGENTE], elegidaId: null, elegida: null })
  })

  it('una elegida que ya no está en el catálogo sigue siendo la suya', async () => {
    const { c } = cliente({
      catalogo_tests: { data: [{ orden: 1, oposiciones: ADMIN }], error: null },
      eleccion_oposicion: { data: { oposicion_id: ID_HACIENDA, oposiciones: AGENTE }, error: null },
    })
    expect((await cargarCatalogoYEleccion('u', c))?.elegida?.id).toBe(ID_HACIENDA)
  })

  it('si la ficha no se puede leer (retirada), la elección sigue ahí, sin ficha', async () => {
    const { c } = cliente({
      catalogo_tests: CATALOGO,
      eleccion_oposicion: { data: { oposicion_id: 'otra', oposiciones: null }, error: null },
    })
    expect(await cargarCatalogoYEleccion('u', c)).toEqual({ catalogo: [ADMIN, AGENTE], elegidaId: 'otra', elegida: null })
  })

  it('sin red en el catálogo: null (no «catálogo vacío»), para reintentar', async () => {
    const { c } = cliente({ catalogo_tests: SIN_RED, eleccion_oposicion: { data: { oposicion_id: ID_HACIENDA, oposiciones: AGENTE }, error: null } })
    expect(await cargarCatalogoYEleccion('u', c)).toBeNull()
  })

  it('sin red en la elección: null (no «no ha elegido»), para reintentar', async () => {
    const { c } = cliente({ catalogo_tests: CATALOGO, eleccion_oposicion: SIN_RED })
    expect(await cargarCatalogoYEleccion('u', c)).toBeNull()
  })

  it('sin cuenta no se lee nada: anon no puede', async () => {
    const { c, leidas } = cliente({})
    expect(await cargarCatalogoYEleccion(null, c)).toEqual({ catalogo: [], elegidaId: null, elegida: null })
    expect(leidas).toEqual([])
  })

  it('nunca lee ni escribe el puntero de Persevera', async () => {
    const { c, leidas } = cliente({ catalogo_tests: CATALOGO, eleccion_oposicion: { data: null, error: null } })
    await cargarCatalogoYEleccion('u', c)
    expect(leidas).toEqual(['catalogo_tests', 'eleccion_oposicion'])
  })
})

describe('lo que queda tras la carga', () => {
  it('si la lectura falla, no hay oposición: ni el Administrativo ni ninguna', () => {
    const r = estadoTrasCarga(null)
    expect(r.estado).toBe('error')
    expect(r.oposicionActiva).toEqual(SIN_OPOSICION)
    expect(r.oposicionActiva.id).not.toBe(ID_ADMINISTRATIVO)
  })

  it('sin elección tampoco hay una por defecto', () => {
    const r = estadoTrasCarga({ catalogo: [ADMIN, AGENTE], elegidaId: null, elegida: null })
    expect(r.estado).toBe('sin_eleccion')
    expect(r.oposicionActiva).toEqual(SIN_OPOSICION)
    expect(r.catalogo).toEqual([ADMIN, AGENTE])
  })

  it('elegida y retirada: no está lista, porque el motor dejaría de filtrar', () => {
    const r = estadoTrasCarga({ catalogo: [ADMIN, AGENTE], elegidaId: 'otra', elegida: null })
    expect(r.estado).toBe('no_disponible')
    expect(r.oposicionActiva).toEqual(SIN_OPOSICION)
    expect(r.catalogo).toEqual([ADMIN, AGENTE])
  })

  it('con elección, su ficha con el nombre limpio y el corto', () => {
    const r = estadoTrasCarga({ catalogo: [ADMIN, AGENTE], elegidaId: ID_HACIENDA, elegida: { ...AGENTE, grupo: 'C1' } })
    expect(r.estado).toBe('lista')
    expect(r.oposicionActiva).toEqual({ id: ID_HACIENDA, nombreCuerpo: 'Agentes de la Hacienda Pública', nombreCorto: 'Agente de Hacienda', grupo: 'C1' })
  })

  it('sin nombre corto, el del cuerpo sin «Ingreso Libre»', () => {
    expect(fichaActiva({ ...ADMIN, nombre_corto: '' }).nombreCorto).toBe('Cuerpo General Administrativo de la Administración del Estado')
  })
})
