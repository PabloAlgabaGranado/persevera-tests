// Copiado de Persevera (src/lib/pruebaIdioma.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

// =========================================================================
// PERSEVERA · Localizar la prueba de IDIOMA dentro de una oposición
// =========================================================================
// Algunas oposiciones tienen el idioma como una prueba aparte del temario, con
// su propia nota de corte (en Guardia Civil son 20 preguntas y hacen falta 8).
// Sus preguntas viven en la MISMA tabla `preguntas` que el resto, etiquetadas
// bajo un tema propio; lo único que cambia es que se estudian por separado.
//
// El tema se resuelve POR NOMBRE y no por un id cableado a propósito: así la
// tarjeta funciona en cuanto se vuelca la oposición, sin tocar código, y no se
// rompe si la base de datos se recrea con otros identificadores.
// =========================================================================

/** Reconoce el tema de idioma por su título, tolerando cómo se haya escrito. */
export const ES_TEMA_IDIOMA = /\bingl[eé]s\b|\blengua inglesa\b|\bidioma\b/i

export interface TemaRef {
  id: string
  titulo: string
}

/**
 * Devuelve el tema de idioma de la lista, o null si esa oposición no tiene.
 * Si hubiera varios candidatos se queda con el primero por orden de aparición
 * (los temas llegan ordenados por número), que es el comportamiento predecible.
 */
export function localizarTemaIdioma(temas: ReadonlyArray<TemaRef>): TemaRef | null {
  return temas.find(t => ES_TEMA_IDIOMA.test(t.titulo ?? '')) ?? null
}
