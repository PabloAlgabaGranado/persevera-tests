// Copiado de Persevera (src/services/studyPlanEngine/reglasOposicion.ts) el
// 15-oct-2026, rama claude/dia-d en 54e448e. Copiar, nunca mover: el original
// sigue en Persevera. Tal cual. Es un módulo puro, y en Tests solo sirve para
// la penalización y los bloques con supuestos (hoja de ruta, T3): lo que trae
// para el plan no lo usa nada aquí.

import { conGuardiaCivil, conOposicion, ID_GESTION_CIVIL, ID_TECNICO_HACIENDA } from '../../lib/oposicionesIds'
import {
  conserva,
  type EjercicioConservado, type OpcionReserva, type ReservaDeclarada, type TurnoDeclarado,
} from '../../types/EstadoConvocatoria.types'

// =========================================================================
// PERSEVERA · Reglas pedagógicas por oposición
// =========================================================================
// El motor del plan codificaba reglas "a número de bloque" pensadas para el C1
// (p. ej. "los bloques 2-5 llevan minicasos"). Con varias oposiciones eso
// mal-dispararía: el Bloque 2 del Auxiliar (actividad administrativa + ofimática)
// NO tiene minicasos, pero comparte el número 2 con el C1.
//
// Estas reglas se externalizan aquí, por oposición. `REGLAS_C1` reproduce el
// comportamiento HISTÓRICO exacto (mismos rangos), así que el Administrativo NO
// cambia nada. El motor sigue siendo puro: recibe las reglas como dato.
// =========================================================================

/** Mezcla de UNA sesión de descubrimiento: cuánta lectura y cómo se reparte el resto. */
export interface PasoDescubrimiento {
  /** Fracción de la sesión dedicada a lectura (0-1). */
  pctLectura: number
  /** ¿Incluye step de test? (false = el tiempo no-lectura es solo flashcards). */
  conTest: boolean
  /** Fracción del tiempo NO-lectura que va a test (el resto, a flashcards). Ignorado si conTest=false. */
  testDelResto: number
}

/** Mezcla de la fase de descubrimiento, distinta en la 1ª sesión de un tema y en las siguientes. */
export interface ReglaDescubrimiento {
  primera: PasoDescubrimiento
  resto:   PasoDescubrimiento
}

/**
 * Drill transversal: una prueba del examen que NO va atada a un tema y se entrena
 * a base de repetición (psicotécnicos, ortografía, gramática, idioma).
 *
 * Existe porque hay oposiciones cuyo examen son VARIAS pruebas independientes.
 * Sin esto, el motor solo sabe repartir tiempo entre temas y deja sin programar
 * pruebas que eliminan por sí solas.
 */
export interface DrillTransversal {
  tipo: 'psicotecnicos' | 'ortografia' | 'gramatica' | 'ingles'
  /** Cada cuántos días aparece (1 = diario, 2 = días alternos). */
  cada: number
  /** Minutos del hueco. */
  minutos: number
  /**
   * La prueba elimina por sí sola (apto/no apto), aunque no sume puntos.
   * El plan NUNCA la recorta para hacer sitio a otra cosa.
   */
  eliminatoria: boolean
}

/**
 * Tramo del calendario a efectos del carril transversal. No es una fase del plan:
 * son los tres trozos en los que cambia lo que el carril vale contra el resto.
 *
 *  · `campana_larga` — mientras el primer ejercicio queda lejos.
 *  · `punta_primero` — la recta final del primer ejercicio, que es eliminatorio.
 *  · `ventana`       — el tramo que va de un ejercicio al siguiente, cuando el del
 *                      carril es justo el que tiene delante.
 */
export type TramoCarril = 'campana_larga' | 'punta_primero' | 'ventana'

/**
 * Carril transversal: minutos diarios para un ejercicio que NO es un bloque del
 * temario y que, por eso, el motor no sabría programar.
 *
 * Nace con el Cuerpo Técnico de Hacienda, cuyo 2.º ejercicio (Contabilidad y
 * Matemática Financiera, cinco supuestos en cuatro horas) vale 30 de los 90 puntos
 * del proceso, es eliminatorio con un mínimo de 15, y no tiene ni un bloque detrás:
 * los tres del cuerpo son los anexos I.1.1, I.1.2 y I.1.4, y el I.1.3 no está entre
 * ellos. El motor compone el día recorriendo BLOQUES, así que mientras esto no
 * existiera ningún porcentaje que se le pusiera podía hacer aparecer contabilidad
 * en el plan: el plan le dedicaba CERO minutos, todos los días, también al opositor
 * exento del primer ejercicio, que solo se presenta a este y al tercero.
 *
 * La diferencia con `drills` —que es el molde del que sale— son dos cosas:
 *   · COBRA PRIMERO. Los drills se reparten con lo que sobra del día y se topan al
 *     45 %; este reserva sus minutos ANTES que nadie, incluido el ensayo del examen
 *     completo, porque su suelo es innegociable.
 *   · TIENE SUELO Y CUOTA. Un drill pide una cifra fija de minutos; este pide
 *     `max(suelo, cuota × jornada)` y el suelo no baja de ahí ningún día.
 *
 * Lo que NO hace: cargar el material. El plan reserva los minutos y nombra el
 * carril; el caso lo elige el módulo de contabilidad al abrir el paso. Por eso el
 * motor no importa nada de `src/lib/contabilidad/` ni del banco de casos, que hoy
 * no se emite en producción (`BANCO_CONTABILIDAD_DISPONIBLE = import.meta.env.DEV`,
 * porque dentro está el material de dos libros a la venta). El plan reserva los
 * minutos aunque la pantalla todavía no exista.
 */
export interface CarrilTransversal {
  /** Qué se hace en esos minutos. Hoy solo contabilidad. */
  tipo: 'contabilidad'
  /**
   * Suelo diario en minutos, y la fracción de la jornada con la que compite:
   * el suelo real es `min(suelo, fraccionSuelo × jornada)`. Con 30 y 0,40, quien
   * declara 3 h recibe 30 minutos y quien declara 50 recibe 20 — el suelo no puede
   * comerse media jornada corta, pero tampoco desaparece.
   */
  suelo: number
  fraccionSuelo: number
  /** Techo: fracción máxima del día que puede llevarse el carril. */
  techo: number
  /** Cuota del día por tramo. */
  cuota: Record<TramoCarril, number>
  /** Cómo se le nombra al opositor. Debe describir SU ejercicio. */
  etiqueta: string
}

// ═══════════════════════════════════════════════════════════════════════════
//   CONSERVAR LA NOTA: LA NORMA, COMO DATO
// ═══════════════════════════════════════════════════════════════════════════
//
// ⚠️ LA CONSERVACIÓN NO ES UNA REGLA: ES UNA POR CONVOCATORIA. Comprobado en el
// BOE el 29-sep-2026:
//
//                        Técnico de Hacienda        Agente de la Hacienda Pública
//                        (BOE-A-2025-27149, 6.3)    (BOE-A-2025-27056, 6.2)
//   Convocatorias        dos por los dos turnos     una en acceso libre, dos en
//                                                   promoción interna
//   Condición 2.ª        en acceso libre, superar   no la hay por ninguno de los
//                        algún ejercicio adicional  dos turnos
//                        en la primera; en
//                        promoción interna NO la
//                        hay (allí el ejercicio
//                        adicional alarga a una
//                        tercera)
//   Qué se conserva      el 1.º, el 2.º o los dos   SOLO el 1.º
//   Análogos             sí                         sí
//
// ⚠️ LAS DOS DISTINGUEN POR TURNO, cada una en una casilla distinta: Agente en
// cuántas convocatorias dura, el Técnico en si la segunda lleva condición. La
// primera lectura dio al Técnico por turno-ciego y le ponía a promoción interna
// una condición que su base no le pone.
//
// Hasta el 29-sep-2026 la pantalla pintaba la base 6.3 del Técnico —que está
// APAGADO— debajo de cualquier opción conservada. La única viva donde se pinta
// algo es Agente, así que a esa gente se le decía que su nota dura una
// convocatoria más de lo que le da su base, y se le callaba lo de los ejercicios
// análogos. Con esa frase delante alguien puede decidir no presentarse.
//
// Y «conservo el 2.º» se le ofrecía sin ninguna norma detrás: colgaba de
// `ejercicioDeLaCola === 'segundo'`, que dice qué ejercicio prepara la cola del
// PLAN, no qué permite la CONVOCATORIA. Un campo describía la norma y el otro la
// máquina, y se usaron como si fueran intercambiables. El precio de un sí
// equivocado está medido: de 57 a 224 horas, todo lo posterior al 1.er examen,
// para un examen que sí tendría que hacer.
//
// Desde aquí la norma es dato, como todo lo demás en `ReglasOposicion`.
//
// ───────────────────────────────────────────────────────────────────────────
// LAS QUE SE HAN LEÍDO Y AUN ASÍ SE QUEDAN SIN CAMPO, y por qué
// ───────────────────────────────────────────────────────────────────────────
//
// «Sin campo» tiene que querer decir «leída y no aplica», no «no la he buscado».
// Las bases estaban en convocatorias que este repo YA CITA en `fichaOposicion.ts`
// y en `oposicionesIds.ts`, así que aquí queda escrito qué dicen (leídas en el
// BOE el 29-sep-2026) para que nadie las vuelva a buscar:
//
//  · Administrativo del Estado y Auxiliar Administrativo del Estado
//    (BOE-A-2025-26262, norma común 16.2): quien supera el EJERCICIO ÚNICO con
//    una nota directa del 50 % o más y no supera el proceso conserva la
//    calificación en la convocatoria inmediata siguiente, con ejercicios
//    análogos. Sí se conserva, pero el ejercicio es UNO: conservarlo es quedarse
//    sin nada que preparar, no dejar fuera una parte del temario. No hay plan
//    parcial que declarar, así que no se pregunta.
//
//  · Gestión de la Administración Civil del Estado (BOE-A-2025-26262, norma
//    común 16.3, subgrupo A2): se conserva el primer ejercicio, y el segundo con
//    la calificación total. Pero sus dos ejercicios se celebran el MISMO DÍA
//    (norma común 8.6), así que conservar el primero no mueve ni una fecha ni
//    deja ningún bloque fuera. Y está inactiva.
//
//  · Administrativo de la Seguridad Social (BOE-A-2025-27158, base 6.2):
//    ejercicio único otra vez, y la única conservación que aparece es la del
//    turno de reserva de discapacidad (artículo 3.12 del RD 651/2025). Mismo
//    motivo que las dos primeras.
//
//  · Guardia Civil: su convocatoria NO se ha leído. Se queda sin campo por eso, y
//    no por haber comprobado que no conserva nada.
//
// El día que una de estas reciba `exencionPrimerEjercicio` habrá que volver aquí
// antes de ofrecerle nada.

