// La pantalla vacía de T1: solo el nombre. Las pestañas llegan con T15.
export default function App() {
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
