// Copiado de Persevera (src/styles/examen.ts) el 15-oct-2026, rama claude/dia-d
// en 54e448e. Copiar, nunca mover: el original sigue en Persevera. Tal cual:
// los colores y los tamaños de letra son los de Persevera hasta el paso de tema
// de T23.

// =========================================================================
// PERSEVERA · Lenguaje visual de EXAMINARSE
// =========================================================================
// Fuente única de los valores que comparten todas las pantallas donde el usuario
// responde algo: tests, simulacros, supuestos, minicasos, psicotécnicos y el
// marcado de ortografía/gramática.
//
// POR QUÉ EXISTE: hasta ahora cada pantalla escribía sus colores a mano, así que
// la misma corrección se veía con tres intensidades distintas (0,13 / 0,18 /
// 0,22), el botón del tutor era azul en una sola pantalla, y `getOptionStyle`
// estaba duplicada LITERALMENTE en TakeTest y SupuestoPlayer. Cada pantalla nueva
// volvía a decidir de cero, y con cada oposición nueva la app se parecía menos a
// sí misma.
//
// LA REGLA: lo que cambia entre oposiciones son las REGLAS del examen —cuántas
// pruebas, qué corte, qué penalización, qué elimina—, nunca el aspecto de
// responder. Si necesitas un color que no está aquí, casi seguro que el que
// necesitas sí está.
//
// LOS VALORES SON LOS QUE YA ERAN MAYORÍA (tests + supuestos + resultado de
// simulacro), no un rediseño: así migrar esas pantallas no cambia un píxel y las
// que se habían ido convergen hacia lo que el usuario ya conoce.
// =========================================================================

/** Colores semánticos. Nombrados por lo que SIGNIFICAN, no por lo que son. */
export const COLOR = {
  /** Fondo de toda pantalla de examinarse. */
  fondo: '#1B2A4A',
  /** Superficie elevada: modales, hojas, paneles flotantes. */
  superficie: '#152340',

  /** Verde de marca: acción principal, selección, progreso. */
  marca: '#0D7C66',
  /** Verde claro: acierto. NO usarlo para progreso ni para acciones. */
  acierto: '#5BA899',
  /** Rojo: fallo. */
  fallo: '#D55454',
  /** Rojo suave, para TEXTO sobre fondo oscuro (el #D55454 vibra en tipografía). */
  falloTexto: '#E89090',
  /** Ámbar: aviso, tiempo que se acaba, "marcada para revisar". */
  aviso: '#E8863A',
} as const

/** Un estilo de opción, tal y como lo consumen las tarjetas A/B/C/D. */
export interface EstiloOpcion {
  bg: string
  border: string
  text: string
  badgeBg: string
  badgeText: string
}

/**
 * Colores de UNA opción según su estado.
 *
 * Recibe booleanos y no letras a propósito: cada pantalla tiene su propio tipo
 * de letra (mayúsculas en unas, minúsculas en otras) y esto las sirve a todas.
 *
 * `confirmado` = ya se corrigió. Mientras es false NO se filtra si la opción era
 * la buena: en el simulacro y en el modo examen se responde a ciegas, y ese
 * "false" permanente es lo que lo implementa.
 */
export function estiloOpcion(
  { seleccionada, correcta, confirmado }:
  { seleccionada: boolean; correcta: boolean; confirmado: boolean },
): EstiloOpcion {
  if (!confirmado) {
    return {
      bg:        seleccionada ? 'rgba(13,124,102,0.2)'  : 'rgba(255,255,255,0.06)',
      border:    seleccionada ? 'rgba(13,124,102,0.55)' : 'rgba(255,255,255,0.1)',
      text:      seleccionada ? 'white'                 : 'rgba(255,255,255,0.78)',
      badgeBg:   seleccionada ? COLOR.marca             : 'rgba(255,255,255,0.1)',
      badgeText: 'white',
    }
  }
  if (correcta) {
    return { bg: 'rgba(91,168,153,0.13)', border: 'rgba(91,168,153,0.45)', text: COLOR.acierto, badgeBg: COLOR.marca, badgeText: 'white' }
  }
  if (seleccionada) {
    return { bg: 'rgba(213,84,84,0.13)', border: 'rgba(213,84,84,0.45)', text: COLOR.falloTexto, badgeBg: '#B23838', badgeText: 'white' }
  }
  // Ni la correcta ni la que marcó: se apaga para que no compita con las otras dos.
  return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.35)', badgeBg: 'rgba(255,255,255,0.07)', badgeText: 'rgba(255,255,255,0.35)' }
}

/** Relleno y borde de corrección para superficies que NO son tarjetas A/B/C/D
 *  (las unidades marcables de ortografía y gramática). Misma intensidad. */
export const CORRECCION = {
  acierto: { bg: 'rgba(91,168,153,0.13)', border: 'rgba(91,168,153,0.45)' },
  fallo:   { bg: 'rgba(213,84,84,0.13)',  border: 'rgba(213,84,84,0.45)'  },
} as const