/** Lo que una convocatoria concreta permite conservar, para UNA forma de acceso. */
export interface RegimenDeConservacion {
  /**
   * Ejercicios cuya calificación permite conservar esa convocatoria. Vacío = no
   * permite conservar ninguno, y entonces no se pregunta nada.
   */
  ejercicios: readonly EjercicioConservado[]
  /**
   * Para cuántas convocatorias vale la nota. `1` = solo la inmediata siguiente;
   * `2` = esa y la de después.
   */
  convocatorias: 1 | 2
  /**
   * Qué hace falta para que valga también en la SEGUNDA, escrito como
   * subordinada («en esa siguiente superas algún ejercicio más») porque así entra
   * en la frase que lee el opositor. Sin ella, la segunda no lleva condición.
   * Solo tiene sentido con `convocatorias: 2`.
   */
  condicionSegunda?: string
  /**
   * La convocatoria exige además que los ejercicios de la nueva sean
   * «esencialmente análogos» a los que se aprobaron. Es una condición que se le
   * callaba a Agente, y es de las que hacen perder la nota sin avisar.
   */
  exigeEjerciciosAnalogos: boolean
}

/**
 * La norma de conservación de UNA oposición, con su cita.
 *
 * `porTurno` no es un adorno: en Agente de la Hacienda Pública la misma base 6.2
 * da UNA convocatoria en acceso libre y DOS en promoción interna. Un solo régimen
 * obligaría a elegir a cuál de los dos mentirle.
 */
export type ConservacionDeNota = {
  /** La cita de donde sale TODO lo de aquí. No se pinta: se lee al mantenerlo. */
  base: string
} & (
  | { porTurno: false; unico: RegimenDeConservacion }
  | { porTurno: true;  libre: RegimenDeConservacion; promocion_interna: RegimenDeConservacion }
)

export interface ReglasOposicion {
  /** Bloques cuyos temas pueden recibir minicasos. */
  /** Bloques cuyos temas pueden recibir minicasos. */
  bloquesConMinicasos: ReadonlyArray<number>
  /** Bloques cuyos temas tienen supuestos propios en el banco. */
  bloquesConSupuestos: ReadonlyArray<number>
  /** Bloque con sesgo a volumen alto de test (o null si ninguno). */
  bloqueTestIntensivo: number | null
  /** Bloques que empiezan la práctica pronto (minicasos/supuestos tempranos). */
  bloquesPracticaTemprana: ReadonlyArray<number>
  /** ¿El examen incluye psicotécnicos? → el plan programa sesiones de psico. */
  psicotecnicos: boolean
  /**
   * Drills transversales de esta oposición. OPCIONAL y aditivo: si no se declara,
   * el motor mantiene el comportamiento histórico (un drill diario de psicotécnicos
   * si `psicotecnicos` es true, nada si es false). Solo lo usa Guardia Civil, que
   * tiene cuatro pruebas fuera del temario.
   */
  drills?: ReadonlyArray<DrillTransversal>
  /**
   * Carril transversal con suelo diario. OPCIONAL y aditivo: si no se declara, el
   * motor no reserva ni un minuto y el plan sale exactamente igual que antes. Solo
   * lo usa el Cuerpo Técnico de Hacienda (ver `CarrilTransversal`).
   */
  carrilTransversal?: CarrilTransversal
  /**
   * El proceso selectivo incluye pruebas FÍSICAS (u otras que no se preparan
   * estudiando). El plan no las programa —no somos entrenadores—, pero la pantalla
   * de disponibilidad avisa de que los minutos declarados son de ESTUDIO y de que
   * el entrenamiento va aparte. Sin ese aviso, quien declara 2 h/día y además
   * entrena acaba con una jornada real mayor de la que pensaba, y abandona el plan.
   */
  pruebasFisicas?: boolean
  /** Mezcla de la fase de descubrimiento (lectura / test / flashcards). */
  descubrimiento: ReglaDescubrimiento
  /** Múltiplo de práctica sobre la lectura total (calcularFeasibility): fija la
   *  franja de horas realista de ESTA oposición. Calibrado por tamaño de temario
   *  (palabras × dificultad × densidad) y exigencia real del cuerpo. */
  factorPractica: number
  /**
   * Ritmo del examen REAL para el cronómetro de práctica (minutos por pregunta).
   * NO es un tiempo inventado: sale de la convocatoria de cada cuerpo. Lo usa el
   * mini-simulacro cronometrado: tiempoLimite = round(nº preguntas × este ratio).
   * Antes el cliente clavaba 100/90 (Admvo) para TODAS las opos.
   */
  ratioMinPorPregunta: number
  /**
   * Fracción de acierto que descuenta cada fallo en SU convocatoria (1/3, 1/4…).
   * Las respuestas en blanco no penalizan en ninguna de las cinco.
   *
   * Se declara aquí, junto al resto de datos de examen, para que la pantalla de
   * resultados de un test pueda enseñar la nota NETA. Practicar sin penalización
   * está bien —durante el estudio interesa contestar y equivocarse—, pero si el
   * opositor solo ve "60 %" nunca aprende la aritmética que decide su examen: en
   * Guardia Civil, 60 aciertos y 40 fallos son 46,67 puntos, o sea NO APTO.
   */
  penalizacionPorError: number
  /**
   * Ensayo del examen COMPLETO en la recta final.
   *
   * Las cinco oposiciones tienen un simulacro completo construido y funcionando,
   * y NINGUNA lo programaba el plan: en pre-examen solo emitía mini-simulacros,
   * que son tests sueltos. La habilidad que más se juega el día del examen
   * —repartir el reloj entre las partes— no la ensayaba nadie salvo que se le
   * ocurriera ir por su cuenta al menú de Simulacros. En Guardia Civil es
   * sangrante: son cuatro pruebas bajo UN reloj de 140 minutos.
   *
   * El plan programa la INTENCIÓN, no el tiempo: la sesión dura lo que dure
   * cualquier otra y el simulacro lleva su propio cronómetro (igual que el drill
   * de psicotécnicos ocupa 18 min en el plan y el modal dura lo que haga falta).
   * Por eso `minutos` no reserva nada: es lo que se le DICE al opositor que dura
   * su examen, para que reserve el rato de verdad.
   */
  simulacroCompleto?: {
    /** Duración real del ejercicio, de su convocatoria. Solo informativa. */
    minutos: number
    /** Cada cuántos días se propone, dentro de la fase de pre-examen. */
    cadaDias: number
    /** Cómo se le nombra al opositor. Debe describir SU examen, no el de otro. */
    etiqueta: string
  }
  /**
   * Ensayo del SEGUNDO ejercicio, cuando la oposición tiene dos y el segundo no es
   * un test. `simulacroCompleto` solo cubre uno por oposición, y en Hacienda ese
   * uno es el primero: quien se juega la plaza en los supuestos —los 30 de los 40
   * puntos del proceso— no ensayaba nunca su examen entero, solo supuestos sueltos
   * de 45 minutos. La destreza que decide esa prueba es repartir dos horas y media
   * entre diez supuestos escritos a mano, y esa no se entrena de uno en uno.
   *
   * El módulo YA existe y hace el examen entero (SimulacroRunnerHaciendaSegundo:
   * diez supuestos, cronómetro de 150 min, respuesta escrita o fotografiada,
   * corrección contra rúbrica al entregar y nota 0-30). Lo que faltaba era que el
   * plan lo pusiera en el calendario, y no que dependiera de que al opositor se le
   * ocurriera ir a buscarlo al menú de simulacros.
   */
  simulacroSegundoEjercicio?: {
    /** Duración real del ejercicio, de su convocatoria. La sesión los OCUPA. */
    minutos: number
    /** Cada cuántos días se propone, dentro de las fases donde toca. */
    cadaDias: number
    /** Cómo se le nombra al opositor. Debe describir SU examen. */
    etiqueta: string
    /**
     * Los dos ejercicios se celebran EL MISMO DÍA, así que el segundo no tiene
     * fecha propia ni fase `sprint_practico` detrás del primero. Sin esto, el
     * ensayo solo se programaba en ese sprint (o en la recta final de quien
     * conserva la nota del primero) y en Gestión Civil no salía NUNCA, siendo la
     * mitad de su nota. Con `true`, la recta final ensaya los dos, en días
     * distintos, mientras el plan no tenga sprint.
     *
     * Se declara y no se deduce de «no hay fecha del 2.º»: en Agentes de Hacienda
     * esa fecha puede faltar solo porque la convocatoria aún no la publica, y su
     * recta final es la del primer ejercicio, que es eliminatorio.
     */
    mismoDiaQueElPrimero?: boolean
  }
  /**
   * QUÉ EJERCICIO prepara la cola `sprint_practico` —y con ella su ensayo
   * `simulacroSegundoEjercicio`—, dicho por ORDINAL y no por el nombre del campo.
   *
   * Existe por una trampa concreta y cara. La cola es el tramo que va del primer
   * examen a la segunda fecha que trae la convocatoria, y el campo que la ensaya
   * se llama `simulacroSegundoEjercicio` porque nació con Agentes de la Hacienda
   * Pública. Pero en el Técnico de Hacienda ese mismo campo designa el TERCER
   * ejercicio (lo dice su propia etiqueta) y su cola apunta al 3-jul-2027, que es
   * la fecha del tercero. Un apagado escrito como «conserva el 2.º → quita
   * `simulacroSegundoEjercicio` y la cola» le quitaría al Técnico el ensayo y el
   * tramo del examen que SÍ hace: la misma palabra —«el segundo»— nombrando dos
   * ejercicios distintos en dos cuerpos distintos.
   *
   * Así que el apagado cuelga de ESTE dato, no del nombre del campo. Sin declarar
   * —que es el caso de las otras cinco— no hay cola que apagar y nada cambia;
   * `'tercero'` significa «esta cola prepara un ejercicio que no se puede
   * conservar», así que tampoco se apaga nunca.
   */
  ejercicioDeLaCola?: 'segundo' | 'tercero'
  /**
   * Esta convocatoria permite CONSERVAR la nota del primer ejercicio y presentarse
   * solo al segundo. Declararlo aquí es lo único que habilita la pregunta en el
   * plan: donde no se declara, no se ofrece — y así una oposición de ejercicio
   * único no puede quedarse sin la mitad del temario por un despiste.
   *
   * En Agentes de Hacienda es la base 6.2 de BOE-A-2025-27056: quien supera el
   * primer ejercicio y no obtiene plaza conserva la calificación en la convocatoria
   * inmediata siguiente, siempre que participe por la misma forma de acceso y los
   * ejercicios sean esencialmente análogos. Hay que pedirlo en la solicitud, así
   * que el opositor lo sabe con certeza: lo declara él, nunca lo deducimos nosotros.
   *
   * Qué bloques se quedan fuera NO se escribe aquí: se DERIVA de los pesos de la
   * base (`peso_practico === 0`), porque el segundo ejercicio es el práctico y un
   * bloque que no pesa nada en él no entra en ese examen. Así, el día que se
   * recalibren los pesos de una oposición, la exención se ajusta sola en vez de
   * quedarse apuntando a unos números de bloque que ya no significan lo mismo.
   */
  exencionPrimerEjercicio?: {
    /** El examen que SÍ hace, tal y como se le nombra en pantalla. */
    ejercicioRestante: string
  }
  /**
   * QUÉ PERMITE CONSERVAR LA CONVOCATORIA, con su cita. Es la NORMA; los dos
   * campos de arriba (`exencionPrimerEjercicio`, `ejercicioDeLaCola`) son la
   * MÁQUINA: qué sabe apagar el plan. Se usan juntos y no son intercambiables —
   * confundirlos es lo que hizo que a Agente de la Hacienda Pública se le
   * ofreciera «conservo el 2.º ejercicio» sin ninguna base detrás.
   *
   * Para que una opción se ofrezca hacen falta las dos cosas: que la norma la
   * permita (aquí) y que el plan tenga algo que hacer con ella (allí). Sin lo
   * primero se promete lo que la convocatoria no da; sin lo segundo se pregunta
   * algo que no mueve ni una sesión.
   *
   * De aquí sale también la frase de la caducidad que lee el opositor
   * (`textoDeCaducidad`), que antes estaba escrita fija en la pantalla.
   *
   * ⚠️ SIN CAMPO NO SE PREGUNTA NADA, y ese es el lado prudente: es lo que hacen
   * hoy Administrativo del Estado, Auxiliar, Seguridad Social, Guardia Civil y
   * Gestión Civil. Una oposición se queda sin campo mientras no se haya leído su
   * base; nunca se rellena de memoria ni por parecido con otra.
   */
  conservacionDeNota?: ConservacionDeNota
  /**
   * Bloques SIN banco de test POR DISEÑO: se examinan por escrito. No es un bloque
   * al que aún le faltan preguntas, es uno en el que el test no existe ni va a
   * existir (el anexo I.1.4 del Técnico de Hacienda). De ahí salen dos cosas:
   * - el «Dominio del tema» de sus temas se reparte entre flashcards y casos, y el
   *   anillo no le guarda un sector a unos tests que nunca tendrán datos;
   * - su % de bloque —el que alimenta la liga Dominio de logros y los títulos—
   *   sale de los aciertos en minicasos y supuestos, porque sin tests se quedaba
   *   a 0 para siempre y dejaba inalcanzables los logros de «todos los bloques».
   * Solo lo declara quien lo tiene: ninguna de las oposiciones vivas lleva el
   * campo, y sin él todo se comporta exactamente como antes.
   */
  bloquesSinTest?: ReadonlyArray<number>
  /**
   * Escribir y corregir un supuesto en el «examen real» cuenta como actividad: da XP
   * y sostiene la racha, como un supuesto de práctica. Hoy solo el Técnico de
   * Hacienda, donde escribir es lo que más se practica (decidido el 26-sep-2026);
   * la misma pantalla la usan Agentes de Hacienda y Gestión Civil, y a ellas no les
   * cambia nada mientras no lo declaren.
   */
  actividadAlEscribir?: boolean
}

