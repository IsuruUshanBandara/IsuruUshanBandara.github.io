import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'

// ── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticBtn({ href, children, primary = false }) {
  const wrapRef = useRef(null)
  const btnRef  = useRef(null)

  const onMove = useCallback((e) => {
    const wrap = wrapRef.current
    const btn  = btnRef.current
    if (!wrap || !btn) return
    const rect = wrap.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top  - rect.height / 2
    const dist = Math.sqrt(x * x + y * y)
    const radius = 88
    if (dist < radius) {
      const pull = (radius - dist) / radius
      btn.style.transform = `translate(${x * pull * 0.48}px, ${y * pull * 0.48}px)`
    } else {
      btn.style.transform = 'translate(0,0)'
    }
  }, [])

  const onLeave = useCallback(() => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)'
  }, [])

  const baseStyle = primary
    ? {
        padding: '12px 32px',
        background: 'var(--accent)',
        color: '#040300',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 15,
        textDecoration: 'none',
        display: 'inline-block',
        boxShadow: '0 0 18px rgba(245,158,11,0.45), 0 0 40px rgba(245,158,11,0.18)',
        transition: 'background 0.2s, box-shadow 0.3s, transform 0.35s cubic-bezier(.23,1,.32,1)',
      }
    : {
        padding: '12px 32px',
        border: '1px solid rgba(245,158,11,0.6)',
        color: 'var(--text-primary)',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 15,
        textDecoration: 'none',
        display: 'inline-block',
        background: 'rgba(245,158,11,0.07)',
        boxShadow: '0 0 0 1px rgba(245,158,11,0.18), 0 0 14px rgba(245,158,11,0.08)',
        transition: 'border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.3s, transform 0.35s cubic-bezier(.23,1,.32,1)',
      }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ padding: 18, margin: -18, display: 'inline-block' }}
    >
      <a
        ref={btnRef}
        href={href}
        style={baseStyle}
        onMouseEnter={e => {
          if (primary) {
            e.currentTarget.style.background = 'var(--accent-hover)'
            e.currentTarget.style.boxShadow = '0 0 24px rgba(245,158,11,0.65), 0 0 55px rgba(245,158,11,0.28)'
          } else {
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.9)'
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.background = 'rgba(245,158,11,0.14)'
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(245,158,11,0.45), 0 0 20px rgba(245,158,11,0.22)'
          }
        }}
        onMouseLeave={e => {
          if (primary) {
            e.currentTarget.style.background = 'var(--accent)'
            e.currentTarget.style.boxShadow = '0 0 18px rgba(245,158,11,0.45), 0 0 40px rgba(245,158,11,0.18)'
          } else {
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)'
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.background = 'rgba(245,158,11,0.07)'
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(245,158,11,0.18), 0 0 14px rgba(245,158,11,0.08)'
          }
        }}
      >
        {children}
      </a>
    </div>
  )
}

// ── Particle Network Canvas ──────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 45
    const FPS_CAP = 30
    const FRAME_MS = 1000 / FPS_CAP
    let lastFrame = 0

    // Three colour groups — amber (binary), soft blue (symbols), soft green (JSX)
    const GROUPS = [
      {
        chars: ['0', '1', '0', '1', '0', '1'],
        rgb: '245,158,11',    // amber
        glow: '245,158,11',
      },
      {
        chars: ['{', '}', '<', '>', '()', '[]', '=>', '===', '&&', '||', ';', '/>'],
        rgb: '96,165,250',    // soft blue
        glow: '96,165,250',
      },
      {
        chars: ['<div>', '</>', '<App/>', 'onClick', 'useState', 'props'],
        rgb: '134,239,172',   // soft green
        glow: '134,239,172',
      },
    ]

    const FONT_SIZES = [11, 12, 13, 15, 17, 20]

    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const group = GROUPS[Math.floor(Math.random() * GROUPS.length)]
      const char  = group.chars[Math.floor(Math.random() * group.chars.length)]
      const size  = char.length <= 2
        ? FONT_SIZES[Math.floor(Math.random() * FONT_SIZES.length)]
        : FONT_SIZES[Math.floor(Math.random() * 3)]
      return {
        x:          Math.random() * canvas.width,
        y:          Math.random() * canvas.height,
        vx:         (Math.random() - 0.5) * 0.35,
        vy:         (Math.random() - 0.5) * 0.35,
        char,
        size,
        rgb:        group.rgb,
        glow:       group.glow,
        opacity:    Math.random() * 0.28 + 0.14,
        phase:      Math.random() * Math.PI * 2,      // random start offset
        pulseSpeed: 0.6 + Math.random() * 0.9,        // each pulses at its own rate
      }
    })

    const draw = (timestamp) => {
      animId = requestAnimationFrame(draw)
      if (timestamp - lastFrame < FRAME_MS) return
      lastFrame = timestamp
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = Date.now() / 1000   // seconds

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20 || p.x > canvas.width  + 20) p.vx *= -1
        if (p.y < -20 || p.y > canvas.height + 20) p.vy *= -1

        // Pulse: 0 → 1 oscillation unique per particle
        const pulse  = (Math.sin(t * p.pulseSpeed + p.phase) + 1) / 2
        const opBase = p.opacity * (0.55 + pulse * 0.45)   // breathes ±45%

        ctx.font = `${p.size}px monospace`

        // Layer 1 — wide outer glow bloom
        ctx.shadowColor = `rgba(${p.glow}, ${opBase * 0.85})`
        ctx.shadowBlur  = 16 + pulse * 16              // 16–32 px
        ctx.globalAlpha = opBase * 0.55
        ctx.fillStyle   = `rgba(${p.rgb}, 1)`
        ctx.fillText(p.char, p.x, p.y)

        // Layer 2 — tight inner glow + solid text
        ctx.shadowBlur  = 6
        ctx.globalAlpha = opBase
        ctx.fillText(p.char, p.x, p.y)

        // Reset
        ctx.shadowBlur  = 0
        ctx.globalAlpha = 1
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - dist / 120) * 0.10})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    />
  )
}

// ── Typing Effect Hook ───────────────────────────────────────────────────────
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [display, setDisplay]   = useState('')
  const [wordIdx, setWordIdx]   = useState(0)
  const [charIdx, setCharIdx]   = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let timeout

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    }

    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

// ── Hero Component ───────────────────────────────────────────────────────────
const ROLES = [
  'Frontend Developer',
  'React & Angular Developer',
  'UI/UX Enthusiast',
  'Accessibility Advocate',
]

export default function Hero() {
  const role     = useTypingEffect(ROLES)
  const isMobile = useIsMobile()

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--background)',
      }}
    >
      <ParticleCanvas />

      {/* Radial glow behind text */}
      <div style={{
        position: 'absolute',
        width: isMobile ? 280 : 600, height: isMobile ? 280 : 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Text content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: isMobile ? '0 20px' : '0 24px' }}>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            color: 'var(--accent)',
            fontSize: 14,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Welcome to my portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Isuru Ushan<br />
          <span style={{ color: 'var(--accent)' }}>Bandara</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            color: 'var(--text-secondary)',
            marginBottom: 40,
            minHeight: '2rem',
          }}
        >
          {role}
          <span style={{ color: 'var(--accent)', animation: 'blink 1s step-end infinite' }}>|</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <MagneticBtn href="#projects" primary>View Projects</MagneticBtn>
          <MagneticBtn href="#contact">Contact Me</MagneticBtn>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
          }}
        />
      </motion.div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  )
}
