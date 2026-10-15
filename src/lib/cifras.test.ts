// Copiado de Persevera (src/lib/cifras.test.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Cambiado aquí: cuántos ficheros de src/ tiene que mirar como mínimo, de 100
// (el mínimo de Persevera) a 30. Tests tiene 32 al acabar T3; el número sube
// cuando crezca. Lo demás, tal cual.

// ─────────────────────────────────────────────────────────────────────────────
// GATE de los números escritos EN CRUDO dentro de un texto.
//
// LA CLASE QUE VIGILA, y por qué necesita un gate propio. Su hermano,
// `contabilidad/separadorMillar.test.ts`, saca las opciones de cada
// `Intl.NumberFormat` del código y comprueba qué pinta. Eso no sirve aquí:
// cuando el número se interpola directamente —`~${horas}h`, `{a.xp} XP`— NO HAY
// LLAMADA QUE INSPECCIONAR, así que aquel gate pasa en verde mientras la app
// enseña «~12000h». Es el punto ciego que él mismo documenta, y esto lo tapa.
//
// ⚠️ VA POR MAGNITUD, NO POR UNIDAD, y esa fue la lección. La primera versión
// buscaba un número pegado a «min», «h» o «XP», y no valía: la unidad no dice el
// tamaño. «min» sirve para los 3.360 de una semana con el deslizador al máximo y
// también para el «hace 45 min» de un sello de tiempo, así que marcaba diez
// sitios buenos por cada uno malo. Un gate con esa proporción se acaba
// desactivando, y entonces no vigila nada.
//
// Lo que sí lleva la información es el NOMBRE del dato, y por eso la lista de
// abajo son nombres. Sale del barrido que encontró los treinta sitios, donde
// cada techo se rastreó hasta su origen: `total_study_minutes` sube sin límite,
// `duracion_min` de una sesión no pasa de 90; `total_preguntas` es el histórico
// entero, `pendientes` son cientos.
//
// ⚠️ ES UN GATE DE REGRESIÓN, NO DE DESCUBRIMIENTO. Protege lo que ya se sabe
// grande; no encuentra lo que todavía no está en la lista. Una magnitud nueva
// hay que añadirla aquí a mano, y conviene saberlo en vez de creerse cubierto.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { miles, dosDecimales, hastaDosDecimales } from './cifras'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Magnitudes cuyo valor cruza el millar en uso normal. Cada una con su techo
 *  comprobado: las horas y los minutos acumulados no tienen tope; las sesiones
 *  del plan pasan de mil en un plan de un año con la disponibilidad por defecto;
 *  las palabras de un guion del cante rondan las 3.500. */
const MAGNITUDES = [
  'horasTotales', 'horasEstudiadas', 'minutosSemana', 'dueCount', 'totalHoy',
  'plan.stats.total_study_minutes', 'plan.stats.completed_sessions', 'plan.stats.total_sessions',
  'plan.minutos_esta_semana', 'plan.completed_steps', 'plan.total_steps',
  'stats.totalVistas', 'summary.total_preguntas', 's.total_preguntas',
  'summary.total_minutos', 'fuente.palabras_cuerpo',
]

function ficherosDe(dir: string): string[] {
  const salida: string[] = []
  const bajar = (d: string) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const ruta = join(d, f.name)
      if (f.isDirectory()) { if (!/^(node_modules|__dump)$/.test(f.name)) bajar(ruta); continue }
      if (/\.tsx?$/.test(f.name) && !/\.test\.tsx?$/.test(f.name)) salida.push(ruta)
    }
  }
  bajar(dir)
  return salida
}

interface Crudo { fichero: string; linea: number; magnitud: string; codigo: string }

