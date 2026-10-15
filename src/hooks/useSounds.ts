// Copiado de Persevera (src/hooks/useSounds.ts) el 15-oct-2026, rama
// claude/dia-d en 54e448e. Copiar, nunca mover: el original sigue en Persevera.
// Tal cual. Los sonidos vienen apagados, como en Persevera. La cabecera apaga
// la regla no-empty de ESLint porque el original deja vacío un catch a
// propósito, y el motor no se arregla aquí.
/* eslint-disable no-empty */

/**
 * useSounds
 * ─────────
 * Efectos de sonido SUTILES de Persevera, espejo de useHaptics.
 *
 * - **OFF por defecto** (una app de estudio se usa a menudo en silencio).
 *   El usuario los activa desde Ajustes → toggle "Sonidos".
 * - Sintetizados con **Web Audio API** (osciladores) → NO necesita ficheros
 *   de audio. Tonos cortos, suaves (ondas sinusoidales, ganancia baja).
 * - Solo en momentos CLAVE: acierto / fallo / subir de nivel / completar.
 *   NUNCA en cada toque (eso lo hacen los haptics, en silencio).
 * - try/catch silencioso: si no hay AudioContext (web vieja) no rompe nada.
 *
 * Uso (fuera o dentro de componentes):
 *   import { sounds } from '../../hooks/useSounds'
 *   sounds.correct()
 */

const SOUNDS_FLAG = 'persevera_sounds_enabled'

/** Default OFF: solo true si el usuario lo activó explícitamente. */
export const isSoundsEnabled = (): boolean => {
  try { return localStorage.getItem(SOUNDS_FLAG) === 'true' }
  catch { return false }
}

export const setSoundsEnabled = (enabled: boolean): void => {
  try { localStorage.setItem(SOUNDS_FLAG, enabled ? 'true' : 'false') } catch {}
}

// AudioContext perezoso (se crea al primer uso, se reanuda tras gesto del usuario).
let _ctx: AudioContext | null = null
function audioCtx(): AudioContext | null {
  try {
    if (!_ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      _ctx = new AC()
    }
    if (_ctx.state === 'suspended') _ctx.resume().catch(() => {})
    return _ctx
  } catch {
    return null
  }
}

/** Un tono con envolvente suave (ataque rápido, caída exponencial). */
function tone(freq: number, startOffset: number, dur: number, type: OscillatorType = 'sine', peak = 0.16): void {
  const c = audioCtx()
  if (!c) return
  const t0 = c.currentTime + startOffset
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.03)
}

const play = (fn: () => void): void => {
  if (!isSoundsEnabled()) return
  try { fn() } catch { /* sin audio → silencio */ }
}

export const sounds = {
  /** Acierto: dos notas ascendentes suaves (Do5 → Mi5). */
  correct:   () => play(() => { tone(523.25, 0, 0.12, 'sine', 0.15); tone(659.25, 0.085, 0.16, 'sine', 0.15) }),

  /** Fallo: dos notas graves descendentes, sin estridencia (La3 → Fa3). */
  incorrect: () => play(() => { tone(220.00, 0, 0.15, 'triangle', 0.13); tone(174.61, 0.10, 0.20, 'triangle', 0.11) }),

  /** Subir de nivel: arpegio ascendente (Do5-Mi5-Sol5-Do6). */
  levelUp:   () => play(() => { [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => tone(f, i * 0.10, 0.20, 'sine', 0.14)) }),

  /** Completar (sesión/simulacro): acorde cálido resuelto (Do-Mi-Sol). */
  complete:  () => play(() => { [523.25, 659.25, 783.99].forEach(f => tone(f, 0, 0.55, 'sine', 0.09)) }),
}

export function useSounds() {
  return sounds
}

export default useSounds
