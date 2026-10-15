// Copiado de Persevera (src/lib/textUtils.ts) el 15-oct-2026, rama claude/dia-d
// en 54e448e. Copiar, nunca mover: el original sigue en Persevera. Tal cual.

/**
 * Utilidades de formateo de texto compartidas por toda la app.
 * Actualmente usadas por:
 *   - Simulacros: enunciados de supuestos en el selector y el modal "Ver enunciado".
 *   - Supuestos  (EstudiarView → tab Supuestos): enunciados de minicasos, originales y oficiales.
 */

/**
 * Marcadores discursivos típicos del castellano administrativo y jurídico
 * que suelen iniciar un nuevo párrafo en casos prácticos.
 *
 * Si una oración empieza con cualquiera de estos marcadores, forzamos
 * corte de párrafo antes de ella aunque no se haya alcanzado el límite
 * de caracteres. El resultado son párrafos más naturales, alineados con
 * los cambios de tema, tiempo o sujeto del relato.
 */
const MARCADORES_PARRAFO: string[] = [
  // Temporales
  'Al día siguiente', 'Días después', 'Semanas después', 'Meses después',
  'Posteriormente', 'Paralelamente', 'Mientras tanto', 'Tras ello',
  'Tras esto', 'Tras recibir', 'Tras conocer', 'Tras la',
  'Después de', 'Al cabo de', 'Transcurridos', 'Una vez',
  'En ese momento', 'En esa fecha', 'En ese instante',
  'Al mes siguiente', 'Al año siguiente',
  'Seguidamente', 'Inmediatamente',
  // Adversativos / concesivos
  'Sin embargo', 'No obstante', 'Ahora bien', 'En cambio', 'Pese a',
  'A pesar de', 'Aun así',
  // Aditivos / secuencia
  'Además', 'Asimismo', 'Por otro lado', 'Por su parte',
  'Por otra parte', 'De igual modo', 'Del mismo modo',
  // Consecutivos / finales
  'En consecuencia', 'Por ello', 'Por tanto', 'Por lo tanto',
  'Como consecuencia', 'En cualquier caso', 'Finalmente', 'Por último',
  'Ante esta situación', 'Ante estos hechos', 'Ante esta circunstancia',
  // Introducciones comunes en casos prácticos
  'El interesado', 'La interesada', 'El funcionario', 'La funcionaria',
  'La Administración', 'El órgano', 'El Ministerio', 'El Secretario',
  'La Secretaría', 'El Subsecretario', 'La Subsecretaría',
  'Se cuestiona', 'Se plantea', 'Se pregunta', 'Se consulta',
]

/**
 * Abreviaturas tras las que un punto NO cierra la oración.
 *
 * Sin esta lista, «…un contrato con la empresa TechServ S.A. cuyo objeto es el
 * mantenimiento…» se parte en el punto de la abreviatura y el párrafo siguiente
 * arranca con «A. cuyo objeto es…». Se ve poco en pantalla, donde el corte casi
 * siempre cae por longitud, y salta a la vista impreso: así se descubrió, montando
 * el libro de simulacros del Administrativo.
 *
 * Las iniciales de una sola letra («D. Pablo», «S.A.») se descartan por longitud,
 * no hace falta enumerarlas.
 *
 * ⚠️ La misma regla vive en `~/Documents/PERSEVERA-LIBROS/comun/parrafos.py`, que
 * es la que usan los libros. Si se toca una, tocar la otra.
 */
const ABREVIATURAS = new Set([
  'd', 'dª', 'dña', 'sr', 'sra', 'sres', 'sras', 'art', 'arts', 'núm', 'núms',
  'nº', 'pág', 'págs', 'ss', 'etc', 'vol', 'cap', 'apdo', 'ap', 'rd', 'rdl',
  'lo', 'cc', 'aprox', 'ej',
])

