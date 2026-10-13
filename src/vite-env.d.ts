/// <reference types="vite/client" />

// Las variables de .env.local que lee la app. Solo las VITE_: las demás (la
// clave secreta de Supabase) Vite no las mete en el paquete.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
