import { useHapticsAutoBind } from './hooks/useHapticsAutoBind'

// La pantalla vacía de T1: solo el nombre. Las pestañas llegan con T15.
export default function App() {
  // Que vibren todos los botones de la app, como en Persevera (T3). Va lo
  // primero, antes del arranque y de la pantalla de entrar que lleguen con T12
  // y T16, para que también vibren allí: ningún return puede ir por encima.
  useHapticsAutoBind()

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
          fontSize: 40,
          fontWeight: 600,
          color: '#F1FAF7',
        }}
      >
        Persevera <span style={{ color: '#7AD8D2' }}>Tests</span>
      </h1>
    </main>
  )
}
