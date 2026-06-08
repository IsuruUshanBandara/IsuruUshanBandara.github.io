import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'

const fadeUp = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.21, 1.11, 0.81, 0.99] },
  }),
}

const GLOW_AMBIENT = '0 0 0 1px rgba(245,158,11,0.28), 0 0 30px rgba(245,158,11,0.22), 0 0 70px rgba(245,158,11,0.08)'
const GLOW_HOVER   = '0 0 0 1px rgba(245,158,11,0.70), 0 0 36px rgba(245,158,11,0.45), 0 0 80px rgba(245,158,11,0.18)'
const BORDER_REST  = 'rgba(245,158,11,0.45)'
const BORDER_HOVER = 'rgba(245,158,11,0.80)'

const CERTS = [
  {
    title:   'Angular Fundamentals',
    issuer:  'Frontend Masters',
    issuerType: 'fm',
    image:   '/certifications/angular-fundamentals-1.png',
    skills:  ['Angular', 'TypeScript', 'Components', 'RxJS'],
  },
  {
    title:   'Website Accessibility v3',
    issuer:  'Frontend Masters',
    issuerType: 'fm',
    image:   '/certifications/accessibility-v3-1.png',
    skills:  ['WCAG', 'ARIA', 'Screen Readers', 'Inclusive Design'],
  },
  {
    title:   'What Is IoT',
    issuer:  'Great Learning Academy',
    issuerType: 'gl',
    image:   '/certifications/iot-great-learning.jpeg',
    skills:  ['IoT', 'Sensors', 'Connectivity'],
  },
  {
    title:   'IoT Foundations: Fundamentals',
    issuer:  'LinkedIn Learning',
    issuerType: 'li',
    image:   '/certifications/iot-foundations-1.png',
    skills:  ['IoT', 'Networking', 'Embedded Systems'],
  },
  {
    title:   'Programming Foundations: Software Testing / QA',
    issuer:  'LinkedIn Learning',
    issuerType: 'li',
    image:   '/certifications/programming-foundations-testing-1.png',
    skills:  ['Software Testing', 'QA', 'Test Cases', 'Debugging'],
  },
  {
    title:   'What Is Generative AI',
    issuer:  'LinkedIn Learning',
    issuerType: 'li',
    image:   '/certifications/generative-ai-1.png',
    skills:  ['Generative AI', 'LLMs', 'Prompt Engineering'],
  },
]

const ISSUER_BADGE = {
  fm: { label: 'Frontend Masters', color: '#e8443a', bg: 'rgba(232,68,58,0.12)', border: 'rgba(232,68,58,0.35)' },
  li: { label: 'LinkedIn Learning', color: '#0a66c2', bg: 'rgba(10,102,194,0.12)', border: 'rgba(10,102,194,0.35)' },
  gl: { label: 'Great Learning',    color: '#2ea043', bg: 'rgba(46,160,67,0.12)',  border: 'rgba(46,160,67,0.35)'  },
}

// ── rAF-lerp tilt hook (same pattern as Projects) ────────────────────────────
function useTilt(strength = 14) {
  const cardRef = useRef(null)
  const rafId   = useRef(null)
  const target  = useRef({ rx: 0, ry: 0, sc: 1 })
  const current = useRef({ rx: 0, ry: 0, sc: 1 })

  function tick() {
    const c = current.current
    const t = target.current
    const L = 0.095
    c.rx += (t.rx - c.rx) * L
    c.ry += (t.ry - c.ry) * L
    c.sc += (t.sc - c.sc) * L

    if (cardRef.current) {
      cardRef.current.style.transform =
        `perspective(900px) rotateX(${c.rx.toFixed(3)}deg) rotateY(${c.ry.toFixed(3)}deg) scale(${c.sc.toFixed(4)})`
    }

    const settled =
      Math.abs(c.rx - t.rx) < 0.003 &&
      Math.abs(c.ry - t.ry) < 0.003 &&
      Math.abs(c.sc - t.sc) < 0.0003

    rafId.current = settled ? null : requestAnimationFrame(tick)
  }

  function kick() {
    if (!rafId.current) rafId.current = requestAnimationFrame(tick)
  }

  function onMouseMove(e) {
    const el = cardRef.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    const nx = (e.clientX - r.left)  / r.width  - 0.5
    const ny = (e.clientY - r.top)   / r.height - 0.5
    target.current = { rx: -ny * strength * 0.85, ry: nx * strength, sc: 1.04 }
    el.style.borderColor = BORDER_HOVER
    el.style.boxShadow   = GLOW_HOVER
    kick()
  }

  function onMouseLeave() {
    target.current = { rx: 0, ry: 0, sc: 1 }
    if (cardRef.current) {
      cardRef.current.style.borderColor = BORDER_REST
      cardRef.current.style.boxShadow   = GLOW_AMBIENT
    }
    kick()
  }

  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current) }, [])

  return { cardRef, onMouseMove, onMouseLeave }
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ cert, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
          cursor: 'zoom-out',
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: 900, width: '100%',
            background: 'var(--surface)',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: 20,
            boxShadow: '0 0 0 1px rgba(245,158,11,0.2), 0 0 60px rgba(245,158,11,0.2)',
            overflow: 'hidden',
            cursor: 'default',
          }}
        >
          <img
            src={cert.image}
            alt={cert.title}
            style={{ width: '100%', display: 'block', borderRadius: '20px 20px 0 0' }}
          />
          <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>{cert.title}</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{cert.issuer}</p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                border: '1px solid rgba(245,158,11,0.35)',
                background: 'transparent',
                color: 'var(--accent)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Cert Card ─────────────────────────────────────────────────────────────────
function CertCard({ cert, index, onView }) {
  const badge = ISSUER_BADGE[cert.issuerType]
  const { cardRef, onMouseMove, onMouseLeave } = useTilt()

  return (
    // Outer motion.div — scroll fade-in only, no transform
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ height: '100%' }}
    >
      {/* Inner div — owns all 3D + glow, no CSS transition on transform */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => onView(cert)}
        style={{
          height: '100%',
          background: 'var(--surface)',
          border: `1px solid ${BORDER_REST}`,
          borderRadius: 16,
          boxShadow: GLOW_AMBIENT,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          willChange: 'transform',
        }}
      >
        {/* Certificate image */}
        <div style={{ position: 'relative', overflow: 'hidden', lineHeight: 0 }}>
          <img
            src={cert.image}
            alt={cert.title}
            style={{
              width: '100%',
              aspectRatio: '16/10',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
            }}
          />
          {/* Expand hint overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.55) 100%)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            padding: 12,
            opacity: 0,
            transition: 'opacity 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
          >
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' }}>
              Click to expand
            </span>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            color: badge.color,
            background: badge.bg,
            border: `1px solid ${badge.border}`,
            borderRadius: 99,
            padding: '3px 10px',
            letterSpacing: 0.5,
            alignSelf: 'flex-start',
          }}>
            {badge.label}
          </span>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
            {cert.title}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {cert.skills.map(s => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: 99,
                  padding: '2px 10px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Certifications() {
  const [lightbox, setLightbox] = useState(null)
  const isMobile = useIsMobile()

  return (
    <section
      id="certifications"
      style={{ background: 'var(--background)', padding: isMobile ? '64px 20px' : '100px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}
        >
          Verified learning
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 64 }}
        >
          My <span style={{ color: 'var(--accent)' }}>Certifications</span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 28,
        }}>
          {CERTS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} onView={setLightbox} />
          ))}
        </div>

      </div>

      {lightbox && <Lightbox cert={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  )
}
