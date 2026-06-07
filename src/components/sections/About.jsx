import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.21, 1.11, 0.81, 0.99] },
  },
}

// ── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(end * ease))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration])

  return { count, ref }
}

const STATS = [
  { end: 5,  suffix: '+', label: 'Projects Shipped' },
  { end: 6,  suffix: '',  label: 'Certifications'   },
  { end: 8,  suffix: '+', label: 'Technologies'      },
]

function StatCard({ end, suffix, label }) {
  const { count, ref } = useCountUp(end)
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  )
}

export default function About() {
  const photoRef = useRef(null)
  const photoInView = useInView(photoRef, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      style={{ background: 'var(--surface)', padding: '100px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}
        >
          Get to know me
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 64 }}
        >
          About <span style={{ color: 'var(--accent)' }}>Me</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* ── Avatar with SVG border draw-in ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div ref={photoRef} style={{ position: 'relative', width: 280, height: 280 }}>
              {/* Animated SVG ring */}
              <svg
                style={{
                  position: 'absolute',
                  top: -8, left: -8,
                  width: 296, height: 296,
                  overflow: 'visible',
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.55)) drop-shadow(0 0 18px rgba(245,158,11,0.25))',
                }}
                viewBox="0 0 296 296"
              >
                <motion.circle
                  cx="148" cy="148" r="145"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={photoInView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
                />
              </svg>

              {/* Avatar circle */}
              <div style={{
                position: 'relative',
                width: '100%', height: '100%',
                borderRadius: '50%',
                background: 'var(--background)',
                border: '3px solid var(--surface)',
                overflow: 'hidden',
              }}>
                <img
                  src="/profile.webp"
                  alt="Isuru Ushan Bandara"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 18%',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Bio text ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Hey! I'm <strong style={{ color: 'var(--text-primary)' }}>Isuru Ushan Bandara</strong>, a
              Software Engineer from Sri Lanka with a passion for building fast, accessible, and
              visually engaging web experiences.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 20 }}>
              I hold a <strong style={{ color: 'var(--text-primary)' }}>BSc (Hons) in Software Engineering</strong> from
              the University of Plymouth (Second Class Upper Division), and I currently freelance for a
              US-based client — leading Angular frontends that talk to Spring Boot backends, while
              keeping WCAG accessibility front and centre.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 36 }}>
              When I'm not coding, I'm exploring UI design trends, tinkering with animations, or thinking
              about how to make the next project even more intuitive. I'm open to remote roles where
              creativity meets clean code.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'GitHub',   href: 'https://github.com/IsuruUshanBandara' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/isuru-ushan-b2761a24a' },
                { label: 'Email',    href: 'mailto:isuruushan2003@gmail.com' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 20px',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Count-up stats ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
            marginTop: 80,
            padding: '40px 32px',
            background: 'var(--background)',
            borderRadius: 16,
            border: '1px solid rgba(245,158,11,0.18)',
            boxShadow: '0 0 0 1px rgba(245,158,11,0.08), 0 0 28px rgba(245,158,11,0.07), 0 0 60px rgba(245,158,11,0.03)',
          }}
        >
          {STATS.map(stat => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
