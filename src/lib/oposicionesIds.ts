// Copiado de Persevera (src/lib/oposicionesIds.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual.

// =========================================================================
// PERSEVERA · Los identificadores de las oposiciones, en UN solo sitio
// =========================================================================
// Hasta ahora cada UUID estaba escrito a mano en 13 ficheros distintos
// (EstudiarView, el hub de simulacros, el planificador, los mapas mentales, el
// tour, el tutor…). Añadir una oposición obligaba a acordarse de TODOS, y el
// patrón del repo es «mapa por id con fallback al Administrativo»: cuando se
// olvida uno, no falla nada — la oposición nueva se degrada en silencio a otra.
// Eso es peor que un error, porque el opositor lo ve como producto.
//
// Aquí viven los ids y nada más. Los mapas de configuración siguen donde
// estaban; lo que cambia es que todos importan la MISMA constante.
// =========================================================================

/** Administrativo del Estado. La primera, y el fallback histórico del código. */
export const ID_ADMINISTRATIVO = '1fd3dcce-78b1-423c-bbcb-3c0649eda113'
export const ID_AUXILIAR       = 'd1da10aa-7671-4684-9445-727504e7baf1'
export const ID_HACIENDA       = '1a415277-3259-468b-9e2f-df5ff59aa562'
export const ID_SEGURIDAD_SOCIAL = 'bed5cc28-f50a-44fb-9229-a347030dcd56'

/**
 * Cuerpo Técnico de Hacienda (A2, AEAT). Convocatoria BOE-A-2025-27149.
 *
 * Volcado a Supabase el 31-jul-2026 con el banco del 1.er ejercicio; el anexo
 * I.1.4 (materia del 3.º) se dio de alta el 3-sep-2026. Sigue `activa=false`.
 *
 * Su examen tiene TRES ejercicios y ninguno se parece al del Administrativo:
 *   1.º Test de 100 preguntas, cuatro opciones, penaliza ¼, 1 h 40 → 0-20 puntos.
 *   2.º Cinco supuestos de Contabilidad y Matemática Financiera, 4 h → 0-30.
 *   3.º Dos partes en una sesión, ambas eliminatorias → 0-40: un cuestionario
 *       ESCRITO de hasta 20 preguntas (2 h 30) y un TEMA extraído al azar que se
 *       desarrolla por escrito y se lee ante el tribunal (1 h 30). Cada parte
 *       0-20 y sin compensación por debajo de 8.
 */
export const ID_TECNICO_HACIENDA = '533244e7-0d7b-4ac2-a2ea-2886ac0df4ea'

/** ¿Es esta la oposición del Cuerpo Técnico de Hacienda? */
export function esTecnicoHacienda(oposicionId: string | null | undefined): boolean {
  return Boolean(ID_TECNICO_HACIENDA) && oposicionId === ID_TECNICO_HACIENDA
}

/**
 * Guardia Civil, Escala de Cabos y Guardias. Volcada el 22-jul-2026.
 *
 * Pegar este id es lo ÚNICO que enciende, a la vez, sus cuatro tarjetas de
 * estudio (ortografía, gramática, inglés y psicotécnicos), sus dos simulacros,
 * las reglas de su planificador, su tour de bienvenida y el cálculo de Dominio
 * sin casos prácticos.
 *
 * Ojo: encender su configuración NO la hace visible al público — para eso está
 * `oposiciones.activa`, que en Guardia Civil ya está en true (viva desde jul-2026).
 * Las oposiciones que sigan inactivas se ven en desarrollo con
 * PREVIEW_OPOSICIONES_INACTIVAS.
 */
export const ID_GUARDIA_CIVIL = '693d45f5-e110-416f-9c9f-72d58b5778c9'

/**
 * ¿Es esta la oposición de Guardia Civil?
 *
 * Se pregunta con una función y no comparando la constante a pelo porque, con
 * el id vacío, `oposicionId === ID_GUARDIA_CIVIL` sería TRUE para cualquier
 * llamada sin id — y encendería la configuración de GC en la oposición
 * equivocada. Aquí eso no puede pasar.
 */
export function esGuardiaCivil(oposicionId: string | null | undefined): boolean {
  return Boolean(ID_GUARDIA_CIVIL) && oposicionId === ID_GUARDIA_CIVIL
}

/** ¿Ya está volcada Guardia Civil? Para avisos y guardas de desarrollo. */
export const GUARDIA_CIVIL_VOLCADA = Boolean(ID_GUARDIA_CIVIL)

