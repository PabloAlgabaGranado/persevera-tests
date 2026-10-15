// Copiado de Persevera (src/components/common/Loading/Loading.tsx) el
// 15-oct-2026, rama claude/dia-d en 54e448e. Copiar, nunca mover: el original
// sigue en Persevera. Tal cual.

import './Loading.css';

type LoadingVariant = 'flexo' | 'dots' | 'line';

interface LoadingProps {
  /**
   * Variante del loading según el contexto:
   * - 'flexo': pantalla completa, cargas grandes (apertura de tema, sincronización inicial)
   * - 'dots':  cargas pequeñas, botones, paginación, indicadores inline
   * - 'line':  cargas medias, búsquedas, barras de progreso integradas
   *
   * Por defecto: 'dots'
   */
  variant?: LoadingVariant;

  /**
   * Etiqueta de texto opcional (recomendado para 'flexo' y 'line').
   * Si no se proporciona, solo se muestra la animación.
   */
  label?: string;

  /**
   * Tamaño en píxeles. Por defecto es razonable para cada variante.
   */
  size?: number;

  /**
   * `true` cuando el loading va sobre una superficie OSCURA (navy de los mapas
   * mentales, etc.). Cambia el verde de marca por salvia y la etiqueta a claro
   * para que tenga contraste. Por defecto `false` (fondos claros/crema).
   */
  onDark?: boolean;
}

/**
 * Sistema de loading de Persevera.
 *
 * Tres animaciones en bucle infinito, cada una pensada para un tipo de espera:
 *
 *   <Loading variant="flexo" label="Cargando tu temario" />
 *   <Loading variant="line" label="Sincronizando flashcards" />
 *   <Loading variant="dots" />
 *
 * Todas usan la paleta verde académico (#0D7C66) y respetan
 * prefers-reduced-motion (la animación se detiene en ese caso).
 */
export function Loading({ variant = 'dots', label, size, onDark = false }: LoadingProps) {
  if (variant === 'flexo') return <LoadingFlexo label={label} size={size ?? 80} onDark={onDark} />;
  if (variant === 'line') return <LoadingLine label={label} size={size ?? 200} onDark={onDark} />;
  return <LoadingDots label={label} size={size ?? 32} onDark={onDark} />;
}

/* ============================================================
 * Variante "flexo" — para cargas grandes (pantalla completa)
 * ============================================================ */
function LoadingFlexo({ label, size, onDark }: { label?: string; size: number; onDark?: boolean }) {
  // Sobre navy el verde de marca pierde contraste → salvia (en paleta) + rim
  // más claro. El cuerpo del flexo conserva la silueta; solo cambia el tono.
  const body = onDark ? '#5BA899' : '#0D7C66';
  const rim  = onDark ? '#8FCDBD' : '#5BA899';
  return (
    <div className="persevera-loading persevera-loading--flexo" role="status" aria-label={label ?? 'Cargando'}>
      <svg
        className="persevera-loading__flexo-svg"
        viewBox="0 0 140 140"
        style={{ width: size, height: size }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Cono de luz: NACE en la base de la pantalla (y≈66, justo bajo el
            borde inferior y=65) y queda dentro de su ancho — así no se "sale"
            por arriba al encenderse (igual criterio que FlexoMark). */}
        <polygon
          className="persevera-loading__flexo-light"
          points="51,66 89,66 84,99 56,99"
          fill={body}
        />
        <path d="M 60 32 L 80 32 L 93 65 L 47 65 Z" fill={body} />
        <rect x="45" y="63" width="50" height="2.1" fill={rim} />
        <rect x="68" y="68" width="4" height="46" fill={body} />
        <rect x="46" y="111" width="48" height="6" rx="1.2" fill={body} />
        <ellipse cx="70" cy="115" rx="28" ry="3.7" fill={body} />
      </svg>
      {/* El label del flexo escala con el dibujo (cargas grandes a pantalla
          completa): nunca por debajo de 16px (otros usos pequeños). */}
      {label && (
        <p
          className="persevera-loading__label"
          style={{
            fontSize: Math.max(16, Math.round(size * 0.17)),
            ...(onDark ? { color: 'rgba(255,255,255,0.92)' } : null),
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
}

/* ============================================================
 * Variante "dots" — para cargas pequeñas (botones, listas)
 * ============================================================ */
function LoadingDots({ label, size, onDark }: { label?: string; size: number; onDark?: boolean }) {
  const dot = onDark ? '#5BA899' : '#0D7C66';
  return (
    <div className="persevera-loading persevera-loading--dots" role="status" aria-label={label ?? 'Cargando'}>
      {label && (
        <span className="persevera-loading__inline-label" style={onDark ? { color: 'rgba(255,255,255,0.92)' } : undefined}>
          {label}
        </span>
      )}
      <svg
        className="persevera-loading__dots-svg"
        viewBox="0 0 60 16"
        style={{ width: size, height: (size * 16) / 60 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle className="persevera-loading__dot persevera-loading__dot--1" cx="10" cy="8" r="4" fill={dot} />
        <circle className="persevera-loading__dot persevera-loading__dot--2" cx="30" cy="8" r="4" fill={dot} />
        <circle className="persevera-loading__dot persevera-loading__dot--3" cx="50" cy="8" r="4" fill={dot} />
      </svg>
    </div>
  );
}

/* ============================================================
 * Variante "line" — para cargas medianas (búsquedas, barras)
 * ============================================================ */
function LoadingLine({ label, size, onDark }: { label?: string; size: number; onDark?: boolean }) {
  const track  = onDark ? 'rgba(255,255,255,0.14)' : '#E8F5F1';
  const stroke = onDark ? '#5BA899' : '#0D7C66';
  return (
    <div className="persevera-loading persevera-loading--line" role="status" aria-label={label ?? 'Cargando'}>
      {label && (
        <p className="persevera-loading__label" style={onDark ? { color: 'rgba(255,255,255,0.92)' } : undefined}>
          {label}
        </p>
      )}
      <svg
        className="persevera-loading__line-svg"
        viewBox="0 0 140 4"
        style={{ width: size, height: (size * 4) / 140 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line x1="2" y1="2" x2="138" y2="2" stroke={track} strokeWidth="2" strokeLinecap="round" />
        <line
          className="persevera-loading__line-stroke"
          x1="2" y1="2" x2="138" y2="2"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
