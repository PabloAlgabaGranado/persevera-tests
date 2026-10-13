// Copiado de Persevera (scripts/comprobar-tamano-dist.mjs) el 13-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual; lo que cuenta el comentario de abajo pasó en Persevera.

// ─────────────────────────────────────────────────────────────────────────────
// Guardián del tope de Cloudflare Pages.
//
// Cloudflare Pages rechaza el despliegue si UN FICHERO pasa de 25 MiB. No es
// hipotético: el 3-sep-2026 el paquete lo cruzó y la app se quedó sin poder
// desplegarse (ver `src/components/Cursos/catalogo.tsx`). El aviso llegaba de
// Cloudflare, o sea después de haber intentado desplegar.
//
// Esto lo dice antes, en `npm run build`:
//   · a partir de 15 MiB avisa,
//   · a partir de 22 MiB FALLA. Se elige 22 y no 25 para dejar margen: un
//     fichero a 24 MiB pasa hoy y te tira el despliegue la semana que viene con
//     el siguiente lote de contenido.
//
// El peso siempre viene del CONTENIDO importado a nivel de módulo —bancos de
// casos, de preguntas, de psicotécnicos—, nunca del código. Cuando esto salte,
// lo que hay que buscar es un `import` estático de un banco gordo, no una
// optimización de JavaScript.
// ─────────────────────────────────────────────────────────────────────────────
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MiB = 1024 * 1024
const AVISA = 15 * MiB
const FALLA = 22 * MiB
const TOPE = 25 * MiB
const DIR = 'dist/assets'

const mib = n => (n / MiB).toFixed(2) + ' MiB'

let ficheros
try {
  ficheros = readdirSync(DIR).map(n => ({ n, b: statSync(join(DIR, n)).size }))
} catch {
  console.error(`\n  ⚠️  No existe ${DIR}. ¿Se ha ejecutado antes «vite build»?\n`)
  process.exit(1)
}

const gordos = ficheros.filter(f => f.b >= AVISA).sort((a, b) => b.b - a.b)
if (gordos.length === 0) {
  const mayor = ficheros.sort((a, b) => b.b - a.b)[0]
  if (mayor) console.log(`  tope Cloudflare: mayor fichero ${mib(mayor.b)} (${(mayor.b / TOPE * 100).toFixed(1)} % de 25 MiB) ✓`)
  process.exit(0)
}

const rompe = gordos.filter(f => f.b >= FALLA)
console.error(`\n  ${rompe.length ? '❌' : '⚠️ '}  Cloudflare Pages rechaza cualquier fichero de más de 25 MiB.\n`)
for (const f of gordos) {
  console.error(`      ${f.b >= FALLA ? '❌' : '⚠️ '} ${mib(f.b).padStart(10)}  ${(f.b / TOPE * 100).toFixed(1).padStart(5)} %  ${f.n}`)
}
console.error(`\n      Lo que pesa es siempre CONTENIDO importado a nivel de módulo.`)
console.error(`      Busca un import estático de un banco gordo, no una optimización de código.\n`)
process.exit(rompe.length ? 1 : 0)
