// Copiado de Persevera (src/types/EstadoConvocatoria.types.ts) el 15-oct-2026,
// rama claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en
// Persevera. Lo pide reglasOposicion.ts (conserva y cuatro tipos). Cambiado
// aquí: se cortan leerEstado, escribirEstado y estadoUtilizable, que leen y
// escriben las preferencias del plan, y el import de PlanPreferences
// (StudyPlan.types.ts), porque el plan no entra en Tests. Lo demás, tal cual.

/**
 * PERSEVERA — El ESTADO del opositor en su convocatoria
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Hoy el plan sabe una sola cosa del opositor: cuántas horas declara. Todo lo
 * demás lo deduce. Este módulo es el sitio donde se declaran los hechos que el
 * plan no puede deducir: qué lleva conservado, por qué turno se presenta, qué ha
 * pasado en cada examen y qué fechas hay publicadas.
 *
 * DOS REGLAS DE DISEÑO, y las dos están en la forma de los tipos, no en la
 * disciplina de quien los use:
 *
 *   A. El estado se rellena DESPUÉS y el plan funciona sin él. El «no lo sé» de
 *      nivel superior es la AUSENCIA del objeto entero: un plan de antes de que
 *      esto existiera. Se resuelve una sola vez, en `leerEstado`, y no se repite
 *      en cada llamada.
 *
 *   B. Cada campo tiene un «no lo sé» DISTINTO del valor por defecto. Los cuatro
 *      campos de `EstadoConvocatoria` son OBLIGATORIOS en cuanto el objeto
 *      existe: no se puede construir uno sin decir, para cada hecho, o un valor
 *      o `no_preguntado`. Ese es el mecanismo que hace cumplir la regla por
 *      compilador. Todas las averías que este modelo existe para no repetir
 *      vienen de lo contrario: un valor por defecto que no avisa
 *      (`calcularFases` con tres argumentos por defecto, `exento_primer_ejercicio`
 *      a false, `bloqueDelDia` devolviendo null).
 *
 * Es un módulo PURO: no importa nada en tiempo de ejecución y no toca la base de
 * datos. Vive en `preferences` (jsonb), así que añadirlo NO lleva migración.
 */

// ═══════════════════════════════════════════════════════════════════════════
//   1. LAS FECHAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Una fecha de examen tal y como se PUBLICA, que no siempre es un día.
 *
 * No es un `string` ISO, y las tres razones son cosas que ya han salido mal:
 *
 *  1. Un `string` obliga a un día, y un día es una promesa. La única manera de
 *     llevar «segunda quincena de mayo» con una cadena es escribir `2027-05-16`,
 *     y entonces la cuenta atrás dice «faltan 231 días»: una cifra que no ha
 *     publicado nadie. La regla es horquilla, nunca día, hasta que el tribunal
 *     lo publique.
 *  2. El motor tiene que seguir haciendo aritmética, y para eso necesita un día.
 *     Por eso el día es DERIVADO (`diaOperativo`) y no almacenado: así la
 *     pantalla no puede imprimir por descuido el día que se inventó el motor.
 *  3. Cuando se concreta hay que saber si CAMBIÓ. `2027-05-16` (estimada) →
 *     `2027-05-30` (BOE) parece un cambio de fecha. `{quincena 2 de 2027-05}` →
 *     `{dia 2027-05-30}` es una CONCRECIÓN, y dentro de la ventana ya
 *     planificada no obliga a regenerar.
 *
 * `sin_publicar` NO es el «no lo sé»: es saber que ese ejercicio existe y que no
 * lo sabe nadie todavía. El «no lo sé» es la ausencia de la clave.
 */
export type FechaExamen =
  | { precision: 'dia';      dia: string; fuente: 'boe' | 'estimada' }
  /** `mes` en formato `AAAA-MM`. Quincena 1 = del 1 al 15; quincena 2 = del 16 a fin de mes. */
  | { precision: 'quincena'; mes: string; quincena: 1 | 2 }
  | { precision: 'mes';      mes: string }
  | { precision: 'sin_publicar' }