/**
 * Cuerpo de Gestión de la Administración Civil del Estado (A2, código 1122).
 * Convocatoria vigente: BOE-A-2025-26262, anexo VII (ingreso libre).
 *
 * Volcada el 17-sep-2026 con `activa = false` (volcado_gace/). Con el id puesto,
 * `REGLAS_GESTION_CIVIL` entra en el mapa del planificador —ver `conOposicion`— y
 * deja de heredar en silencio las del Administrativo. Mientras la oposición esté
 * inactiva ningún opositor la ve: los selectores exigen `activa = true`.
 *
 * Ojo al pegarlo: su examen NO se parece al del Administrativo aunque compartan
 * resolución. Son dos ejercicios (test de 100 en 90 minutos y un supuesto que se
 * ESCRIBE en 150), y la penalización de un tercio coincide con la del C1 por pura
 * casualidad — en su turno de promoción interna es de un cuarto.
 */
export const ID_GESTION_CIVIL = '45ae1b60-17f2-4401-ac21-eff0c30ed7f9'

/** ¿Es esta la oposición de Gestión de la Administración Civil del Estado? */
export function esGestionCivil(oposicionId: string | null | undefined): boolean {
  return Boolean(ID_GESTION_CIVIL) && oposicionId === ID_GESTION_CIVIL
}

/** ¿Ya está volcada Gestión de la Administración Civil del Estado? */
export const GESTION_CIVIL_VOLCADA = Boolean(ID_GESTION_CIVIL)

/**
 * ¿El examen de esta oposición incluye un ejercicio que se RESPONDE ESCRIBIENDO?
 *
 * Tres cuerpos: Agentes de la Hacienda Pública, cuyo 2.º ejercicio son diez supuestos
 * que se redactan a mano («breve y razonado», BOE-A-2025-27056); Gestión de la
 * Administración Civil del Estado, cuyo 2.º ejercicio es «la resolución por escrito
 * de un supuesto práctico de 5 preguntas, a elegir entre dos» (BOE-A-2025-26262,
 * anexo VII) — y donde 20 de sus 50 puntos ni siquiera miden derecho, sino análisis,
 * sistemática y expresión escrita —; y el Técnico de Hacienda, cuyo 3.er ejercicio se
 * escribe ENTERO: un cuestionario de hasta 20 preguntas con supuestos de liquidación
 * dentro, y un tema desarrollado a mano y leído ante el tribunal (BOE-A-2025-27149).
 * Son 40 de sus 90 puntos: el ejercicio que más pesa de los tres. En las otras todo se responde marcando casilla,
 * incluidos los supuestos prácticos — el del Administrativo y el de Seguridad Social
 * vienen desglosados en preguntas tipo test.
 *
 * Importa porque el modo «Examen real (escribir)» de los supuestos se ofrecía por
 * TIPO de caso y nunca por oposición: al opositor del Administrativo se le proponía
 * entrenar redacción para una prueba donde solo rellena una casilla, y encima
 * llamándolo «examen real», que es justo lo que no es para él.
 */
export function tieneEjercicioEscrito(oposicionId: string | null | undefined): boolean {
  if (!oposicionId) return false
  return oposicionId === ID_HACIENDA || oposicionId === ID_GESTION_CIVIL || esTecnicoHacienda(oposicionId)
}

/**
 * Añade la entrada de Guardia Civil a un mapa de configuración por oposición,
 * pero SOLO si ya tiene id. Evita que un mapa acabe con una clave `''` que
 * capture a quien no debe.
 *
 *   const MAPA = { ...otras, ...conGuardiaCivil(REGLAS_GC) }
 */
export function conGuardiaCivil<T>(valor: T): Record<string, T> {
  return ID_GUARDIA_CIVIL ? { [ID_GUARDIA_CIVIL]: valor } : {}
}

/**
 * La versión genérica de lo anterior, para las oposiciones que aún no están
 * volcadas. Añade la entrada solo si el id tiene valor, de modo que una
 * configuración escrita por adelantado no crea la clave `''` — que capturaría a
 * cualquier llamada sin id y aplicaría las reglas de una oposición a otra.
 *
 *   const MAPA = { ...otras, ...conOposicion(ID_GESTION_CIVIL, REGLAS_GESTION_CIVIL) }
 */
export function conOposicion<T>(id: string, valor: T): Record<string, T> {
  return id ? { [id]: valor } : {}
}