// C1 Administrativo — EXACTAMENTE el comportamiento previo (era hardcode en
// perfiles.ts: minicasos n∈[2,5], supuestos n∈[3,5], test-intensivo n===6,
// práctica temprana n∈[3,5]). NO tocar sin querer cambiar el plan del C1.
export const REGLAS_C1: ReglasOposicion = {
  bloquesConMinicasos:     [2, 3, 4, 5],
  bloquesConSupuestos:     [3, 4, 5],
  bloqueTestIntensivo:     6,
  bloquesPracticaTemprana: [3, 4, 5],
  psicotecnicos:           false,
  // Histórico exacto: 1ª sesión lectura 70% + flashcards 30% (sin test);
  // 2ª+ lectura 50% y del resto test 55% / flashcards 45%.
  descubrimiento: {
    primera: { pctLectura: 0.70, conTest: false, testDelResto: 0 },
    resto:   { pctLectura: 0.50, conTest: true,  testDelResto: 0.55 },
  },
  // Histórico (sin cambios): lectura medida ~147 h → ~1.000-1.200 h. Subir a 3.1
  // si se quiere fijar Administrativo en exactamente ~1.200 h.
  factorPractica: 2.5,
  ratioMinPorPregunta: 100 / 90,   // examen AGE: 90 preg / 100 min (histórico, sin cambio)
  penalizacionPorError: 1 / 3,   // BOE-A-2025-26262: «un tercio del valor de una respuesta correcta»
  // «+ supuesto práctico» se quedaba corto y escondía lo que más se juega: el BOE
  // (anexo III, base 2.2) dice «uno a elegir entre dos», y esa elección —qué caso
  // coges y en cuánto lo decides— es media nota. El simulacro ya la entrena; el
  // texto no lo contaba.
  simulacroCompleto: { minutos: 100, cadaDias: 7, etiqueta: 'Ejercicio único: 70 preguntas y un supuesto práctico a elegir entre dos' },
}

// Cuerpo General Auxiliar de la AGE — sin minicasos ni supuestos (su temario no
// los tiene); el peso de la ofimática lo da el pct_tiempo de sus temas, no un
// sesgo de bloque; y SÍ lleva psicotécnicos.
//
// ⚠️ NO "CORRIJAS" SUS PESOS SIN LEER ESTO. El `pct_tiempo` del Auxiliar reparte
// 57,7 % al Bloque I (jurídico) y 42,3 % al II (actividad administrativa +
// ofimática), mientras que el examen es 37,5 % / 62,5 % de las preguntas
// puntuables. Parece invertido y NO lo es: `pct_tiempo` es un presupuesto de
// TIEMPO que mezcla coste y valor, no una cuota de preguntas. El bloque jurídico
// es el que más cuesta entender, así que necesita más horas por pregunta que la
// ofimática, que se aprende repitiendo. Es una decisión deliberada de Álvaro
// (ago-2026), tomada sabiendo el reparto real del examen. Una auditoría que mire
// solo el % de preguntas la marcará como defecto: no lo es.
export const REGLAS_AUXILIAR: ReglasOposicion = {
  bloquesConMinicasos:     [],
  bloquesConSupuestos:     [],
  bloqueTestIntensivo:     null,
  bloquesPracticaTemprana: [],
  psicotecnicos:           true,
  // Muy práctico (test desde el día 1, menos lectura):
  //   1ª sesión: lectura 40% + test 40% + flashcards 20%  (test = 0.667 del resto)
  //   2ª+:        lectura 30% + test 50% + flashcards 20%  (test = 0.714 del resto)
  descubrimiento: {
    primera: { pctLectura: 0.40, conTest: true, testDelResto: 0.667 },
    resto:   { pctLectura: 0.30, conTest: true, testDelResto: 0.714 },
  },
  // C2, ~750 h. La lectura medida sube a ~58 h SOLO con dificultad/densidad
  // pobladas (derivadas del C1 para los comunes); con ellas, ×5.45 → ~750 h.
  factorPractica: 5.45,
  ratioMinPorPregunta: 90 / 110,   // examen: 110 preg (60 test + 50 ofimática) / 90 min → rápido
  penalizacionPorError: 1 / 3,   // BOE-A-2025-26262: mismo cuerpo de bases que el Administrativo
  simulacroCompleto: { minutos: 90, cadaDias: 7, etiqueta: 'Ejercicio único: 60 preguntas + 50 de ofimática' },
}

