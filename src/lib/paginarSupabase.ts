// Copiado de Persevera (src/lib/paginarSupabase.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

// ─────────────────────────────────────────────────────────────────────────────
// Leer TODAS las filas de una consulta a Supabase, sin quedarse en mil.
//
// LAS DOS TRAMPAS, encadenadas, y las dos dan números falsos sin avisar:
//
//   1. PostgREST CORTA EN 1.000 FILAS aunque no pidas límite. No hay error: la
//      respuesta llega con mil filas y pinta de completa. Un contador que sume
//      sobre eso se queda clavado en 1.000 para siempre.
//
//   2. ⚠️ PAGINAR SIN `order` ES INESTABLE. Sin un orden total, Postgres no
//      garantiza el mismo orden entre páginas, así que la paginación repite
//      filas y se salta otras — y cada ejecución da un resultado distinto.
//      Contando los exámenes oficiales de Auxiliar, tres ejecuciones del mismo
//      código dieron 450, 318 y 260, con 76 duplicados en una de ellas. Por eso
//      `orden` no es opcional aquí: es un parámetro obligatorio.
//
// ⚠️ Y LA TERCERA, que es de este repo: NO ROMPER EN SILENCIO. El helper que ya
// existía en `mindmapProgress.ts` corta el bucle con `if (error || !data) break`,
// así que un fallo de red devuelve una lista CORTA y el llamante la da por
// buena. Aquí el error se propaga: más vale una pantalla que falla que una
// pantalla que miente. Es la misma lección que dejó escrita `FlashcardsView`
// cuando le faltaban tarjetas del temario «y no había forma de enterarse».
//
// EL CONTRASTE ES LA PARTE QUE IMPORTA. Se pide primero el recuento al servidor
// y al final se comprueba contra lo traído. Sin ese assert no se puede afirmar
// ninguna cifra: la regla no es «paginar con order», es «no dar un número hasta
// haberlo contrastado».
// ─────────────────────────────────────────────────────────────────────────────
/** El tope duro de PostgREST. No es configurable desde el cliente. */
export const PAGINA = 1000

export interface Paginado<T> {
  filas: T[]
  /** Lo que dice el servidor que hay. Si no coincide con `filas.length`, la
   *  medición está mal y hay que desconfiar del número, no publicarlo. */
  total: number
}

/**
 * ⚠️ supabase-js NO devuelve instancias de `Error`: sin `.throwOnError()` —y en
 * este repo no hay ninguno— lo que trae en `error` es un objeto plano
 * `{message, details, hint, code}`. Relanzarlo tal cual rompía a todo el que
 * hiciera `e instanceof Error`, que es el patrón normal en los `catch` de este
 * código: el mensaje se perdía y quedaba un «desconocido». Se envuelve.
 */
function comoError(crudo: unknown, donde: string): Error {
  if (crudo instanceof Error) return crudo
  const m = crudo && typeof crudo === 'object' && 'message' in crudo
    ? String((crudo as { message: unknown }).message)
    : JSON.stringify(crudo)
  const e = new Error(`traerTodas: falló ${donde}: ${m}`)
  Object.assign(e, { causa: crudo })
  return e
}

/** Lo mínimo que devuelve supabase-js: nunca lanza, siempre trae `error`. */
type Respuesta<T> = PromiseLike<{ data: T[] | null; error: unknown }>
type Recuento = PromiseLike<{ count: number | null; error: unknown }>

/**
 * Trae todas las filas de una consulta, en páginas paralelas.
 *
 * ⚠️ Se piden DOS cierres y no un builder que reutilizar, por dos motivos. Uno,
 * que los builders de supabase-js acumulan modificadores y no se pueden usar
 * dos veces. Y dos, que la consulta del recuento y la de los datos piden cosas
 * distintas —`head: true` sin columnas frente a las columnas de verdad—, así
 * que fingir que son la misma llevaba a tipos imposibles. Escribir el filtro
 * dos veces es feo, pero es lo que hay y así se ve.
 *
 * @param contar  La misma consulta con `{ count: 'exact', head: true }`.
 * @param pagina  La consulta de datos, YA ORDENADA por un ORDEN TOTAL con esos
 *                filtros —una fila por valor—, con el rango que se le pasa.
 */
export async function traerTodas<T>(
  contar: () => Recuento,
  pagina: (desde: number, hasta: number) => Respuesta<T>,
): Promise<Paginado<T>> {
  const { count, error: errorCuenta } = await contar()
  if (errorCuenta) throw comoError(errorCuenta, 'el recuento')
  // ⚠️ `count === null` NO es lo mismo que `count === 0`. Null significa que el
  // servidor no ha dado recuento —RLS, un error blando, una vista sin
  // estadísticas—, y devolver «cero filas» ahí sería exactamente el fallo que
  // este módulo combate: una lista vacía que el llamante da por buena. Cero sí
  // es una respuesta legítima y se devuelve sin pedir ninguna página.
  if (count === null) throw new Error('traerTodas: el servidor no devolvió recuento; sin él no se sabe cuántas páginas pedir')
  if (count === 0) return { filas: [], total: 0 }

  const paginas = Math.ceil(count / PAGINA)
  const trozos = await Promise.all(
    Array.from({ length: paginas }, async (_, i) => {
      const { data, error } = await pagina(i * PAGINA, i * PAGINA + PAGINA - 1)
      // ⚠️ supabase-js NO lanza en error de red: devuelve `{ data: null, error }`.
      // Sin este throw, una página perdida deja la lista corta y el llamante
      // enseña un número que parece bueno.
      if (error) throw comoError(error, `la página ${i + 1} de ${paginas}`)
      return data ?? []
    }),
  )
  return { filas: trozos.flat(), total: count }
}

/**
 * Todas las filas de una consulta, y el CONTRASTE contra lo que dice el servidor.
 *
 * ⚠️ SUSTITUYE A `fetchAllRows`, que tenía los dos fallos a la vez y por eso el
 * Dominio salía distinto en cada carga:
 *
 *   · PAGINABA SIN `order`. Sin un orden total Postgres no garantiza el mismo
 *     orden entre páginas, así que la unión traía el número de filas correcto y
 *     el CONJUNTO equivocado: tarjetas duplicadas y tarjetas que faltaban, unas
 *     u otras en cada ejecución. No es que el dominio estuviera bajo: es que no
 *     era el mismo dos veces seguidas.
 *   · ROMPÍA EN SILENCIO. `if (error || !data) break` trata un error de red
 *     igual que «ya no hay más filas»: devolvía lo acumulado y el llamante lo
 *     daba por completo. Una página perdida son mil tarjetas menos en el
 *     denominador, sin un solo aviso.
 *
 * `traerTodas` exige el orden y lanza si una página falla. Aquí encima se
 * compara lo traído con el recuento del servidor, que es lo que convierte un
 * número en fiable: la regla no es «paginar con order», es no dar una cifra
 * hasta haberla contrastado.
 */
export async function traerTodasContrastadas<T>(
  que: string,
  contar: () => PromiseLike<{ count: number | null; error: unknown }>,
  pagina: (desde: number, hasta: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  const { filas, total } = await traerTodas<T>(contar, pagina)
  if (filas.length !== total) {
    console.warn(`${que}: ${filas.length} filas de ${total}; la cifra no es fiable`)
  }
  return filas
}
