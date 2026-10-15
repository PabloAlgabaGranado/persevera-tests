// Copiado de Persevera (src/lib/cifras.ts) el 15-oct-2026, rama claude/dia-d en
// 54e448e. Copiar, nunca mover: el original sigue en Persevera. Tal cual. Es la
// de Persevera y no la de Oral, para no tener dos.

// ─────────────────────────────────────────────────────────────────────────────
// El punto de los miles, para números que se escriben DENTRO de un texto.
//
// POR QUÉ EXISTE. Un número interpolado en crudo en una plantilla —`~${horas}h`—
// no pasa por ningún formateador, así que no lleva separador NUNCA, a ningún
// tamaño: un plan de 12.000 horas se leía «~12000h». No es el mismo caso que el
// de `Intl` en modo «auto», que sí agrupa a partir de 10.000 y falla solo en la
// franja 1.000–9.999; aquí no agrupa nada.
//
// POR QUÉ EN lib/ Y NO EN CADA FICHERO. Porque el defecto que arregla nació
// precisamente de copiar el mismo literal en varios sitios y corregir solo
// algunos (ver la cabecera de `lib/contabilidad/separadorMillar.test.ts`). Una
// función, un sitio donde arreglarla.
//
// ⚠️ Formatea al ESCRIBIR, nunca al calcular. Las horas del planificador se
// comparan (`if (horasTotales >= 1800)`) y se devuelven como campo, así que
// convertirlas en texto en su origen rompería la lógica. Esto se usa en el
// punto de interpolación y en ningún otro sitio.
// ─────────────────────────────────────────────────────────────────────────────

/** Un número entero con su punto de los miles: 12000 → «12.000», 360 → «360». */
export const miles = (n: number): string =>
  n.toLocaleString('es-ES', { useGrouping: true, maximumFractionDigits: 0 })

// ─────────────────────────────────────────────────────────────────────────────
// La coma de los decimales, por lo mismo.
//
// `toFixed` escribe SIEMPRE punto, esté la app en el idioma que esté: la nota
// neta de los resultados del test se leía «0.00 de 3» y «46.67 de 100».
//
// ⚠️ Las opciones van escritas en cada llamada y no en una constante compartida:
// `contabilidad/separadorMillar.test.ts` las evalúa en frío, y una variable no
// la puede leer (la daría por «opaca» y fallaría).
// ─────────────────────────────────────────────────────────────────────────────

/** Una nota con dos decimales, como las publica un tribunal: 46,666… → «46,67», 0 → «0,00». */
export const dosDecimales = (n: number): string =>
  n.toLocaleString('es-ES', { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Hasta dos decimales, sin ceros de más: 0,2 → «0,2», 0,5 → «0,5», 1 → «1». */
export const hastaDosDecimales = (n: number): string =>
  n.toLocaleString('es-ES', { useGrouping: true, maximumFractionDigits: 2 })