// Agentes de la Hacienda Pública (AEAT) — vertical fiscal. La práctica (minicasos
// + supuestos) está TODA en el Bloque III (verificado en BD jul-2026: 222 minicasos
// + 82 supuestos originales + 39 oficiales, todos B3); sin psicotécnicos. El 2º
// ejercicio (10 supuestos) versa solo sobre el Anexo III.3 fiscal = B III.
// Descubrimiento "intermedio": test desde
// el día 1 pero conservando bastante lectura, por ser temario fiscal denso.
export const REGLAS_HACIENDA: ReglasOposicion = {
  bloquesConMinicasos:     [3],
  bloquesConSupuestos:     [3],
  bloqueTestIntensivo:     null,
  bloquesPracticaTemprana: [3],
  psicotecnicos:           false,
  descubrimiento: {
    // 1ª sesión: lectura 50% + test 30% + flashcards 20%  (test = 0.6 del resto)
    primera: { pctLectura: 0.50, conTest: true, testDelResto: 0.6 },
    // 2ª+:      lectura 40% + test 40% + flashcards 20%  (test = 0.667 del resto)
    resto:   { pctLectura: 0.40, conTest: true, testDelResto: 0.667 },
  },
  // ~1.500 h (elección del usuario). Temario corto (lectura ~58 h) pero muy de
  // práctica: cientos de supuestos numéricos → la práctica es el grueso (×12).
  factorPractica: 12.0,
  ratioMinPorPregunta: 90 / 80,   // 1er ejercicio (test): 80 preg / 90 min (penaliza −¼)
  penalizacionPorError: 1 / 4,   // BOE-A-2025-27056: −¼ en el 1er ejercicio (el 2º se redacta)
  simulacroCompleto: { minutos: 90, cadaDias: 7, etiqueta: '1.er ejercicio: 80 preguntas tipo test' },
  // BOE-A-2025-27056: «un cuestionario con diez supuestos prácticos… El tiempo
  // máximo para la realización de este ejercicio será de dos horas y treinta
  // minutos… Se calificará de 0 a 30 puntos, siendo necesario obtener un mínimo
  // de 15». Cada dos semanas y no cada una como el test: son 150 minutos seguidos
  // más la corrección, y el banco de supuestos con rúbrica —122 casos— da para
  // doce ensayos sin repetir ninguno.
  simulacroSegundoEjercicio: { minutos: 150, cadaDias: 14, etiqueta: '2.º ejercicio: 10 supuestos por escrito' },
  // Su cola `sprint_practico` va del 1.er examen al 2.º, y su ensayo es el del 2.º:
  // aquí el nombre del campo y el ordinal coinciden. Es la ÚNICA de las cinco vivas
  // donde declarar «conservo el 2.º» tiene algo que apagar.
  ejercicioDeLaCola: 'segundo',
  // Es la única de las cinco con dos ejercicios en fechas distintas, y por eso la
  // única donde se puede llegar guardando la nota del primero. Lo pidió un opositor
  // que aprobó el test y solo se presenta a los supuestos: el plan le seguía
  // programando la Constitución.
  exencionPrimerEjercicio: { ejercicioRestante: '2.º ejercicio (supuestos prácticos)' },
  // LA NORMA, base 6.2 de BOE-A-2025-27056 (comprobada en el BOE el 29-sep-2026):
  // quien supera el primer ejercicio y no obtiene plaza conserva la calificación
  // en la convocatoria inmediata siguiente —DOS en promoción interna—, siempre
  // que participe por la misma forma de acceso y los ejercicios sean
  // esencialmente análogos. Se pide en la solicitud: no es automático.
  //
  // SOLO EL PRIMERO. Aquí no hay nada que permita conservar el 2.º, y por eso
  // dejó de ofrecerse: colgaba de `ejercicioDeLaCola`, que describe el plan y no
  // la convocatoria.
  conservacionDeNota: {
    base: 'base 6.2 de BOE-A-2025-27056',
    porTurno: true,
    libre: {
      ejercicios: ['primero'],
      convocatorias: 1,
      exigeEjerciciosAnalogos: true,
    },
    promocion_interna: {
      ejercicios: ['primero'],
      convocatorias: 2,
      exigeEjerciciosAnalogos: true,
    },
  },
}

// Administrativo de la Administración de la Seguridad Social — 2 bloques: I general
// (Anexo I.A) y II específico de SS (Anexo I.B). TODA la práctica está en el Bloque II
// (verificado en BD jul-2026: 119 minicasos + 22 supuestos originales + 6 oficiales en B2),
// porque el supuesto práctico del examen solo puede versar sobre el Anexo I.B (BOE-A-2025-27158).
// Hay además 7 minicasos en B I (materias comunes) que MinicasosList oculta por fidelidad (no
// son práctica de examen).
//
// ⚠️ ESOS 7 NO SON UN OLVIDO — no añadir el 1 a `bloquesConMinicasos`. Auditado 17-sep-2026:
// SS-MC-120 a 126 (temas 8, 16, 17, 18, 19, 20 y 22 del B I) existen, son BUENOS —53 preguntas
// contestables, todas con 4 opciones, explicación y artículo; correcta repartida 13/13/13/14;
// la más larga solo en 7 de 53— y el motor no los sirve NUNCA en ninguna configuración.
// Aun así se quedan fuera, por dos razones medidas:
//   1. FIDELIDAD. El BOE es literal: «El supuesto vendrá desglosado en quince preguntas […]
//      relacionadas con las materias del programa detallado en el anexo I. B». Programarlos
//      sería etiquetar como «caso práctico» materia que el supuesto no puede tocar, en una
//      parte ELIMINATORIA. (Coste real de `[1, 2]`, medido con el arnés sobre el contenido
//      vivo: solo 1 y 2 casos del B2 en las configuraciones apretadas, 0 en la intensa, y los
//      supuestos oficiales no se retrasan ni un día. Es barato; es que no debe hacerse.)
//   2. NO SE PIERDE NADA. Su materia ya la cubre el banco de test, que es la puerta que SÍ
//      examina el anexo I.A (1.ª parte, 70 preguntas sobre «el anexo I. A. y B»). El B I de
//      SS tiene 4.223 preguntas vía `tema_epigrafe`, y los 7 temas en cuestión 272, 90, 113,
//      194, 547, 170 y 76. ⚠️ Contarlas por `tema_id` da 190 y parece un desierto: es la
//      consulta equivocada — la app sirve por `epigrafe_id` (ver `lib/oposicionScope.ts`).
//
// Ojo: con
// REGLAS_C1 heredaría supuestos en [3,4,5] → NUNCA programaría práctica de supuestos, y
// esa parte es ELIMINATORIA. Sin bloque test-intensivo (no hay ofimática) ni psicotécnicos.
// Práctica temprana en B2: el supuesto es eliminatorio y se entrena con automatismo.
export const REGLAS_SS: ReglasOposicion = {
  bloquesConMinicasos:     [2],
  bloquesConSupuestos:     [2],
  bloqueTestIntensivo:     null,
  bloquesPracticaTemprana: [2],
  psicotecnicos:           false,
  // Examen 100% test en sus DOS partes (70 teóricas + supuesto de 15 tipo test) sobre
  // temario jurídico denso → mezcla "intermedia" como Hacienda: test desde el día 1
  // conservando bastante lectura.
  descubrimiento: {
    // 1ª sesión: lectura 50% + test 30% + flashcards 20%  (test = 0.6 del resto)
    primera: { pctLectura: 0.50, conTest: true, testDelResto: 0.6 },
    // 2ª+:      lectura 40% + test 40% + flashcards 20%  (test = 0.667 del resto)
    resto:   { pctLectura: 0.40, conTest: true, testDelResto: 0.667 },
  },
  // ~940 h (elección del usuario). Temario corto para un C1: lectura medida 67,1 h
  // (358.000 palabras / 36 temas, frente a las 146,7 h y 820.000 del Administrativo),
  // pero el grueso es práctica → ×6.0. Queda algo por debajo del Administrativo del
  // Estado (1.027 h), que es del mismo grupo y con examen de la misma forma pero con
  // un temario más del doble de largo.
  factorPractica: 6.0,
  ratioMinPorPregunta: 120 / 85,   // examen: 85 preg (70 teórica + 15 supuesto) / 120 min (−¼)
  penalizacionPorError: 1 / 4,   // BOE-A-2025-27158: −¼ en las dos partes
  simulacroCompleto: { minutos: 120, cadaDias: 7, etiqueta: 'Ejercicio único: 70 preguntas + supuesto de 15' },
}

// Guardia Civil · Escala de Cabos y Guardias. Es la primera oposición cuyo examen
// son CINCO pruebas independientes, no un temario con práctica: conocimientos (100
// pts), psicotécnica (30), inglés (20) y, sin puntuar pero ELIMINANDO, ortografía y
// gramática. No tiene minicasos ni supuestos.
//
// CALIBRACIÓN DE LOS DRILLS — la reparte la tasa oficial de NO APTO de cada prueba
// (fichero de resultados de la Guardia Civil, ingreso libre), no la intuición:
//     gramática 47,0% (2026) · inglés 35,7% (2025) · ortografía 22,1% (2026) · psico ~20%
// La gramática pasó del 8,0% al 47,0% en un solo año: el tribunal subió el listón.
// Es la prueba que más elimina por hora invertida de toda la oposición y el mercado
// la trata como residual. Por eso ortografía y gramática van DIARIAS y marcadas como
// eliminatorias: el plan no las recorta nunca para hacer sitio a más temario.
//
// OJO al objetivo: con 50/100 se aprueba conocimientos, pero solo el 23,5% de los
// presentados llega ahí y la plaza la da superar el corte (~98-103 puntos), no
// aprobar. Un plan calibrado a "aprobar" está calibrado al percentil 23.
export const REGLAS_GC: ReglasOposicion = {
  bloquesConMinicasos:     [],
  bloquesConSupuestos:     [],
  bloqueTestIntensivo:     null,
  bloquesPracticaTemprana: [],
  psicotecnicos:           true,
  pruebasFisicas:          true,   // resistencia, circuito, extensiones y natación
  drills: [
    // eliminatorias primero: son las que nunca se recortan
    { tipo: 'gramatica',     cada: 1, minutos: 15, eliminatoria: true  },
    { tipo: 'ortografia',    cada: 1, minutos: 12, eliminatoria: true  },
    { tipo: 'ingles',        cada: 1, minutos: 30, eliminatoria: false },
    { tipo: 'psicotecnicos', cada: 1, minutos: 18, eliminatoria: false },
  ],
  // Examen 100% test en sus cinco pruebas y temario corto (247.805 palabras, menos
  // de un tercio que el Administrativo) → mezcla intensiva en test, cercana a la del
  // Auxiliar pero con algo más de lectura por ser temario jurídico.
  descubrimiento: {
    // 1ª sesión: lectura 45% + test 36% + flashcards 19%
    primera: { pctLectura: 0.45, conTest: true, testDelResto: 0.65 },
    // 2ª+:      lectura 35% + test 45% + flashcards 20%
    resto:   { pctLectura: 0.35, conTest: true, testDelResto: 0.70 },
  },
  // Objetivo ~1.000 h de estudio TEÓRICO (banda 900-1.200). Aritmética con la misma
  // fórmula que el resto: lectura medida estimada 44,3 h (proporcional al C1 por nº
  // de palabras) × (1+1 vueltas) × (1+10,3) ≈ 1.002 h.
  // ⚠️ RECALIBRAR TRAS EL VOLCADO: `minutos_lectura` sale de la BD y depende de que
  // dificultad y densidad estén pobladas; hasta entonces 44,3 h es una estimación.
  // ⚠️ Las ~1.000 h NO son un dato de ninguna fuente: no existe ni un estudio ni una
  // cifra oficial de horas. Es una construcción (meses × horas/día × 6 días × factor
  // de efectividad 0,75) contrastada con lo que declaran academias y opositores. NO
  // mostrarla al usuario como "según los datos"; en pantalla, meses × horas/día.
  factorPractica: 10.3,
  ratioMinPorPregunta: 140 / 120,   // conocimientos (100) + inglés (20) = 120 preg / 140 min
  penalizacionPorError: 1 / 3,   // BOE-A-2026-9982: −⅓; ortografía y gramática van por nº de fallos
  simulacroCompleto: { minutos: 140, cadaDias: 7, etiqueta: 'Bloque teórico: ortografía, gramática, conocimientos e inglés' },
}

