// Copiado de Persevera (src/lib/desgloseTest.test.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

import { describe, it, expect, beforeEach, vi } from 'vitest'

// ─────────────────────────────────────────────────────────────────────────────
// El desglose de la pantalla de resultados de un test. Dos casos de fondo:
//   - `temas.numero` se reinicia en cada bloque, así que un test con preguntas de
//     dos bloques trae dos «tema 1». Las filas se pintaban con la clave
//     `t-${numero}` y React avisaba de claves repetidas (27-sep-2026).
//   - El banco se comparte por epígrafe: una pregunta del Auxiliar trae el tema y
//     el bloque del Administrativo, para el que se escribió. Ahora cuenta en los
//     suyos.
// ─────────────────────────────────────────────────────────────────────────────

const nube = {
  // Cada consulta: tabla, columnas y filtros (eq / in) con sus valores.
  consultas: [] as Array<{ tabla: string; columnas: string; filtros: Array<[string, string, unknown]> }>,
  porTabla:  {} as Record<string, unknown[]>,
  caida:     null as string | null,   // tabla cuya consulta devuelve error
}

vi.mock('./supabase', () => ({
  supabase: {
    from: (tabla: string) => {
      const c = { tabla, columnas: '', filtros: [] as Array<[string, string, unknown]> }
      const q = {
        select(columnas: string) { c.columnas = columnas; return q },
        eq(col: string, v: unknown) { c.filtros.push(['eq', col, v]); return q },
        in(col: string, v: unknown) { c.filtros.push(['in', col, v]); return q },
        then(ok: (r: unknown) => unknown, ko?: (e: unknown) => unknown) {
          nube.consultas.push(c)
          const r = nube.caida === tabla
            ? { data: null, error: { message: 'base caída' } }
            : { data: nube.porTabla[tabla] ?? [], error: null }
          return Promise.resolve(r).then(ok, ko)
        },
      }
      return q
    },
  },
}))

const { desgloseDelTest, rotuloTema, cargarTemarioDesglose, olvidarTemarios } = await import('./desgloseTest')
type TemarioDesglose = import('./desgloseTest').TemarioDesglose
type PreguntaDesglose = import('./desgloseTest').PreguntaDesglose