/** Pregunta anulada por el tribunal: ni acierto ni fallo. Es el ámbar del aviso
 *  «Pregunta anulada en el examen oficial» del reproductor, para que la casilla,
 *  el rótulo y el aviso se lean como la misma cosa. */
export const ANULADA = { bg: 'rgba(232,134,58,0.12)', border: 'rgba(232,134,58,0.45)', color: COLOR.aviso } as const

// ── Hoja de respuestas ───────────────────────────────────────────────────

export type EstadoCelda = 'pendiente' | 'contestada' | 'correcta' | 'fallada' | 'anulada'

export interface EstiloCelda { bg: string; border: string; color: string }

/**
 * Colores de una celda de la hoja de respuestas.
 *
 * `actual` gana a todo y va en RELLENO sólido, no en borde: en una rejilla de
 * 100 celdas un borde de 2px no se encuentra de un vistazo. `marcada` gana al
 * estado de respuesta porque marcar es una decisión deliberada del opositor y
 * lo que quiere es volver a encontrarla.
 */
export function estiloCelda(
  estado: EstadoCelda,
  { actual = false, marcada = false }: { actual?: boolean; marcada?: boolean } = {},
): EstiloCelda {
  if (actual) return { bg: COLOR.marca, border: COLOR.marca, color: 'white' }
  if (marcada) return { bg: 'rgba(232,134,58,0.18)', border: 'rgba(232,134,58,0.4)', color: '#F2B279' }
  switch (estado) {
    case 'correcta':   return { bg: CORRECCION.acierto.bg, border: CORRECCION.acierto.border, color: COLOR.acierto }
    case 'fallada':    return { bg: CORRECCION.fallo.bg,   border: CORRECCION.fallo.border,   color: COLOR.falloTexto }
    case 'anulada':    return { bg: ANULADA.bg,            border: ANULADA.border,            color: ANULADA.color }
    case 'contestada': return { bg: 'rgba(91,168,153,0.13)', border: 'rgba(91,168,153,0.4)', color: '#A4D2C5' }
    default:           return { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }
  }
}

/**
 * Cuántas columnas para `n` preguntas. Una rejilla de 7 se lee bien hasta unas
 * 50; con las 100 de Guardia Civil se haría una columna larguísima que obliga a
 * hacer scroll dentro del propio panel.
 */
export function columnasHoja(n: number): number {
  // A partir de 100 los números tienen TRES cifras y en 10 columnas no caben:
  // el panel mide 280px, así que cada celda quedaba en ~19px y «109» o «119» se
  // salían por la derecha. Con 8 columnas la celda pasa de 26px y entra.
  // Se nota en los exámenes largos: el simulacro de Guardia Civil son 120.
  if (n > 99) return 8
  return n > 50 ? 10 : 7
}

/** Cuerpo de letra de la celda: baja con tres cifras para que no se salga. */
export function fuenteCelda(n: number): number {
  return n > 99 ? 10.5 : 12
}

// ── Tiempo ───────────────────────────────────────────────────────────────

/**
 * Segundos → "M:SS", o "H:MM:SS" si pasa de la hora.
 *
 * El salto a horas importa: sin él, el bloque teórico de Guardia Civil (140 min)
 * arrancaba mostrando «140:00», que nadie lee como "dos horas y veinte".
 */
export function fmtDur(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos || 0))
  const seg = s % 60
  if (s < 3600) return `${Math.floor(s / 60)}:${String(seg).padStart(2, '0')}`
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${h}:${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}`
}

/** Segundos → "12 min 34 s". Para BALANCES (resultados), no para relojes vivos. */
export function fmtDuracionLarga(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos || 0))
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} s`
}

export type UrgenciaTiempo = 'normal' | 'aviso' | 'critico'

/**
 * En qué punto se pone nervioso el reloj. Antes cada pantalla tenía su umbral
 * cableado, así que a 45 segundos del final una avisaba en rojo y otra en ámbar.
 *
 * Es PROPORCIONAL con SUELO, y las dos mitades hacen falta:
 *  · proporcional, porque 60 segundos son una eternidad en una tanda de 5
 *    minutos y nada en un examen de 140;
 *  · con suelo, porque el 8% de una tanda de 5 minutos son 24 segundos, y
 *    avisar de que se acaba cuando quedan 24 segundos no sirve de nada.
 */
const SUELO_AVISO = 60      // s
const SUELO_CRITICO = 30    // s

export function urgenciaTiempo(restante: number, total: number): UrgenciaTiempo {
  if (!Number.isFinite(restante) || !Number.isFinite(total) || total <= 0) return 'normal'
  const r = Math.max(0, restante)
  if (r <= Math.max(total * 0.08, SUELO_CRITICO)) return 'critico'
  if (r <= Math.max(total * 0.25, SUELO_AVISO)) return 'aviso'
  return 'normal'
}

export function colorTiempo(u: UrgenciaTiempo): string {
  return u === 'critico' ? COLOR.fallo : u === 'aviso' ? COLOR.aviso : 'white'
}
