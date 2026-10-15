// Copiado de Persevera (src/lib/bancoDeTest.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. El recuento sale de la RPC banco_de_test_por_tema, que crea T10.

import { supabase } from './supabase'
import { recuentoConRespaldo } from './recuentosPorRpc'

// ═══════════════════════════════════════════════════════════════════════════
//   BANCO DE TEST POR TEMA
// ---------------------------------------------------------------------------
//   Cuántas preguntas de test puede servir cada tema, contadas como las monta la
//   app. Vive aquí, y no dentro del motor del plan, porque hay dos sitios que
//   necesitan la MISMA respuesta: el planificador (no programar un test que no
//   existe) y el selector de tests (no ofrecer un bloque que no se testea).
//
//   Un bloque puede tener temario, flashcards, mapas y casos y NO tener test: el
//   Anexo I.1.4 del Técnico de Hacienda es la materia del 3.er ejercicio, que se
//   escribe, y el BOE deja el test del 1.º en los anexos I.1.1 y I.1.2. Sus 38
//   temas no tienen ni una pregunta y no es un hueco: es que ahí no hay test.
//
//   ⚠️ El criterio es el BANCO CONTADO, nunca `peso_test`: el bloque de Lengua
//   inglesa de la Guardia Civil tiene `peso_test` 0 y 336 preguntas vivas, así
//   que apagar por el peso le quitaría su drill a una oposición viva. Tampoco
//   sirve `temas.num_preguntas_banco`, que no la mantiene nadie (a 0 en cuatro
//   de las seis oposiciones, todas con banco).
// ═══════════════════════════════════════════════════════════════════════════

/** Una fila de `cargarBancoDeTestPorTema`: el tema con los recuentos embebidos. */
export interface FilaBancoDeTest {
  id: string
  /** Sus epígrafes (vía `tema_epigrafe`), cada uno con su recuento de preguntas. */
  te: ReadonlyArray<{ ep: { p: ReadonlyArray<{ count: number }> } | null }> | null
  /** Recuento por `tema_id`: la app solo lo usa si el tema no tiene epígrafes. */
  pt: ReadonlyArray<{ count: number }> | null
}

/**
 * Cuántas preguntas de test puede servir cada tema de la oposición.
 *
 * Desde el día D lo cuenta la base, `banco_de_test_por_tema` (recuentosPorRpc.ts):
 * con la fase 3 de la protección encendida, la consulta de abajo solo vería las
 * preguntas que la RLS deja leer a quien llama, y a quien no paga le saldría el
 * banco del Tema 1 y nada más. Mientras la función no exista en la base, se
 * cuenta como siempre. Si existe y falla, lanza, como la consulta de siempre.
 */
export async function cargarBancoDeTestPorTema(oposicionId: string): Promise<Map<string, number>> {
  return recuentoConRespaldo('banco_de_test_por_tema', { p_oposicion: oposicionId },
    () => cargarBancoDeTestPorTemaDeTabla(oposicionId), 'lanzar')
}

/**
 * El recuento de siempre, leyendo las tablas (y, con la fase 3, con la RLS de
 * quien llama). Es el respaldo y la definición: `banco_de_test_por_tema` tiene que
 * dar lo mismo.
 *
 * Se cuenta como la app monta el test del tema (TestSelectorModal): preguntas
 * verificadas, sin las de examen oficial, de los epígrafes del tema por
 * `tema_epigrafe` —y por `tema_id` si el tema no tuviera epígrafes—. Una sola
 * consulta con los recuentos embebidos: 5-17 KB por oposición. Contrastado contra
 * un recuento tema a tema con ese mismo filtro en las seis oposiciones: 0
 * diferencias.
 */
export async function cargarBancoDeTestPorTemaDeTabla(oposicionId: string): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('temas')
    .select('id, te:tema_epigrafe(ep:epigrafes(p:preguntas(count))), pt:preguntas(count)')
    .eq('oposicion_id', oposicionId)
    .eq('te.ep.p.estado', 'verificada')
    .neq('te.ep.p.fuente', 'conv_real')
    .eq('pt.estado', 'verificada')
    .neq('pt.fuente', 'conv_real')

  if (error) throw new Error(`Error contando el banco de test por tema: ${error.message}`)
  return preguntasDeTestPorTema((data ?? []) as unknown as FilaBancoDeTest[])
}

/**
 * Suma los recuentos embebidos de `cargarBancoDeTestPorTema`: por epígrafes si el
 * tema los tiene, por `tema_id` si no (el mismo orden de preferencia que la app).
 * Pura y exportada para atarla con tests.
 */
export function preguntasDeTestPorTema(filas: ReadonlyArray<FilaBancoDeTest>): Map<string, number> {
  const cuenta = (c: ReadonlyArray<{ count: number }> | null | undefined) => Number(c?.[0]?.count ?? 0)
  return new Map(filas.map(f => [
    f.id,
    (f.te?.length ?? 0) > 0
      ? f.te!.reduce((s, x) => s + cuenta(x.ep?.p), 0)
      : cuenta(f.pt),
  ]))
}

/**
 * Qué bloques y temas se pueden ofrecer para hacer un test.
 *
 * Pura, para poder atarla con tests. Tres redes de seguridad, porque esconder de
 * más es peor que ofrecer de más:
 *  1. Sin recuentos (la consulta falló, o la oposición no devolvió filas) NO se
 *     esconde nada: el opositor se queda como estaba.
 *  2. Un tema que no aparece en los recuentos se considera CON banco: lo que no
 *     se ha medido no se apaga.
 *  3. Si al filtrar no quedara ni un tema, se devuelve todo sin tocar: una
 *     pantalla vacía no ayuda a nadie y delataría un fallo de la consulta.
 * Un bloque se esconde solo cuando TODOS sus temas están medidos y a cero.
 */
export function soloConBancoDeTest<
  B extends { id: string },
  T extends { id: string; bloque_id: string },
>(
  bloques: readonly B[],
  temas: readonly T[],
  banco: ReadonlyMap<string, number>,
): { bloques: B[]; temas: T[] } {
  const todo = { bloques: [...bloques], temas: [...temas] }
  if (banco.size === 0) return todo

  const conBanco = (t: T) => !banco.has(t.id) || (banco.get(t.id) ?? 0) > 0
  const temasVisibles = temas.filter(conBanco)
  if (temasVisibles.length === 0) return todo

  const bloquesVisibles = bloques.filter(b =>
    temasVisibles.some(t => t.bloque_id === b.id) ||
    !temas.some(t => t.bloque_id === b.id),   // bloque sin temas cargados: no se juzga
  )
  return { bloques: bloquesVisibles, temas: temasVisibles }
}