function crudosDe(ruta: string): Crudo[] {
  const fichero = relative(RAIZ, ruta).split('\\').join('/')
  const fuera: Crudo[] = []
  for (const [n, linea] of readFileSync(ruta, 'utf8').split('\n').entries()) {
    // Solo las líneas que ESCRIBEN: una plantilla o un trozo de JSX. La misma
    // variable vive a la vez en un `if (horasTotales >= 1800)` y en un mensaje,
    // y solo el mensaje se pinta. Por eso se mira la línea entera y no la
    // interpolación suelta: es lo que distingue calcular de escribir.
    // Las cuatro formas que tiene una línea de ESCRIBIR un número: una
    // plantilla, una interpolación tras `>` o `(`, una que va seguida de texto,
    // y —la que se me pasó— una expresión JSX sola en su renglón, que es
    // justamente como se pinta un contador grande:
    //     {dueCount === null ? '—' : miles(dueCount)}
    // Sin la cuarta, el gate pasaba en verde con el defecto puesto. Lo cazó una
    // mutación, no la lectura.
    const escribe = linea.includes('${')
      || /[>(]\s*\{/.test(linea)
      || /\}\s*[<a-záéíóúñ]/.test(linea)
      || /^\s*\{.*\}\s*$/.test(linea)
    if (!escribe) continue
    // ⚠️ Vale CUALQUIER forma de agrupar, no solo `miles`. El hermano de este
    // gate mide el resultado y no la grafía, y aquí pasa igual: un
    // `toLocaleString('es-ES', { useGrouping: true })` escrito a mano agrupa
    // exactamente lo mismo. Exigir el ayudante sería exigir un estilo.
    if (linea.includes('miles(') || linea.includes('useGrouping')) continue
    // Comparar no es escribir: la misma variable decide un `if` y se pinta en
    // un mensaje. Pero hay que mirar TODAS sus apariciones de la línea, no la
    // primera: en `{dueCount === null ? '—' : dueCount}` la primera compara y
    // la segunda escribe, y quedarse en la primera daba la línea por buena.
    // Lo cazó una mutación; sin ella el gate habría pasado en verde con el
    // defecto puesto.
    const magnitud = MAGNITUDES.find(m => {
      for (let i = linea.indexOf(m); i >= 0; i = linea.indexOf(m, i + 1)) {
        const tras = linea.slice(i + m.length, i + m.length + 12)
        if (!/^\s*(===|!==|==|!=|>=|<=|>|<)/.test(tras)) return true
      }
      return false
    })
    if (!magnitud) continue
    fuera.push({ fichero, linea: n + 1, magnitud, codigo: linea.trim().slice(0, 110) })
  }
  return fuera
}

const TODOS = ficherosDe(join(RAIZ, 'src'))

describe('números en crudo dentro del texto', () => {
  it('miles() pone el punto donde toca y no donde no toca', () => {
    expect(miles(12000)).toBe('12.000')
    expect(miles(3402)).toBe('3.402')
    expect(miles(1000)).toBe('1.000')
    expect(miles(999)).toBe('999')     // por debajo del millar no hay nada que separar
    expect(miles(0)).toBe('0')
  })

  it('mira src/ entero, no un directorio vacío', () => {
    expect(TODOS.length).toBeGreaterThanOrEqual(30)
  })

  it('ninguna magnitud que pasa del millar se escribe sin miles()', () => {
    const rotos = TODOS.flatMap(crudosDe)
      .map(c => `${c.fichero}:${c.linea} (${c.magnitud}) → ${c.codigo}`)
    expect(rotos).toEqual([])
  })
})

describe('decimales con coma', () => {
  it('dosDecimales() escribe la nota como un tribunal: coma y siempre dos cifras', () => {
    expect(dosDecimales(60 - 40 / 3)).toBe('46,67')   // Guardia Civil: 60 aciertos y 40 fallos a −⅓
    expect(dosDecimales(70 - 30 / 4)).toBe('62,50')   // Hacienda: 70 aciertos y 30 fallos a −¼
    expect(dosDecimales(9)).toBe('9,00')
    expect(dosDecimales(0)).toBe('0,00')              // el «0.00 de 3» que se vio en pantalla
    expect(dosDecimales(1234.5)).toBe('1.234,50')
  })

  it('hastaDosDecimales() no deja ceros de más', () => {
    expect(hastaDosDecimales(1 / 5)).toBe('0,2')
    expect(hastaDosDecimales(1 / 2)).toBe('0,5')
    expect(hastaDosDecimales(1 / 3)).toBe('0,33')
    expect(hastaDosDecimales(1)).toBe('1')
  })
})
