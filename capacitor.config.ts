import type { CapacitorConfig } from '@capacitor/cli'

// Las plataformas nativas (ios/, android/) todavía no se han añadido.
const config: CapacitorConfig = {
  appId: 'com.persevera.tests',
  appName: 'Persevera Tests',
  webDir: 'dist',
}

export default config