/**
 * FOTO de las fechas que había cuando se generó el plan. NO es una segunda
 * fuente de la verdad para el calendario: las fechas del tribunal son contenido
 * y viven en `oposicion_convocatorias`. Esto solo sirve para responder barato a
 * «¿ha cambiado la convocatoria desde que te hicimos el plan?».
 *
 * `repartoDelPlan` ya aprendió esta lección por las malas: el motor no debe leer
 * de aquí ni un día.
 */
export interface FotoDeFechas {
  primero:   FechaExamen
  segundo:   FechaExamen
  /** No tiene columna en la base todavía: hasta que la tenga es `sin_publicar`. */
  tercero:   FechaExamen
  /** Cuándo se tomó la foto (ISO `AAAA-MM-DD`). */
  leidas_el: string
}

/** Último día del mes `AAAA-MM`, en ISO. */
function finDeMes(mes: string): string {
  const [a, m] = mes.split('-').map(Number)
  const d = new Date(Date.UTC(a, m, 0))
  return d.toISOString().slice(0, 10)
}

/**
 * El día con el que el motor puede hacer aritmética. SIEMPRE el extremo
 * TEMPRANO de la horquilla, y queda escrito por qué: si preparas para el 31 y el
 * examen es el 16, llegas quince días corto y no hay manera de recuperarlos.
 *
 * `sin_publicar` → `null`: no hay día, y el que lo llame tiene que decidir qué
 * hace sin él en vez de recibir uno inventado.
 */
export function diaOperativo(f: FechaExamen): string | null {
  switch (f.precision) {
    case 'dia':      return f.dia
    case 'quincena': return `${f.mes}-${f.quincena === 1 ? '01' : '16'}`
    case 'mes':      return `${f.mes}-01`
    case 'sin_publicar': return null
  }
}

/**
 * Solo una fecha FIRME puede mover una cuenta atrás o comprimir una recta final.
 * Firme es `dia` publicado en el BOE, y nada más: una estimación nuestra no
 * autoriza a apretarle los últimos días a nadie.
 */
export function esFirme(f: FechaExamen): boolean {
  return f.precision === 'dia' && f.fuente === 'boe'
}

/** Horquilla [inicio, fin] que describe una fecha, o null si no describe ninguna. */
function ventana(f: FechaExamen): readonly [string, string] | null {
  switch (f.precision) {
    case 'dia':      return [f.dia, f.dia]
    case 'quincena': return f.quincena === 1
      ? [`${f.mes}-01`, `${f.mes}-15`]
      : [`${f.mes}-16`, finDeMes(f.mes)]
    case 'mes':      return [`${f.mes}-01`, finDeMes(f.mes)]
    case 'sin_publicar': return null
  }
}

/**
 * ¿La fecha nueva cae DENTRO de la ventana que ya se planificó?
 *
 * Es la pregunta que separa una CONCRECIÓN («segunda quincena de mayo» →
 * «30 de mayo») de un CAMBIO de fecha. Dentro de la ventana ya planificada no
 * hace falta regenerar; fuera, sí.
 *
 * Si alguna de las dos no describe ninguna ventana (`sin_publicar`), devuelve
 * `false`: no se puede afirmar que algo siga dentro de una ventana que no
 * existe, y el lado prudente es regenerar.
 */
export function mismaVentana(antes: FechaExamen, ahora: FechaExamen): boolean {
  const a = ventana(antes)
  const b = ventana(ahora)
  if (!a || !b) return false
  return b[0] >= a[0] && b[1] <= a[1]
}

// ═══════════════════════════════════════════════════════════════════════════
//   2. LO CONSERVADO
// ═══════════════════════════════════════════════════════════════════════════

export type EjercicioConservado = 'primero' | 'segundo'