// Cuerpo de GESTIÓN de la Administración Civil del Estado (A2, código 1122).
// Convocatoria vigente: BOE-A-2025-26262, ANEXO VII (ingreso libre). Ojo: es la
// MISMA resolución que el Administrativo (anexo III) y el Auxiliar, pero el examen
// no se parece. El anexo VIII es el de promoción interna y NO está modelado aquí.
//
// Programa: 58 temas en 6 bloques (I Organización del Estado 11 · II Unión Europea 6 ·
// III Políticas públicas 10 · IV Derecho administrativo 13 · V RRHH 10 · VI Gestión
// financiera 8). La numeración de tema REINICIA en cada bloque: hay seis «tema 1».
//
// LA TRAMPA DE ESTE CUERPO: su penalización es de un tercio, igual que la del
// Administrativo. Si esta entrada no existiera, heredaría REGLAS_C1 y el error
// sería casi invisible —el único número que se suele comprobar coincide— mientras
// todo lo demás miente: el C1 es un ejercicio ÚNICO de 70+20 preguntas en 100
// minutos, y esto son dos ejercicios de 90 y 150. Y en promoción interna, mismo
// cuerpo, la penalización es de un CUARTO (anexo VIII, norma 3.1.1).
//
// La práctica va SOLO a los bloques 4, 5 y 6 porque así lo acota el BOE: el segundo
// ejercicio consiste en «la resolución por escrito de un supuesto práctico de 5
// preguntas, a elegir entre dos propuestos relacionados con materias de los bloques
// IV, V y VI del programa». Los bloques I, II y III solo se examinan en el test.
// (Esto presupone que al volcar el contenido los bloques se numeran 1-6 siguiendo
// el orden del anexo: I→1 … VI→6.)
//
// Sin bloque test-intensivo (no hay ofimática) y sin psicotécnicos.
// Sin `exencionPrimerEjercicio`: los dos ejercicios se celebran EL MISMO DÍA
// (norma común 8.6), así que no hay nota que conservar de una convocatoria a otra.
export const REGLAS_GESTION_CIVIL: ReglasOposicion = {
  // Hoy no hay ni un minicaso de Gestión Civil en la base (volcado del 17-sep-2026:
  // solo los 18 supuestos oficiales del 2.º ejercicio), y aun así esta lista NO se
  // deja vacía. Dos motivos, medidos en el motor:
  //   · un bloque «con minicasos» sin casos no genera pasos vacíos: el cierre de tema
  //     y la casilla de caso solo sirven un minicaso que exista (elegirMinicasoDelTema
  //     y minicasosPendientesDelTema miran `contenido.minicasos`), así que el cierre
  //     sale como test y la casilla cae a temario;
  //   · esta lista es además la de «bloques de práctica» con la que la fase 2 decide
  //     cuándo servir los supuestos OFICIALES (puedeProgramarOficial): vacía, los 18
  //     oficiales no se programarían nunca antes de la recta final.
  // Cuando se escriban minicasos, entrarán solos en los bloques IV, V y VI.
  bloquesConMinicasos:     [4, 5, 6],
  // Los oficiales son transversales (bloque «Caso transversal…», sin número), y su
  // capa tipo test es la que sirve el plan. Los bloques IV, V y VI son los que pesan
  // en el práctico (`peso_practico` 0,533, 0,317 y 0,150 en la base).
  bloquesConSupuestos:     [4, 5, 6],
  bloqueTestIntensivo:     null,
  bloquesPracticaTemprana: [4, 5, 6],
  psicotecnicos:           false,
  // Mezcla "intermedia", la misma de Seguridad Social y Hacienda: test desde el
  // primer día conservando bastante lectura. No es una copia por comodidad: el
  // estudio de sus 836 preguntas oficiales (2018-2025) mide que el 69 % cita la
  // norma o el artículo en el propio enunciado. Es un examen de reconocer el
  // precepto, y eso se entrena contestando desde el principio, no solo leyendo.
  descubrimiento: {
    // 1ª sesión: lectura 50% + test 30% + flashcards 20%
    primera: { pctLectura: 0.50, conTest: true, testDelResto: 0.6 },
    // 2ª+:      lectura 40% + test 40% + flashcards 20%
    resto:   { pctLectura: 0.40, conTest: true, testDelResto: 0.667 },
  },
  // ⚠️ PROVISIONAL, y es el único número de esta entrada que no sale del BOE.
  // `factorPractica` se calibra sobre la carga de lectura MEDIDA (palabras ×
  // dificultad × densidad) y aquí todavía no hay temario escrito que medir.
  // Se parte del 6.0 de Seguridad Social —el cuerpo de perfil más parecido: jurídico
  // denso, sin drills ni supuestos numéricos— y se sube un escalón porque su segundo
  // ejercicio se ESCRIBE: 150 minutos de prosa por ensayo, frente al supuesto tipo
  // test de la SS. RECALIBRAR en cuanto los 58 temas estén en la base y se pueda
  // medir la lectura real, igual que se hizo con los otros cinco cuerpos.
  factorPractica: 7.0,
  ratioMinPorPregunta: 90 / 100,   // anexo VII, 2.1.1: «un máximo de 100 preguntas» en «noventa minutos» → 54 s/pregunta, el ritmo más apretado de las seis
  penalizacionPorError: 1 / 3,   // BOE-A-2025-26262, anexo VII 2.1.1: «un tercio del valor de una respuesta correcta» (en promoción interna, anexo VIII, es un cuarto)
  simulacroCompleto: { minutos: 90, cadaDias: 7, etiqueta: '1.er ejercicio: 100 preguntas tipo test' },
  // El segundo ejercicio vale la mitad de la nota y es el PRIMER criterio de
  // desempate (anexo VII, 2.2.4), así que quien no lo ensaya entero no ensaya lo
  // que decide su plaza. Cada dos semanas, como en Hacienda: son 150 minutos
  // seguidos de escritura y no tiene sentido semanal. Y va en la recta final, junto
  // al ensayo del test pero en otro día, porque los dos ejercicios son el mismo día
  // y no hay un tramo entre uno y otro donde ensayarlo (ver `mismoDiaQueElPrimero`).
  simulacroSegundoEjercicio: {
    minutos: 150, cadaDias: 14, etiqueta: '2.º ejercicio: un supuesto práctico a elegir entre dos, por escrito',
    mismoDiaQueElPrimero: true,
  },
}

/**
 * Cuerpo Técnico de Hacienda (A2, AEAT). Convocatoria BOE-A-2025-27149.
 *
 * Es la única de las seis con TRES ejercicios, y ninguno se parece al del wedge:
 *   1.º Test de 100 preguntas, cuatro opciones, penaliza ¼, 1 h 40 → 0-20 puntos.
 *      Sale de los anexos I.1.1 (Civil, Mercantil y Economía) e I.1.2
 *      (Constitucional y Administrativo), que son sus bloques 1 y 2.
 *   2.º Cinco supuestos de Contabilidad y Matemática Financiera, 4 h → 0-30.
 *      NO es un bloque: vive en el módulo horizontal de contabilidad.
 *   3.º Dos partes en una sesión, ambas eliminatorias → 0-40, el que más pesa:
 *      un cuestionario ESCRITO de hasta 20 preguntas del anexo I.1.4 (2 h 30) y
 *      un TEMA extraído al azar que se desarrolla por escrito y se lee ante el
 *      tribunal (1 h 30). Cada parte 0-20 y sin compensación por debajo de 8.
 */
