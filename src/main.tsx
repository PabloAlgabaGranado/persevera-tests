import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Sello del paquete, como el `__PERSEVERA_BUILD__` de Persevera (claude/dia-d
// en 54e448e, src/main.tsx, línea 13). Cambiarlo cambia el hash del fichero, que
// es la forma de abandonar una URL de asset envenenada en la caché de
// Cloudflare (ver la red de seguridad de index.html y public/_redirects).
;(window as unknown as Record<string, string>).__PERSEVERA_TESTS_BUILD__ = '2026-10-13'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
