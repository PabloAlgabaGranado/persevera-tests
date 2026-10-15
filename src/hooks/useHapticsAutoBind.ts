// Copiado de Persevera (src/hooks/useHapticsAutoBind.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. Se llama una vez, en App.tsx.

/**
 * useHapticsAutoBind
 * ──────────────────
 * Registra UN único listener global en `pointerdown` que dispara
 * feedback háptico automáticamente en cualquier elemento que sea:
 *   - un <button> (no deshabilitado)
 *   - un elemento con [data-pressable]
 *
 * Lo llamas UNA SOLA VEZ en el componente raíz (App.tsx):
 *
 *   import { useHapticsAutoBind } from './hooks/useHapticsAutoBind'
 *
 *   export default function App() {
 *     useHapticsAutoBind()
 *     return <AppRoot />
 *   }
 *
 * A partir de ahí, todos los botones de la app vibran al pulsarse.
 * No hay que tocar nada en los componentes.
 *
 * Personalización por elemento — añade `data-haptic` al botón:
 *   data-haptic="none"     → no vibra (overrides el default)
 *   data-haptic="light"    → tap ligero (default — equivale a omitir)
 *   data-haptic="medium"   → impacto medio (acciones importantes)
 *   data-haptic="heavy"    → impacto fuerte (acciones críticas)
 *   data-haptic="success"  → notificación success
 *   data-haptic="warning"  → notificación warning
 *   data-haptic="error"    → notificación error
 *
 * Por qué pointerdown y no click:
 *   El feedback háptico ha de sentirse INMEDIATAMENTE al tocar la
 *   pantalla, no cuando se completa el tap. pointerdown da esa
 *   sensación de "tactil" — la app responde antes de soltar el dedo.
 */

import { useEffect } from 'react'
import { haptics, isHapticsEnabled } from './useHaptics'

const TARGET_SELECTOR = 'button, [data-pressable]'

type HapticIntent =
  | 'none'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'

const fireHaptic = (intent: HapticIntent): void => {
  switch (intent) {
    case 'none':    return
    case 'light':   haptics.light();   return
    case 'medium':  haptics.medium();  return
    case 'heavy':   haptics.heavy();   return
    case 'success': haptics.success(); return
    case 'warning': haptics.warning(); return
    case 'error':   haptics.error();   return
  }
}

const readIntent = (el: Element): HapticIntent => {
  const raw = el.getAttribute('data-haptic')
  if (
    raw === 'none' ||
    raw === 'light' ||
    raw === 'medium' ||
    raw === 'heavy' ||
    raw === 'success' ||
    raw === 'warning' ||
    raw === 'error'
  ) {
    return raw
  }
  return 'light' // default
}

export function useHapticsAutoBind(): void {
  useEffect(() => {
    // Si el usuario tiene los hápticos desactivados desde Ajustes,
    // no registramos siquiera el listener (ahorra eventos).
    if (!isHapticsEnabled()) {
      // Aun así, registramos un listener que comprueba el flag
      // dinámicamente para que el cambio de Ajustes surta efecto
      // sin recargar la app.
    }

    const handler = (e: PointerEvent) => {
      // Filtros de seguridad
      if (e.pointerType !== 'touch' && e.pointerType !== 'mouse') return
      if (e.pointerType === 'mouse' && e.button !== 0) return

      const target = e.target as Element | null
      if (!target || !target.closest) return

      const trigger = target.closest(TARGET_SELECTOR)
      if (!trigger) return

      // Saltar botones deshabilitados
      if (
        trigger instanceof HTMLButtonElement &&
        (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true')
      ) {
        return
      }

      const intent = readIntent(trigger)
      fireHaptic(intent)
    }

    document.addEventListener('pointerdown', handler, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', handler)
    }
  }, [])
}

export default useHapticsAutoBind