export const REGLAS_TECNICO: ReglasOposicion = {
  // Los minicasos y los supuestos propios están donde está la práctica: el anexo
  // I.1.4, que es el bloque 3. Los bloques 1 y 2 se examinan SOLO por test.
  // Estuvo en [] mientras no había material escrito; el 12-sep-2026 se volcaron
  // los 255 minicasos del anexo I.1.4 —cubren sus 38 temas— y por eso ya va a [3].
  //
  // ⚠️ El 3 NO se deduce del rótulo del bloque. Los tres anexos de este cuerpo son
  // I.1.1, I.1.2 y I.1.4: NO existe un I.1.3, así que «I.1.4» es el bloque 3 por
  // convenio y no por aritmética. De ahí que `minicasos.bloque` guarde el romano
  // 'III', igual que en las otras cinco oposiciones, y nunca el rótulo largo:
  // MinicasosList filtra con `parseBloqueLead`, que lee el primer romano suelto, y
  // de «Anexo I.1.4. Derecho Financiero…» sacaría 1 — los 255 casos quedarían
  // invisibles sin error. Lo ata minicasos_filtro_fidelidad.test.ts.
  bloquesConMinicasos:     [3],
  bloquesConSupuestos:     [3],
  // El 1.er ejercicio es test de los anexos I.1.1 y I.1.2 (bloques 1 y 2); el I.1.4
  // se examina ESCRIBIENDO. El bloque 3 no tiene ni tendrá banco de test.
  bloquesSinTest:          [3],
  actividadAlEscribir:     true,
  // Ningún bloque concentra el test como el VI del Administrativo (43 %): aquí el
  // reparto es 59/41 entre los dos anexos del primer ejercicio.
  bloqueTestIntensivo:     null,
  // El tercer ejercicio son 40 de los 90 puntos del proceso y se ESCRIBE: la
  // destreza de redactar contra reloj no se improvisa en el último mes.
  bloquesPracticaTemprana: [3],
  psicotecnicos:           false,
  // ── El 2.º ejercicio, que no es un bloque ────────────────────────────────
  // Contabilidad y Matemática Financiera: cinco supuestos en cuatro horas, 30 de
  // los 90 puntos, eliminatorio con un mínimo de 15. No cuelga de ningún bloque
  // —los tres del cuerpo son los anexos I.1.1, I.1.2 y I.1.4—, así que sin carril
  // el plan le dedicaba cero minutos todos los días.
  //
  // DE DÓNDE SALEN LAS CIFRAS. El reparto por tramos y el suelo son la decisión de
  // Álvaro medida en el simulador propio del planificador (siete diseños, tres
  // jueces por diseño, 305 días naturales sobre los datos reales del cuerpo):
  //   · 0,25 en campaña larga. No sale de la simulación del tercer ejercicio —que
  //     no modela la nota del segundo— sino de dos cosas que sí se pueden contar:
  //     la banda de los aprobados recientes dedica a contabilidad entre el 17 y el
  //     33 % del día, y por debajo de 0,25 la media tirada de supuestos deja de
  //     caber (0,20 da 2,0 h/semana; 0,25 da 3,8). Las 12 h semanales que
  //     recomienda una academia no se alcanzan en ningún escenario realista (a
  //     3 h/día son 3,8; a 8 h/día, 11,7) y chocan de frente con esa banda.
  //   · 0,20 en la punta del primero. El primero es eliminatorio y manda, pero
  //     contabilidad NO se apaga: es lo unánime entre los aprobados.
  //   · 0,55 en la ventana entre el primero y el segundo, que es cuando el segundo
  //     es justo lo que tiene delante. Es un mando, con rango de 0,35 a 0,75: las
  //     fuentes se contradicen (mitad y mitad frente a 60-70 % al tercero).
  //   · Suelo `min(30, 0,40 × jornada)`: por debajo de 20 minutos no cabe ni un
  //     caso encadenado y el suelo sería de papel; por encima de 45, a 1,5 h/día se
  //     come media jornada.
  //   · Techo del 60 % del día, para que la ventana no deje el temario sin nada.
  //
  // FUENTE de la decisión: los aprobados la llevan a diario («al menos una hora
  // diaria») y en la recopilación del foro consta que «la contabilidad no admite
  // atracón». Por eso es suelo y no cuota: nunca cero, ningún día, hasta su examen.
  carrilTransversal: {
    tipo:          'contabilidad',
    suelo:         30,
    fraccionSuelo: 0.40,
    techo:         0.60,
    cuota: { campana_larga: 0.25, punta_primero: 0.20, ventana: 0.55 },
    etiqueta:      '2.º ejercicio: Contabilidad',
  },
  // Mezcla intermedia, la de Seguridad Social, Hacienda y Gestión Civil: test
  // desde el primer día conservando bastante lectura. Encaja con un cuerpo cuyo
  // primer ejercicio es test puro pero cuyo temario hay que llegar a redactarlo.
  descubrimiento: {
    // 1ª sesión: lectura 50% + test 30% + flashcards 20%
    primera: { pctLectura: 0.50, conTest: true, testDelResto: 0.6 },
    // 2ª+:      lectura 40% + test 40% + flashcards 20%
    resto:   { pctLectura: 0.40, conTest: true, testDelResto: 0.667 },
  },
  // El temario más grande de las seis con diferencia: 1.539.056 palabras medidas
  // (865.468 del 1.er ejercicio en 46 temas + 673.588 del 3.º en 38), frente a las
  // 819.917 del Administrativo. Al ritmo con el que se calibraron las otras cinco
  // (~5.600 palabras/hora) son ~276 h solo de lectura, y con la fórmula de la casa
  // —horas ≈ lectura × 2 vueltas × (1 + factor)— un factor de 2,6 deja el plan en
  // ~1.990 h. Es casi el doble del Administrativo (1.027 h), que es lo que toca
  // para un A2 con tres ejercicios, uno de ellos de contabilidad y otro que se
  // escribe y se lee ante el tribunal. El factor es BAJO no porque se exija poco,
  // sino porque aquí el grueso ya lo pone la lectura: es lo contrario de Agentes
  // de Hacienda (×12), con temario corto y cientos de supuestos numéricos.
  // ⚠️ RECALIBRAR cuando `dificultad` y `densidad` estén pobladas: de ellas
  // depende la lectura MEDIDA que el motor lee de la base, y hoy van a NULL.
  factorPractica: 2.6,
  ratioMinPorPregunta: 100 / 100,  // BOE-A-2025-27149: «cuestionario de 100 preguntas» en «1 hora y 40 minutos» → 1 min por pregunta
  penalizacionPorError: 1 / 4,     // ídem: «cada contestación errónea se penalizará descontando un cuarto del valor de una respuesta correcta»
  simulacroCompleto: { minutos: 100, cadaDias: 7, etiqueta: '1.er ejercicio: 100 preguntas tipo test' },
  // El campo se llama `simulacroSegundoEjercicio` porque nació con Agentes de
  // Hacienda, pero lo que designa es «el ejercicio que se escribe», y en el
  // Técnico ese es el TERCERO. La etiqueta dice la verdad, que es lo que lee el
  // opositor. Cada dos semanas, como en Hacienda y Gestión Civil: son 150 minutos
  // seguidos de escritura y no tiene sentido semanal.
  simulacroSegundoEjercicio: { minutos: 150, cadaDias: 14, etiqueta: '3.er ejercicio: cuestionario escrito de hasta 20 preguntas' },
  // Y AQUÍ ESTÁ LA MITAD QUE IMPORTA: la cola de este cuerpo va al 3-jul-2027, que
  // es la fecha del TERCER ejercicio, y lo que ensaya es el tercero. Quien conserva
  // el 2.º del Técnico (Contabilidad y Matemática Financiera) se presenta al 3.º:
  // tiene que conservar el ensayo, la cola y toda la práctica del bloque 3. Lo que
  // sí deja de recibir es el carril transversal, que ES su 2.º ejercicio, y de eso
  // se ocupa `seSientaAlCarril`. Sin esta línea, el apagado del 2.º le quitaría el
  // tramo y el ensayo del examen que sí hace.
  ejercicioDeLaCola: 'tercero',
  // BOE-A-2026-2494, que corrige la base 6.3: «A las personas aspirantes que por
  // aplicación de lo previsto en las bases de la convocatoria anterior tuvieran
  // derecho a la exención del primer ejercicio y ejercieran ese derecho, se les
  // computará con la calificación prevista en las respectivas bases». Quien se
  // acoge no vuelve a examinarse del test, así que sus bloques 1 y 2 —los que
  // tienen `peso_practico = 0`— se caen solos del plan.
  exencionPrimerEjercicio: {
    ejercicioRestante: '2.º ejercicio (Contabilidad y Matemática Financiera) y 3.er ejercicio (cuestionario escrito y tema leído ante el tribunal)',
  },
  // LA NORMA, base 6.3 de BOE-A-2025-27149 («Conservación de calificaciones» de
  // acceso libre y «Conservación de calificaciones y reserva de ejercicios» de
  // promoción interna), releída en el BOE el 29-sep-2026. Se conserva lo que se
  // haya superado —el 1.º, el 2.º o LOS DOS—, por la misma forma de acceso, con
  // ejercicios esencialmente análogos, y se pide en la solicitud.
  //
  // ⚠️ SÍ DISTINGUE POR TURNO, y la primera lectura dijo que no. Las dos
  // convocatorias están en los dos lados, pero la condición no:
  //
  //   · acceso libre: «conservarán sus calificaciones en las dos convocatorias
  //     inmediatas siguientes, SIEMPRE QUE en la primera de estas dos
  //     convocatorias superen algún ejercicio adicional». La segunda está
  //     condicionada, y el párrafo tercero lo repite: «deberán superar en esta
  //     convocatoria al menos un ejercicio más que en la anterior».
  //   · promoción interna: «conservarán sus calificaciones en las dos
  //     convocatorias inmediatas siguientes.» Punto. La condición del ejercicio
  //     adicional solo aparece después, y para ALARGARLO a una tercera: «En el
  //     caso de que en la primera de las dos convocatorias inmediatas siguientes
  //     superen algún ejercicio adicional, conservarán, también, su calificación
  //     para la convocatoria inmediata siguiente.»
  //
  // Con `porTurno: false` se le decía a quien va por promoción interna que su
  // segunda convocatoria depende de aprobar un ejercicio más, y no depende. Es la
  // misma avería que esta pieza arregla, con el signo cambiado: una condición de
  // más en vez de una convocatoria de más.
  //
  // Esa tercera convocatoria de promoción interna no cabe en `convocatorias: 1 | 2`
  // y aquí no se promete: se dicen las dos que están garantizadas, que es cierto y
  // se queda corto. El día que haga falta contarla, el campo se amplía; prometer
  // de más es lo que no se puede hacer.
  conservacionDeNota: {
    base: 'base 6.3 de BOE-A-2025-27149',
    porTurno: true,
    libre: {
      ejercicios: ['primero', 'segundo'],
      convocatorias: 2,
      condicionSegunda: 'en esa siguiente superas algún ejercicio más',
      exigeEjerciciosAnalogos: true,
    },
    promocion_interna: {
      ejercicios: ['primero', 'segundo'],
      convocatorias: 2,
      exigeEjerciciosAnalogos: true,
    },
  },
}

const AUXILIAR_ID = 'd1da10aa-7671-4684-9445-727504e7baf1'
const HACIENDA_ID = '1a415277-3259-468b-9e2f-df5ff59aa562'
const SS_ID       = 'bed5cc28-f50a-44fb-9229-a347030dcd56'

// Guardia Civil ya está volcada (jul-2026) y su UUID vive en oposicionesIds.ts, así que
// `conGuardiaCivil` añade su entrada al mapa. Si ese id se vaciara, la entrada
// desaparecería sola y GC caería en REGLAS_C1, que NO le sirve: se quedaría sin sus
// cuatro drills diarios, dos de ellos eliminatorios.

