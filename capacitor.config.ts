import type { CapacitorConfig } from '@capacitor/cli'

// android/ se añadió el 14-oct-2026 (A9, bloque 9 de la guía); ios/ todavía no.
const config: CapacitorConfig = {
  appId: 'com.persevera.tests',
  appName: 'Persevera Tests',
  webDir: 'dist',
}

export default config
