export default function Footer() {
  return (
    <footer style={{
      background: 'var(--background)',
      borderTop: '1px solid var(--border)',
      padding: '32px 24px',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
        Designed & built by{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Isuru Ushan Bandara</span>
        {' '}· {new Date().getFullYear()}
      </p>
    </footer>
  )
}