// Gestión de la Administración Civil del Estado está volcada desde el 17-sep-2026,
// todavía con `activa = false`, y su id ya está en `oposicionesIds.ts`, así que
// `conOposicion` añade su entrada. Si ese id se vaciara, la entrada desaparecería
// sola y caería en REGLAS_C1, que es la trampa que documenta docs/alta-de-oposicion.md.
const POR_OPOSICION: Record<string, ReglasOposicion> = {
  [AUXILIAR_ID]: REGLAS_AUXILIAR,
  [HACIENDA_ID]: REGLAS_HACIENDA,
  [SS_ID]:       REGLAS_SS,
  ...conGuardiaCivil(REGLAS_GC),
  ...conOposicion(ID_GESTION_CIVIL, REGLAS_GESTION_CIVIL),
  ...conOposicion(ID_TECNICO_HACIENDA, REGLAS_TECNICO),
}

/** Reglas de una oposición; el wedge C1 (y cualquier id desconocido) usa REGLAS_C1. */
export function reglasParaOposicion(oposicionId: string | null | undefined): ReglasOposicion {
  return (oposicionId && POR_OPOSICION[oposicionId]) || REGLAS_C1
}

/** Tope del día que pueden ocupar los drills: el temario es la mayor palanca. */
export const TOPE_DRILLS = 0.45

/**
 * Drills que tocan HOY y con cuántos minutos cada uno. Función PURA (el motor la
 * consume y solo compone las sesiones).
 *
 * Dos garantías:
 *  · Compatibilidad — si la oposición no declara `drills`, devuelve el
 *    comportamiento histórico: un psico diario si el examen los incluye, nada si no.
 *  · Los drills no se comen el día — se topan al 45% del tiempo declarado y, si hay
 *    que recortar, se escalan en proporción; pero una prueba ELIMINATORIA nunca baja
 *    de 5 min ni desaparece, porque suspenderla deja fuera aunque el temario vaya bien.
 *
 * @param minutosDeclarados  minutos que el opositor declara para HOY (0 = sin tope).
 * @param duracionSlot       duración del slot, usada como fallback histórico del psico.
 */
export function drillsDelDia(
  reglas: ReglasOposicion,
  diaIndice: number,
  minutosDeclarados: number,
  duracionSlot: number,
): Array<{ tipo: DrillTransversal['tipo']; minutos: number; eliminatoria: boolean }> {
  const declarados: ReadonlyArray<DrillTransversal> = reglas.drills
    ?? (reglas.psicotecnicos
        ? [{ tipo: 'psicotecnicos', cada: 1, minutos: duracionSlot, eliminatoria: false }]
        : [])

  const hoy = declarados.filter(d => d.cada <= 1 || diaIndice % d.cada === 0)
  if (hoy.length === 0) return []

  let escala = 1
  if (minutosDeclarados > 0) {
    const pedido = hoy.reduce((s, d) => s + d.minutos, 0)
    const tope   = minutosDeclarados * TOPE_DRILLS
    if (pedido > tope) escala = tope / pedido
  }

  const salida: Array<{ tipo: DrillTransversal['tipo']; minutos: number; eliminatoria: boolean }> = []
  for (const d of hoy) {
    const min = d.eliminatoria
      ? Math.max(5, Math.round(d.minutos * escala))
      : Math.round(d.minutos * escala)
    if (min < 5) continue          // un drill de menos de 5 min no aporta nada
    salida.push({ tipo: d.tipo, minutos: min, eliminatoria: d.eliminatoria })
  }
  return salida
}


/**
 * ¿En qué tramo está hoy el carril transversal, o está APAGADO?
 *
 * Función PURA: el motor le pasa la fecha del día que compone, su fase y las dos
 * cosas que cambian a qué examen apunta el plan.
 *
 * EL BORDE, que es donde estaba el error fácil: el suelo termina el día del
 * ejercicio del carril, y ese día se apaga ENTERO. Escrito como «fecha > examen»
 * la mañana del examen todavía servía contabilidad, que es exactamente lo que no
 * puede pasar. Por eso la comparación es `>=`.
 *
 * Y si no se sabe cuándo es ese ejercicio (la convocatoria aún no lo publica), no
 * hay corte: el carril corre todo el plan. Apagarlo por no saber la fecha sería el
 * fallo caro, porque deja a cero justo lo que hay que garantizar.
 *
 * @param fase                 fase del plan en ese día (`Fase` de types.ts; se
 *                             recibe como cadena para no cruzar los dos módulos).
 * @param fechaEjercicio       día del ejercicio del carril, o null si no se sabe.
 * @param exencionAplicada     el opositor conserva la nota del 1.er ejercicio: la
 *                             recta final del plan ya no es la del primero, sino la
 *                             del ejercicio que sí hace.
 * @param seSientaAlCarril     ¿se presenta al ejercicio del carril? Si NO —porque
 *                             conserva su nota, o porque ya lo aprobó—, el carril
 *                             no existe para él y no hay tramo desde el día uno.
 *                             Medido en el Técnico: quien conservaba el 1.º y el
 *                             2.º recibía entre 113 y 574 horas de contabilidad de
 *                             un examen al que no se presenta, entre el 30 % y el
 *                             38 % de su plan.
 *
 *                             Es OBLIGATORIO y no opcional a propósito. Un
 *                             `seSientaAlCarril?: boolean` con `true` por defecto
 *                             sería otro valor por defecto que no avisa, que es
 *                             exactamente la avería que este campo existe para no
 *                             repetir: quien añada una tercera llamada tiene que
 *                             decir qué sabe, no heredar una suposición.
 */
/**
 * ¿SE SIENTA AL EJERCICIO DE LA COLA? Función PURA y simétrica de la del carril.
 *
 * La cola `sprint_practico` y su ensayo escrito preparan UN ejercicio concreto, y
 * cuál es lo dice la oposición en `ejercicioDeLaCola`, no el nombre del campo que
 * lo ensaya. Aquí se cruza ese dato con lo que el opositor declara conservado:
 *
 *  · sin `ejercicioDeLaCola` → no hay nada declarado que apagar, se sienta. Es el
 *    caso de las otras cuatro vivas y de Gestión Civil, que no tiene cola porque
 *    celebra sus dos ejercicios el mismo día.
 *  · `'tercero'` → el Técnico. Su cola es del 3.er ejercicio, que no se conserva
 *    por esta vía: se sienta SIEMPRE, conserve lo que conserve.
 *  · `'segundo'` → Agente de la Hacienda Pública. Solo aquí puede apagarse, y solo
 *    cuando lo declara.
 *
 * `conserva` devuelve false para `no_preguntado`: EN LA DUDA, SE PREPARA. Y quien
 * renuncia a la reserva se examina de todo, así que también se sienta.
 */
export function seSientaALaCola(reglas: ReglasOposicion, reserva: ReservaDeclarada): boolean {
  if (reglas.ejercicioDeLaCola !== 'segundo') return true
  return !conserva(reserva, 'segundo')
}

/**
 * Los hechos, fuera de las reglas, que deciden si una opción tiene algo que
 * apagar. Los cuatro son OBLIGATORIOS: quien pregunte tiene que decir qué sabe,
 * no heredar una suposición.
 */