beforeEach(() => {
  nube.consultas = []
  nube.porTabla = {}
  nube.caida = null
  olvidarTemarios()
  vi.restoreAllMocks()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

/** Temario de mentira: temas `id → [bloque, número, título]`, bloques `id → [número, nombre]`. */
const temario = (
  temas: Record<string, [string, number | null, string]>,
  bloques: Record<string, [number | null, string]>,
  temasPropiosDe: Record<string, string[]> = {},
): TemarioDesglose => ({
  temas: new Map(Object.entries(temas).map(([id, [bloqueId, numero, titulo]]) => [id, { bloqueId, numero, titulo }])),
  bloques: new Map(Object.entries(bloques).map(([id, [numero, nombre]]) => [id, { numero, nombre }])),
  temasPropiosDe: new Map(Object.entries(temasPropiosDe)),
})

// Administrativo: dos «tema 1», uno en el bloque I y otro en el III.
const ADM = temario(
  {
    'adm-b1-t1': ['adm-b1', 1, 'La Constitución Española de 1978'],
    'adm-b1-t2': ['adm-b1', 2, 'La Corona'],
    'adm-b3-t1': ['adm-b3', 1, 'Las fuentes del derecho administrativo'],
  },
  { 'adm-b1': [1, 'I. Organización del Estado'], 'adm-b3': [3, 'III. Derecho administrativo general'] },
)

const del = (id: string, tema: string, epigrafe?: string | null): PreguntaDesglose =>
  epigrafe === undefined ? { id, temas: { id: tema } } : { id, temas: { id: tema }, epigrafe_id: epigrafe }

const bien = { correcta: true }, mal = { correcta: false }
const ids = (filas: { id: string }[]) => filas.map(f => f.id)

describe('dos temas con el mismo número en bloques distintos', () => {
  it('salen como dos filas, cada una con su id', () => {
    const d = desgloseDelTest([del('p1', 'adm-b1-t1'), del('p2', 'adm-b3-t1')], { 0: bien, 1: mal }, ADM)
    expect(d.temas.map(t => t.numero)).toEqual([1, 1])
    expect(ids(d.temas)).toEqual(['adm-b1-t1', 'adm-b3-t1'])
  })

  it('cada fila cuenta sus preguntas, no las del otro «tema 1»', () => {
    const ps = [del('p1', 'adm-b1-t1'), del('p2', 'adm-b3-t1'), del('p3', 'adm-b1-t1'), del('p4', 'adm-b3-t1'), del('p5', 'adm-b3-t1')]
    const [t1b1, t1b3] = desgloseDelTest(ps, { 0: bien, 1: bien, 2: mal, 4: mal }, ADM).temas
    expect(t1b1).toMatchObject({ id: 'adm-b1-t1', nombre: 'La Constitución Española de 1978', correctas: 1, total: 2 })
    expect(t1b3).toMatchObject({ id: 'adm-b3-t1', nombre: 'Las fuentes del derecho administrativo', correctas: 1, total: 3 })
  })
})

// Auxiliar: sus dos bloques. Sus preguntas prestadas traen temas del Administrativo.
const AUX_TEMAS: Record<string, [string, number, string]> = {
  'aux-b1-t1':  ['aux-b1', 1, 'La Constitución Española de 1978'],
  'aux-b1-t10': ['aux-b1', 10, 'La organización de la Unión Europea'],
  'aux-b2-t1':  ['aux-b2', 1, 'Atención al público'],
  'aux-b2-t9':  ['aux-b2', 9, 'Procesadores de texto'],
}
const AUX_BLOQUES: Record<string, [number, string]> = {
  'aux-b1': [1, 'I. Organización Pública'], 'aux-b2': [2, 'II. Actividad Administrativa y Ofimática'],
}

describe('⚠️ las preguntas prestadas cuentan en el temario del opositor', () => {
  it('una pregunta del bloque I del Administrativo cuenta en el bloque 1 del Auxiliar: un solo «Bloque 1»', () => {
    const t = temario(AUX_TEMAS, AUX_BLOQUES, { p2: ['aux-b1-t1'] })
    const d = desgloseDelTest([del('p1', 'aux-b1-t1'), del('p2', 'adm-b1-t1', 'ep-ce')], { 0: bien, 1: mal }, t)
    expect(d.bloques).toEqual([{ id: 'aux-b1', numero: 1, nombre: 'I. Organización Pública', correctas: 1, total: 2 }])
    expect(d.temas).toEqual([{ id: 'aux-b1-t1', numero: 1, nombre: 'La Constitución Española de 1978', bloqueNumero: 1, correctas: 1, total: 2 }])
  })

  it('nunca sale una fila de otra oposición, aunque la pregunta la traiga', () => {
    const t = temario(AUX_TEMAS, AUX_BLOQUES, { p1: ['aux-b2-t9'] })
    const d = desgloseDelTest([del('p1', 'adm-b6-t4', 'ep-word')], { 0: bien }, t)
    expect(ids(d.bloques)).toEqual(['aux-b2'])
    expect(ids(d.temas)).toEqual(['aux-b2-t9'])
  })

  it('su epígrafe en varios temas suyos del mismo bloque → cuenta en el bloque, en ningún tema', () => {
    const t = temario(AUX_TEMAS, AUX_BLOQUES, { p1: ['aux-b2-t1', 'aux-b2-t9'] })
    const d = desgloseDelTest([del('p1', 'adm-b3-t2', 'ep-lpac')], { 0: bien }, t)
    expect(d.bloques).toEqual([{ id: 'aux-b2', numero: 2, nombre: 'II. Actividad Administrativa y Ofimática', correctas: 1, total: 1 }])
    expect(d.temas).toEqual([])
  })

  it('en temas suyos de bloques distintos, o en ninguno → no cuenta en ninguna fila', () => {
    const t = temario(AUX_TEMAS, AUX_BLOQUES, { p1: ['aux-b1-t1', 'aux-b2-t1'], p2: [] })
    const d = desgloseDelTest([del('p1', 'adm-b1-t1', 'ep-x'), del('p2', 'adm-b5-t2', 'ep-presu'), del('p3', 'adm-b1-t1')], {}, t)
    expect(d).toEqual({ bloques: [], temas: [] })
  })

  it('un tema que no es de su temario se descarta aunque venga en la lista', () => {
    const t = temario(AUX_TEMAS, AUX_BLOQUES, { p1: ['adm-b1-t1', 'aux-b1-t1', 'aux-b1-t1'] })
    const d = desgloseDelTest([del('p1', 'adm-b1-t1', 'ep-ce')], { 0: bien }, t)
    expect(ids(d.temas)).toEqual(['aux-b1-t1'])
  })

  it('la pregunta con tema propio va a su tema, diga lo que diga su epígrafe', () => {
    const t = temario(AUX_TEMAS, AUX_BLOQUES, { p1: ['aux-b2-t9'] })
    const d = desgloseDelTest([del('p1', 'aux-b1-t10', 'ep-ue')], { 0: bien }, t)
    expect(ids(d.temas)).toEqual(['aux-b1-t10'])
  })
})

describe('orden y rótulo de los temas (decidido con Álvaro el 27-sep-2026)', () => {
  const ps = [del('p1', 'adm-b1-t1'), del('p2', 'adm-b3-t1'), del('p3', 'adm-b1-t2')]

  it('los temas van por bloque y luego por número: los «tema 1» ya no se intercalan', () => {
    // Antes, por número a secas: tema 1 (B1), tema 1 (B3), tema 2 (B1).
    expect(ids(desgloseDelTest(ps, {}, ADM).temas)).toEqual(['adm-b1-t1', 'adm-b1-t2', 'adm-b3-t1'])
  })

  it('con varios bloques, «Bloque 3, tema 1»; con uno, «Tema 1»', () => {
    const d = desgloseDelTest(ps, {}, ADM)
    expect(d.temas.map(t => rotuloTema(t, true))).toEqual(['Bloque 1, tema 1', 'Bloque 1, tema 2', 'Bloque 3, tema 1'])
    expect(d.temas.map(t => rotuloTema(t, false))).toEqual(['Tema 1', 'Tema 2', 'Tema 1'])
  })

  it('sin número, «?», como antes', () => {
    expect(rotuloTema({ id: 'x', nombre: '', correctas: 0, total: 1 }, true)).toBe('Bloque ?, tema ?')
    expect(rotuloTema({ id: 'x', nombre: '', correctas: 0, total: 1 }, false)).toBe('Tema ?')
  })

  it('lo que no tiene número va al final', () => {
    const t = temario(
      { 'adm-b1-t1': ['adm-b1', 1, 'La Constitución'], 'adm-b1-t2': ['adm-b1', 2, 'La Corona'], 'adm-b3-t1': ['adm-b3', 1, 'Las fuentes'], x: ['bx', null, 'Sin número'] },
      { 'adm-b1': [1, 'I'], 'adm-b3': [3, 'III'], bx: [null, ''] },
    )
    const d = desgloseDelTest([del('p0', 'x'), del('p1', 'adm-b1-t2'), del('p2', 'adm-b3-t1'), del('p3', 'adm-b1-t1')], {}, t)
    expect(ids(d.temas)).toEqual(['adm-b1-t1', 'adm-b1-t2', 'adm-b3-t1', 'x'])
    expect(ids(d.bloques)).toEqual(['adm-b1', 'adm-b3', 'bx'])
  })
})

describe('recuento (lo de siempre)', () => {
  it('en blanco suma al total y no a los aciertos; el fallo, igual', () => {
    const d = desgloseDelTest([del('p1', 'adm-b1-t1'), del('p2', 'adm-b1-t1'), del('p3', 'adm-b1-t1')], { 0: bien, 1: mal }, ADM)
    expect(d.temas).toEqual([{ id: 'adm-b1-t1', numero: 1, nombre: 'La Constitución Española de 1978', bloqueNumero: 1, correctas: 1, total: 3 }])
    expect(d.bloques).toEqual([{ id: 'adm-b1', numero: 1, nombre: 'I. Organización del Estado', correctas: 1, total: 3 }])
  })

  it('una pregunta sin tema ni id no cuenta en ninguna fila', () => {
    const d = desgloseDelTest([{ temas: null }, {}, del('p3', 'adm-b1-t1')], { 0: bien, 1: bien, 2: bien }, ADM)
    expect(d.temas).toHaveLength(1)
    expect(d.temas[0]).toMatchObject({ correctas: 1, total: 1 })
    expect(d.bloques[0]).toMatchObject({ correctas: 1, total: 1 })
  })
})

// ── La carga ────────────────────────────────────────────────────────────────

/** Temas del Auxiliar tal como los devuelve la consulta (con su bloque embebido). */
const TEMAS_AUX_BD = Object.entries(AUX_TEMAS).map(([id, [bloque, numero, titulo]]) => ({
  id, numero, titulo, bloque_id: bloque,
  bloques: { id: bloque, numero: AUX_BLOQUES[bloque][0], nombre: AUX_BLOQUES[bloque][1], oposicion_id: 'aux' },
}))
const tablas = () => nube.consultas.map(c => c.tabla)
const filtro = (tabla: string, col: string) => nube.consultas.find(c => c.tabla === tabla)?.filtros.find(f => f[1] === col)?.[2]

describe('cargarTemarioDesglose', () => {
  it('pide el temario de SU oposición, con sus bloques', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD
    const t = await cargarTemarioDesglose('aux', [del('p1', 'aux-b1-t1')])
    expect(nube.consultas[0].columnas).toMatch(/bloques!inner\(id, numero, nombre, oposicion_id\)/)
    expect(filtro('temas', 'bloques.oposicion_id')).toBe('aux')
    expect(t?.temas.get('aux-b2-t9')).toEqual({ numero: 9, titulo: 'Procesadores de texto', bloqueId: 'aux-b2' })
    expect(t?.bloques.get('aux-b2')).toEqual({ numero: 2, nombre: 'II. Actividad Administrativa y Ofimática' })
  })

  it('el bloque embebido vale como objeto (PostgREST) o como lista', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD.map(t => ({ ...t, bloques: [t.bloques] }))
    const t = await cargarTemarioDesglose('aux', [])
    expect(t?.bloques.get('aux-b1')).toEqual({ numero: 1, nombre: 'I. Organización Pública' })
  })

  it('si todas las preguntas son de su temario (el Administrativo, Guardia Civil) no pide nada más', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD
    const t = await cargarTemarioDesglose('aux', [del('p1', 'aux-b1-t1', null), del('p2', 'aux-b2-t9')])
    expect(tablas()).toEqual(['temas'])
    expect(t?.temasPropiosDe.size).toBe(0)
  })

  it('el temario se pide una vez por oposición', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD
    await cargarTemarioDesglose('aux', [del('p1', 'aux-b1-t1')])
    await cargarTemarioDesglose('aux', [del('p2', 'aux-b2-t1')])
    expect(tablas()).toEqual(['temas'])
  })

  it('las prestadas van por su epígrafe, a los temas de SU oposición que lo incluyen', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD
    nube.porTabla.tema_epigrafe = [
      { tema_id: 'aux-b1-t1', epigrafe_id: 'ep-ce' },
      { tema_id: 'adm-b1-t1', epigrafe_id: 'ep-ce' },   // del Administrativo: se descarta
      { tema_id: 'aux-b2-t1', epigrafe_id: 'ep-lpac' },
      { tema_id: 'aux-b2-t9', epigrafe_id: 'ep-lpac' },
    ]
    const t = await cargarTemarioDesglose('aux', [
      del('p1', 'adm-b1-t1', 'ep-ce'), del('p2', 'adm-b1-t1', 'ep-ce'), del('p3', 'adm-b3-t2', 'ep-lpac'), del('p4', 'aux-b1-t10', 'ep-ue'),
    ])
    expect(tablas()).toEqual(['temas', 'tema_epigrafe'])        // ni una a `preguntas`: ya traían el epígrafe
    expect(filtro('tema_epigrafe', 'epigrafe_id')).toEqual(['ep-ce', 'ep-lpac'])
    expect(filtro('tema_epigrafe', 'tema_id')).toEqual(Object.keys(AUX_TEMAS))
    expect(Object.fromEntries(t?.temasPropiosDe ?? [])).toEqual({ p1: ['aux-b1-t1'], p2: ['aux-b1-t1'], p3: ['aux-b2-t1', 'aux-b2-t9'] })
  })

  it('si la fuente del test no pidió `epigrafe_id`, se lee aparte, y solo el de las prestadas', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD
    nube.porTabla.preguntas = [{ id: 'p2', epigrafe_id: 'ep-ce' }]
    nube.porTabla.tema_epigrafe = [{ tema_id: 'aux-b1-t1', epigrafe_id: 'ep-ce' }]
    const t = await cargarTemarioDesglose('aux', [del('p1', 'aux-b1-t1'), del('p2', 'adm-b1-t3')])
    expect(tablas()).toEqual(['temas', 'preguntas', 'tema_epigrafe'])
    expect(filtro('preguntas', 'id')).toEqual(['p2'])
    expect(t?.temasPropiosDe.get('p2')).toEqual(['aux-b1-t1'])
  })

  it('una prestada que no tiene epígrafe (null) no se busca: no cuenta en ninguna fila', async () => {
    nube.porTabla.temas = TEMAS_AUX_BD
    const t = await cargarTemarioDesglose('aux', [del('p1', 'adm-b1-t1', null)])
    expect(tablas()).toEqual(['temas'])
    expect(t && desgloseDelTest([del('p1', 'adm-b1-t1', null)], { 0: bien }, t)).toEqual({ bloques: [], temas: [] })
  })

  it.each(['temas', 'preguntas', 'tema_epigrafe'])('con la base caída en «%s», null y sin lanzar', async tabla => {
    nube.porTabla.temas = TEMAS_AUX_BD
    nube.caida = tabla
    await expect(cargarTemarioDesglose('aux', [del('p1', 'adm-b1-t1', 'ep-ce'), del('p2', 'adm-b1-t3')])).resolves.toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })

  it('un temario vacío da null y no se guarda: la próxima vez se vuelve a pedir', async () => {
    expect(await cargarTemarioDesglose('aux', [del('p1', 'aux-b1-t1')])).toBeNull()
    nube.porTabla.temas = TEMAS_AUX_BD
    expect(await cargarTemarioDesglose('aux', [del('p1', 'aux-b1-t1')])).not.toBeNull()
    expect(tablas()).toEqual(['temas', 'temas'])
  })
})