/** Corta en oraciones sin partir por el punto de una abreviatura. */
function dividirEnOraciones(texto: string): string[] {
  const oraciones: string[] = []
  const fin = /[.!?]+["')\]»]*\s+(?=[«"¿¡([A-ZÁÉÍÓÚÜÑ0-9])/g
  let ini = 0
  let m: RegExpExecArray | null
  while ((m = fin.exec(texto)) !== null) {
    const previa = texto.slice(ini, m.index).match(/([\wÁÉÍÓÚÜÑáéíóúüñ]+)\s*$/)
    const palabra = (previa?.[1] ?? '').toLowerCase()
    if (ABREVIATURAS.has(palabra) || palabra.length === 1) continue
    oraciones.push(texto.slice(ini, m.index + m[0].length).trim())
    ini = m.index + m[0].length
  }
  const resto = texto.slice(ini).trim()
  if (resto) oraciones.push(resto)
  return oraciones
}

function empiezaConMarcador(texto: string): boolean {
  const trimmed = texto.trimStart()
  return MARCADORES_PARRAFO.some(m =>
    trimmed.startsWith(m + ' ') ||
    trimmed.startsWith(m + ',') ||
    trimmed.startsWith(m + ':')
  )
}

/**
 * Divide un texto largo en párrafos legibles.
 *
 *  1. Si el texto ya trae saltos `\n\n` → respeta esa estructura.
 *  2. Si trae saltos simples `\n` → también los respeta.
 *  3. Si no tiene saltos → divide por oraciones y agrupa:
 *     - Corte natural cuando encuentra un marcador discursivo al inicio
 *       de una oración (ver `MARCADORES_PARRAFO`).
 *     - Corte por longitud cuando el párrafo acumulado supera
 *       `TARGET_CHARS` (≈280 caracteres ≈ 3-5 líneas en móvil).
 *
 * Devuelve un array de strings, uno por párrafo, sin líneas en blanco.
 */
export function dividirEnParrafos(texto: string): string[] {
  const trimmed = (texto ?? '').trim()
  if (!trimmed) return []

  // 1) Si ya hay separaciones claras, respétalas
  if (/\n\s*\n/.test(trimmed)) {
    return trimmed.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  }
  if (trimmed.includes('\n')) {
    return trimmed.split(/\n/).map(p => p.trim()).filter(Boolean)
  }

  // 2) Un apartado enumerado EN LÍNEA abre párrafo, como si trajera su salto.
  //    «…las siguientes situaciones: (a) La Subdirección… ; (b) La Secretaría…»
  //    es una sola oración larguísima —van separados por punto y coma, no por
  //    punto—, así que el troceo por oraciones no la toca y el lector se come
  //    cuatro apartados de corrido.
  const conApartados = trimmed.replace(/(?<=[;:.])\s+(?=\((?:[a-z]|[ivx]{1,4})\)\s+[A-ZÁÉÍÓÚÑ])/g, '\n')
  if (conApartados !== trimmed) {
    // Un apartado va ENTERO aunque sea largo: partirlo por longitud deja un
    // párrafo huérfano sin su «(d)» delante, que se lee como un apartado nuevo.
    return conApartados.split(/\n+/).flatMap(b =>
      /^\s*\((?:[a-z]|[ivx]{1,4})\)\s+[A-ZÁÉÍÓÚÑ]/.test(b) ? [b.trim()] : dividirEnParrafos(b))
  }

  // 3) Texto monolítico: dividir por oraciones
  const oraciones = dividirEnOraciones(trimmed)

  if (oraciones.length <= 1) return [trimmed]

  const TARGET_CHARS = 280
  const parrafos: string[] = []
  let acumulador = ''

  for (const o of oraciones) {
    if (acumulador.length === 0) {
      acumulador = o
      continue
    }
    const cortaPorMarcador = empiezaConMarcador(o)
    const cortaPorLongitud = acumulador.length + 1 + o.length > TARGET_CHARS

    if (cortaPorMarcador || cortaPorLongitud) {
      parrafos.push(acumulador)
      acumulador = o
    } else {
      acumulador += ' ' + o
    }
  }
  if (acumulador) parrafos.push(acumulador)
  return parrafos
}