/**
 * Qué ejercicios lleva aprobados y conservados.
 *
 * La base 6.3 de la convocatoria (BOE-A-2025-27149) permite conservar el 1.º, el
 * 2.º o LOS DOS, «en las dos convocatorias inmediatas siguientes, siempre que en
 * la primera de estas dos convocatorias superen algún ejercicio adicional».
 * `exento_primer_ejercicio` solo sabía decir «el primero, sí o no».
 *
 *  · El «no lo sé» es `no_preguntado`. Hoy el booleano ausente o a `false`
 *    significa las dos cosas a la vez: «no conserva nada» y «no se lo hemos
 *    preguntado». Aquí se separan.
 *  · `ejercicios: []` NO EXISTE: si no conserva nada, el estado es `ninguno`. Un
 *    array vacío dentro de `conserva` sería un tercer «no lo sé» encubierto.
 *  · `renuncia: true` es quien tiene nota guardada y se examina igual: recibe el
 *    plan completo, aunque la app le pueda decir otra cosa.
 *  · `convocatoria_origen` está porque la reserva CADUCA a las dos convocatorias
 *    y la segunda exige superar algún ejercicio adicional. El plan no decide con
 *    eso: avisa.
 */
export type ReservaDeclarada =
  | { estado: 'no_preguntado' }
  | { estado: 'ninguno' }
  | {
      estado:                'conserva'
      /** 1 o 2 ejercicios, nunca vacío. */
      ejercicios:            readonly EjercicioConservado[]
      convocatoria_origen?:  string
      renuncia:              boolean
    }

/**
 * ¿Se salta ese ejercicio?
 *
 * La asimetría está escrita AQUÍ, en el código, y a propósito: `no_preguntado`
 * devuelve `false`. EN LA DUDA, SE PREPARA. Preparar un ejercicio de más cuesta
 * horas; saltarse uno al que sí se presenta cuesta la plaza.
 *
 * Y quien RENUNCIA a la reserva se examina de todo: su plan es el completo.
 */
export function conserva(r: ReservaDeclarada, ejercicio: EjercicioConservado): boolean {
  if (r.estado !== 'conserva') return false
  if (r.renuncia) return false
  return r.ejercicios.includes(ejercicio)
}

// ═══════════════════════════════════════════════════════════════════════════
//   3. EL TURNO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Libre o promoción interna. El motor NO hace nada con esto: es la entrada de un
 * AVISO, porque cambiar de turno hace perder lo conservado. Para el estudio casi
 * no cambia (en promoción interna el tema del 3.er ejercicio se elige entre dos
 * y en libre no).
 *
 * El «no lo sé» es `no_preguntado`, y significa que NO se enseña el aviso: no se
 * puede avisar de un cambio que no se ve.
 */
export type TurnoDeclarado = 'libre' | 'promocion_interna' | 'no_preguntado'

// ═══════════════════════════════════════════════════════════════════════════
//   4. EL RESULTADO DE CADA EXAMEN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Qué ha pasado en un ejercicio. Hoy esto no existe en ninguna parte: el plan se
 * escribe una vez y no se entera de nada.
 *
 *  · `no_celebrado` NO es el «no lo sé», y esta es la distinción que más
 *    importa: es DERIVABLE de la fecha, así que el motor lo pone solo sin
 *    preguntar nada. El «no lo sé» es `no_preguntado`, y solo existe DESPUÉS de
 *    la fecha del examen.
 *  · `esperando_nota` es el estado que hoy no existe y el que más dura: del
 *    examen a la nota, 31 días en la OEP 2024 y 16 o 17 en la 2025. Es el único
 *    tramo en que el plan sabe que el examen se hizo y no sabe el resultado. Ahí
 *    el plan NO SE BIFURCA: apaga lo celebrado y no enciende nada.
 *  · Del silencio no se infiere nunca «aprobó». Silencio tras el examen es
 *    `no_preguntado`, y eso mantiene el camino prudente, que es lo que hace el
 *    motor hoy.
 */