export interface HechosDelPlan {
  /** Bloques que quedarían FUERA al conservar el 1.º: los que no pesan en el práctico. */
  bloquesFuera:    number
  /** Bloques que tiene la oposición. */
  bloquesTotales:  number
  /** El plan apunta a una fecha de examen. `false` = plan continuo. */
  planConFecha:    boolean
  /** La convocatoria publica la SEGUNDA fecha (la del ejercicio que va después). */
  haySegundaFecha: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
//   LEER LA NORMA: EL RÉGIMEN QUE LE TOCA Y LA FRASE QUE LEE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * El régimen que le toca a ESTE opositor, o `null` si la norma distingue por
 * turno y el turno no se sabe todavía.
 *
 * `null` no es «no conserva»: es «no se puede afirmar cuál de los dos». Quien lo
 * llame tiene que decidir qué hace sin él, que es exactamente lo que se le pide
 * a `textoDeCaducidad`.
 */
export function regimenDeConservacion(
  c:     ConservacionDeNota | undefined,
  turno: TurnoDeclarado,
): RegimenDeConservacion | null {
  if (!c) return null
  if (!c.porTurno) return c.unico
  if (turno === 'libre') return c.libre
  if (turno === 'promocion_interna') return c.promocion_interna
  return null
}

/**
 * Los ejercicios que se pueden conservar CON CERTEZA.
 *
 * Con el turno sin declarar y una norma que distingue por turno, la
 * INTERSECCIÓN: solo se ofrece lo que es verdad se vaya por donde se vaya.
 * Ofrecer lo que solo vale para una de las dos formas de acceso sería la misma
 * avería que esto arregla, con el signo cambiado.
 *
 * Hoy no cambia nada en ninguna oposición: las dos que distinguen por turno lo
 * hacen en cuánto dura la nota y con qué condiciones, no en QUÉ ejercicios se
 * conservan. En Agente de la Hacienda Pública los dos regímenes dicen «solo el
 * primero»; en el Técnico de Hacienda, los dos dicen «el 1.º, el 2.º o los dos».
 */
export function ejerciciosConservables(
  c:     ConservacionDeNota | undefined,
  turno: TurnoDeclarado,
): readonly EjercicioConservado[] {
  if (!c) return []
  const r = regimenDeConservacion(c, turno)
  if (r) return r.ejercicios
  if (!c.porTurno) return c.unico.ejercicios
  return c.libre.ejercicios.filter(e => c.promocion_interna.ejercicios.includes(e))
}

/** La frase de caducidad de UN régimen conocido. */
function fraseDeRegimen(r: RegimenDeConservacion): string {
  const cuantas = r.convocatorias === 1
    ? 'La nota conservada vale solo para la convocatoria inmediata siguiente.'
    : r.condicionSegunda
      ? `La nota conservada vale para la convocatoria siguiente, y para la de después solo si ${r.condicionSegunda}.`
      : 'La nota conservada vale para la convocatoria siguiente y también para la de después.'
  return r.exigeEjerciciosAnalogos
    ? `${cuantas} Y solo si los ejercicios de la convocatoria nueva son esencialmente análogos a los que aprobaste.`
    : cuantas
}

/**
 * LO QUE SE LE DICE AL OPOSITOR SOBRE LA CADUCIDAD DE SU NOTA, sacado de la
 * norma de SU oposición y de SU turno.
 *
 * Hasta el 29-sep-2026 esta frase estaba escrita fija en la pantalla y era la
 * base 6.3 del Técnico de Hacienda, que está apagado. La única viva que pinta
 * algo es Agente de la Hacienda Pública, y a esa gente se le decía que su nota
 * dura una convocatoria más de lo que le da su base. Con esa frase delante
 * alguien puede decidir no presentarse.
 *
 * `null` = no hay nada que decir, y entonces no se pinta nada. Callarse es mejor
 * que acertar a medias.
 *
 * TURNO SIN DECLARAR y norma que distingue por turno: se dice lo que es verdad
 * para los dos —el suelo común, sin el «solo» que sería falso para uno— y se le
 * pide el turno, que está justo debajo. No se elige un régimen por defecto: eso
 * es precisamente el valor por defecto callado que esta pieza existe para no
 * repetir.
 */
export function textoDeCaducidad(
  c:     ConservacionDeNota | undefined,
  turno: TurnoDeclarado,
): string | null {
  if (!c) return null
  const r = regimenDeConservacion(c, turno)
  if (r) return r.ejercicios.length > 0 ? fraseDeRegimen(r) : null
  if (!c.porTurno) return null

  const { libre, promocion_interna: pi } = c
  if (libre.ejercicios.length === 0 && pi.ejercicios.length === 0) return null
  const dicenLoMismo = fraseDeRegimen(libre) === fraseDeRegimen(pi)
  if (dicenLoMismo) return fraseDeRegimen(libre)

  // El suelo común: la convocatoria inmediata siguiente la tienen las dos formas
  // de acceso, así que decirlo no miente a ninguna. Sin «solo», que sí mentiría a
  // la que tiene dos.
  const suelo = 'La nota conservada vale para la convocatoria inmediata siguiente.'
  const masAlla = libre.convocatorias !== pi.convocatorias
    // Duran distinto: Agente de la Hacienda Pública, una por acceso libre y dos
    // por promoción interna.
    ? ' Si vale para alguna más depende de la forma de acceso: márcala aquí abajo y te lo decimos.'
    : (libre.condicionSegunda ?? '') !== (pi.condicionSegunda ?? '')
      // Duran lo mismo y la condición no es la misma: el Técnico de Hacienda,
      // que le pone a acceso libre un ejercicio adicional y a promoción interna
      // no. Sin esta rama el suelo se quedaría solo y nadie le pediría el turno.
      ? ' Si vale también para la de después, y con qué condición, depende de la forma de acceso: márcala aquí abajo y te lo decimos.'
      : ''
  const analogos = libre.exigeEjerciciosAnalogos && pi.exigeEjerciciosAnalogos
    ? ' Y solo si los ejercicios de la convocatoria nueva son esencialmente análogos a los que aprobaste.'
    : ''
  return `${suelo}${masAlla}${analogos}`
}

/**
 * QUÉ SE LE PREGUNTA AL OPOSITOR, y nada más.
 *
 * Esta es la constante única de la pieza. La casa se rompe siempre por el mismo
 * sitio: un botón gateado por una condición y lo que abre por otra. Aquí la
 * lista que se pinta en el asistente, la que se pinta en los ajustes del plan y
 * la que decide si declararlo mueve una sesión salen de esta función, y una
 * prueba genera el plan de cada oposición para comprobar que CADA opción
 * ofrecida cambia el plan y que ninguna que no se ofrece lo cambia.
 *
 * Lista vacía = no se pregunta nada. Es el caso de cuatro de las cinco vivas.
 *
 * Por qué cada condición:
 *
 *  · `primero` — solo donde la convocatoria lo declara (`exencionPrimerEjercicio`)
 *    y solo si al quitar esos bloques queda algo dentro y sabemos cuándo es el
 *    examen que sí hace. Son las mismas dos guardas que aplica el motor en su
 *    paso 0: sin ellas la pregunta ofrecería quedarse sin temario, o dejaría el
 *    plan apuntando a un examen al que no se presenta.
 *
 *  · `segundo` — LA NORMA PRIMERO, y esta es la corrección del 29-sep-2026. Antes
 *    colgaba de `ejercicioDeLaCola === 'segundo'`, que dice qué ejercicio prepara
 *    la COLA DEL PLAN y no qué permite la CONVOCATORIA: en Agente de la Hacienda
 *    Pública eso ofrecía «conservo el 2.º» sin ninguna base detrás, y su base 6.2
 *    solo deja conservar el primero. El precio de un sí equivocado estaba medido:
 *    de 57 a 224 horas, todo lo posterior al 1.er examen, para un examen que sí
 *    tendría que hacer. Ahora lo dice `conservacionDeNota`, y encima tiene que
 *    haber algo que apagar: el carril transversal (el Técnico) o la cola con su
 *    fecha. Sin norma no se ofrece aunque el plan sepa apagarlo; sin nada que
 *    apagar no se ofrece aunque la norma lo permita.
 *
 *  · `ambos` — cuando la norma permite los dos por separado, permite los dos
 *    juntos: es la misma base y no hace falta un tercer dato. En Agente de la
 *    Hacienda Pública no se ofrece porque allí no se ofrece «segundo», y además
 *    el motor le daría a quien conserva los dos exactamente el plan de quien
 *    conserva el primero (atado en `conserva_segundo_ejercicio.test.ts`).
 *
 * ⚠️ `ejercicioDeLaCola` NO desaparece: sigue siendo quien sabe qué ejercicio
 * prepara la cola y quien la apaga (`seSientaALaCola`). Lo que cambió es quién
 * decide qué se OFRECE.
 */
export function opcionesDeReserva(
  reglas: ReglasOposicion,
  hechos: HechosDelPlan,
): readonly OpcionReserva[] {
  const permite = ejerciciosConservables(reglas.conservacionDeNota, 'no_preguntado')

  const puedePrimero = permite.includes('primero')
    && Boolean(reglas.exencionPrimerEjercicio)
    && hechos.bloquesFuera > 0
    && hechos.bloquesFuera < hechos.bloquesTotales
    && (!hechos.planConFecha || hechos.haySegundaFecha)

  const puedeSegundo = permite.includes('segundo')
    && (Boolean(reglas.carrilTransversal)
        || (reglas.ejercicioDeLaCola === 'segundo' && hechos.planConFecha && hechos.haySegundaFecha))

  const puedeAmbos = puedePrimero && puedeSegundo

  if (!puedePrimero && !puedeSegundo) return []
  return [
    'ninguno',
    ...(puedePrimero ? ['primero' as const] : []),
    ...(puedeSegundo ? ['segundo' as const] : []),
    ...(puedeAmbos   ? ['ambos'   as const] : []),
  ]
}

export function tramoDelCarril(opciones: {
  fecha:             string
  fase:              string
  fechaEjercicio:    string | null
  exencionAplicada:  boolean
  seSientaAlCarril:  boolean
}): TramoCarril | null {
  const { fecha, fase, fechaEjercicio, exencionAplicada, seSientaAlCarril } = opciones
  // No se presenta a ese ejercicio: el carril no se apaga el día del examen, es
  // que nunca se enciende. Va ANTES que el corte por fecha porque no depende de
  // ninguna fecha, y con la del 3.er ejercicio en la columna el corte llegaría
  // tarde de todas formas.
  if (!seSientaAlCarril) return null
  if (fechaEjercicio && fecha >= fechaEjercicio) return null
  if (fase === 'sprint_practico') return 'ventana'
  if (fase === 'pre_examen') return exencionAplicada ? 'ventana' : 'punta_primero'
  return 'campana_larga'
}

/**
 * Minutos que el carril transversal se lleva HOY. Función PURA.
 *
 * `max(suelo, cuota × jornada)`, topado al `techo` del día. El suelo nunca puede
 * quedar por encima del techo mientras `fraccionSuelo <= techo`, así que el
 * resultado es siempre ≥ suelo: por construcción, ningún día del tramo sale a cero.
 *
 * Devuelve 0 —y solo 0— cuando la oposición no declara carril, cuando el tramo está
 * apagado (el ejercicio ya se hizo) o cuando el día no tiene minutos declarados.
 */
export function minutosCarrilDelDia(
  reglas:            ReglasOposicion,
  minutosDeclarados: number,
  tramo:             TramoCarril | null,
): number {
  const carril = reglas.carrilTransversal
  if (!carril || !tramo || minutosDeclarados <= 0) return 0

  const cuota = Math.round(carril.cuota[tramo] * minutosDeclarados)
  const techo = Math.floor(carril.techo * minutosDeclarados)
  return Math.max(1, Math.min(Math.max(sueloCarrilDelDia(reglas, minutosDeclarados, tramo), cuota), techo))
}

/**
 * El SUELO del carril hoy: lo que no baja pase lo que pase. Función PURA.
 *
 * Existe aparte de la cuota porque hay un día en el que el carril sí cede: el del
 * ensayo del ejercicio que se escribe entero (150 minutos seguidos en el Técnico).
 * Ese día el carril baja al suelo en vez de cobrar su cuota, y así caben los dos.
 * Sin esto, con 3 h declaradas y el 55 % de la ventana en contabilidad quedaban 81
 * minutos y el ensayo del tercer ejercicio —40 de los 90 puntos— no se programaba
 * NUNCA. Ceder al suelo no es romper la decisión: la decisión es «nunca cero».
 *
 * El `max(1, …)` es para la jornada ridícula (un día declarado de 2 minutos): el
 * suelo redondearía a 0 y el carril desaparecería. Un minuto no prepara nada, pero
 * el día no sale a cero y la cifra que se enseña no miente.
 */
export function sueloCarrilDelDia(
  reglas:            ReglasOposicion,
  minutosDeclarados: number,
  tramo:             TramoCarril | null,
): number {
  const carril = reglas.carrilTransversal
  if (!carril || !tramo || minutosDeclarados <= 0) return 0
  return Math.max(1, Math.min(carril.suelo, Math.round(carril.fraccionSuelo * minutosDeclarados)))
}
