// ─────────────────────────────────────────────────────────────────────────────
// El cliente de Supabase de Persevera Tests, con la clave PUBLICABLE
// (sb_publishable_…): va dentro de la app y está pensada para ser pública. La
// RLS de la base decide qué ve cada uno. La clave secreta (sb_secret_…) es solo
// de los scripts y de las funciones: nunca aquí.
//
// Hecho el 15-oct-2026 a partir del de Persevera Oral (src/lib/supabase.ts,
// main en b8e151a): supabaseConfigurado() es el de allí, tal cual, y
// obtenerSupabase() también, salvo la `storageKey` fija, que se pone como en
// Persevera (src/lib/supabase.ts, 15-31, en 54e448e) y Oral no lleva. Lo
// nuevo es también `supabase`, con ese nombre porque es el que importa el
// motor copiado de Persevera (`import { supabase } from './supabase'`), para
// que la copia no cambie. No se copia el de Persevera: apunta a su proyecto y
// usa la clave anónima antigua.
//
// Se crea al primer uso y no al importar, como en Oral: las pruebas y las
// maquetas importan módulos que tiran de aquí y no deben conectarse a nada.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let cliente: SupabaseClient | null = null

/** ¿Están puestas la dirección y la clave publicable? */
export function supabaseConfigurado(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
}

export function obtenerSupabase(): SupabaseClient {
  if (cliente) return cliente
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined
  if (!url || !clave) {
    throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env.local.')
  }
  if (clave.startsWith('sb_secret_')) {
    // por si alguien pega la secreta donde va la publicable: abriría toda la base
    throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY lleva la clave secreta. Pon la publicable (sb_publishable_…).')
  }
  cliente = createClient(url, clave, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Fija, como en Persevera (src/lib/supabase.ts, 15-31, en 54e448e). Si no,
      // supabase-js la saca del dominio de la URL, y el día que el Supabase de
      // Tests pase a un dominio propio (decisión abierta en guia-consolas.md)
      // todas las sesiones se perderían a la vez. Puesta antes de que haya
      // ninguna. No se cambia nunca.
      storageKey: 'sb-persevera-tests-auth-token',
    },
  })
  return cliente
}

/**
 * El cliente con el nombre que usa el motor de Persevera. Se comporta como el
 * cliente de verdad (`supabase.from(…)`, `supabase.rpc(…)`, `supabase.auth`),
 * pero no lo crea hasta que alguien lo usa.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, propiedad) {
    const real = obtenerSupabase()
    const valor: unknown = Reflect.get(real, propiedad, real)
    return typeof valor === 'function' ? valor.bind(real) : valor
  },
})