export type ResultadoEjercicio =
  | { estado: 'no_preguntado' }
  | { estado: 'no_celebrado' }
  | { estado: 'no_presentado';  declarado_el: string }
  | { estado: 'esperando_nota'; declarado_el: string }
  | { estado: 'aprobado';       declarado_el: string }
  | { estado: 'suspendido';     declarado_el: string }

export interface ResultadosDeclarados {
  primero: ResultadoEjercicio
  segundo: ResultadoEjercicio
  tercero: ResultadoEjercicio
  /** Deja la convocatoria: el plan se pausa y se queda sin cuenta atrás. */
  abandona?: { desde: string }
}

// ═══════════════════════════════════════════════════════════════════════════
//   EL OBJETO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Un objeto, no cuatro campos sueltos, y los cuatro de dentro OBLIGATORIOS en
 * cuanto el objeto existe. No hay forma de olvidarse de uno y recibir un valor
 * por defecto callado.
 */
export interface EstadoConvocatoria {
  version:    1
  turno:      TurnoDeclarado
  reserva:    ReservaDeclarada
  resultados: ResultadosDeclarados
  fechas?:    FotoDeFechas
}

/**
 * Los tres resultados a «no se lo hemos preguntado».
 *
 * Es una FUNCIÓN y no una constante exportada a propósito: una constante
 * compartida la devolvería `leerEstado` por referencia y dos planes distintos
 * acabarían apuntando al mismo objeto.
 */
export function resultadosSinPreguntar(): ResultadosDeclarados {
  return {
    primero: { estado: 'no_preguntado' },
    segundo: { estado: 'no_preguntado' },
    tercero: { estado: 'no_preguntado' },
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//   LA PREGUNTA: UNA OPCIÓN, UNA RESERVA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lo que el opositor puede ELEGIR en pantalla. No es `ReservaDeclarada`: es su
 * proyección sobre una lista de botones, sin `renuncia`, sin
 * `convocatoria_origen` y sin `no_preguntado`.
 *
 * Existe para que la pregunta y lo que hace el plan salgan del MISMO valor. La
 * avería que más se repite en esta casa es un botón gateado por una condición y
 * lo que abre por otra; aquí la opción que se pinta, la que se guarda y la que
 * el motor lee son el mismo dato pasando por `reservaDeOpcion`.
 */
export type OpcionReserva = 'ninguno' | 'primero' | 'segundo' | 'ambos'

/** De lo que se elige en pantalla a lo que lee el motor. */
export function reservaDeOpcion(o: OpcionReserva): ReservaDeclarada {
  switch (o) {
    case 'ninguno': return { estado: 'ninguno' }
    case 'primero': return { estado: 'conserva', ejercicios: ['primero'], renuncia: false }
    case 'segundo': return { estado: 'conserva', ejercicios: ['segundo'], renuncia: false }
    case 'ambos':   return { estado: 'conserva', ejercicios: ['primero', 'segundo'], renuncia: false }
  }
}

/**
 * Y de vuelta: qué opción hay que enseñar marcada al abrir la pantalla.
 *
 * `null` significa «no hay nada que marcar», y es lo que devuelve
 * `no_preguntado`. Esto es lo que hace que quien traía solo el booleano viejo
 * vea su opción elegida: `leerEstado` traduce `exento_primer_ejercicio: true` a
 * conservar el primero, y esto lo convierte en el botón ya marcado.
 *
 * Quien RENUNCIA a la reserva se examina de todo, así que en pantalla sale «no
 * conservo ninguna»: es exactamente lo que el plan le está haciendo. El
 * asistente no escribe nunca `renuncia: true`, así que ese caso solo puede venir
 * de fuera.
 */
export function opcionDeReserva(r: ReservaDeclarada): OpcionReserva | null {
  if (r.estado === 'no_preguntado') return null
  if (r.estado === 'ninguno') return 'ninguno'
  if (r.renuncia) return 'ninguno'
  const p = r.ejercicios.includes('primero')
  const s = r.ejercicios.includes('segundo')
  if (p && s) return 'ambos'
  if (p) return 'primero'
  if (s) return 'segundo'
  return 'ninguno'
}
