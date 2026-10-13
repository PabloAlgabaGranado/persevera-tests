/// <reference types="vitest/config" />
// Como el de Persevera (claude/dia-d en 54e448e, vite.config.ts) y el de
// Persevera Oral (main en b8e151a), 13-oct-2026: solo `build.target` y las
// pruebas. Sin el proxy del worker, porque Tests no tiene tutor, y sin el
// plugin que sirve el banco de contabilidad, que Tests no lleva.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // El WebView de iOS (Capacitor 8 = iOS 14+) puede ser más antiguo que el
  // target por defecto de Vite 8 (Safari 16+). Sin fijarlo, el bundle usa
  // sintaxis que un Safari anterior no entiende y la app se queda en negro en
  // el iPhone aunque en el navegador de escritorio vaya bien.
  build: { target: 'safari14' },
  test: { include: ['src/**/*.test.{ts,tsx}'] },
})
