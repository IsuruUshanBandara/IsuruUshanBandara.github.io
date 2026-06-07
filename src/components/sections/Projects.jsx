import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

const PROJECTS = [
  {
    title: 'PersonaPrep',
    subtitle: 'Career Readiness Platform',
    tags: ['React.js', 'Firebase', 'OpenAI', 'Whisper AI', 'ElevenLabs'],
    description:
      'A multi-template CV builder with PDF export, AI-powered interview simulation using voice, and an admin analytics dashboard for university career guidance units.',
    live: 'https://personaprep.web.app/',
    github: null,
    featured: true,
  },
  {
    title: 'GradLodge',
    subtitle: 'Accommodation Management System',
    tags: ['ASP.NET', 'C#', 'SQL Server', 'Selenium'],
    description:
      'Multi-role accommodation platform for Students, Landlords, Wardens and Admins — featuring map integration, reservation workflows, and full xUnit/Selenium test coverage.',
    live: null,
    github: 'https://github.com/Shaveen-Balasooriya/GradLodge',
    featured: true,
  },
  {
    title: 'Green Supermarket',
    subtitle: 'Online Supermarket Application',
    tags: ['Java EE', 'JSP', 'MySQL', 'Azure', 'PayPal'],
    description:
      'Full-stack online supermarket built with a 4-person team. MVC architecture, PayPal Sandbox checkout, admin dashboard, deployed on Azure with Cloudflare SSL.',
    live: null,
    github: 'https://github.com/Shaveen-Balasooriya/GreenSupermarket',
    featured: true,
  },
  {
    title: 'MediCare',
    subtitle: 'Pharmacy Inventory Management System',
    tags: ['React.js', 'Node.js', 'MySQL', 'JWT', 'Material UI'],
    description:
      'Full-stack pharmacy system with real-time low-stock alerts, barcode scanning, POS processing, JWT auth, and a PDF analytics dashboard.',
    live: null,
    github: 'https://github.com/gaihesh/project_0001',
    featured: false,
  },
  {
    title: 'BusRouteMate',
    subtitle: 'Public Transport Mobile App',
    tags: ['React Native', 'Firebase', 'Google Maps API'],
    description:
      'Mobile app digitalising public bus transport across three roles — owners, drivers, passengers — with real-time GPS tracking, multilingual support, and a serverless Firebase backend.',
    live: null,
    github: 'https://github.com/IsuruUshanBandara/BusRouteMate',
    featured: false,
  },
]

// ── Glow constants ────────────────────────────────────────────────────────────
const GLOW_AMBIENT = '0 0 0 1px rgba(245,158,11,0.12), 0 0 18px rgba(245,158,11,0.08), 0 0 40px rgba(245,158,11,0.03)'
const GLOW_HOVER   = '0 0 0 1px rgba(245,158,11,0.55), 0 0 24px rgba(245,158,11,0.28), 0 0 55px rgba(245,158,11,0.10)'

// ── Smooth rAF-lerp tilt hook ────────────────────────────────────────────────
function useTilt(strength = 14) {
  const cardRef = useRef(null)
  const rafId   = useRef(null)
  const target  = useRef({ rx: 0, ry: 0, sc: 1 })
  const current = useRef({ rx: 0, ry: 0, sc: 1 })

  // lerp loop — runs every frame until values settle
  function tick() {
    const c = current.current
    const t = target.current
    const L = 0.095                         // lerp speed — lower = silkier
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
    el.style.borderColor = 'rgba(245,158,11,0.55)'
    el.style.boxShadow   = GLOW_HOVER
    kick()
  }

  function onMouseLeave() {
    target.current = { rx: 0, ry: 0, sc: 1 }
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(245,158,11,0.18)'
      cardRef.current.style.boxShadow   = GLOW_AMBIENT
    }
    kick()
  }

  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current) }, [])

  return { cardRef, onMouseMove, onMouseLeave }
}

// ── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const { cardRef, onMouseMove, onMouseLeave } = useTilt()

  return (
    // Outer motion.div handles ONLY the fade-in — zero transform conflict
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.21, 1.11, 0.81, 0.99] }}
    >
      {/* Inner div owns all 3D transforms — no CSS transition here */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(245,158,11,0.18)',
          borderRadius: 16,
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
          cursor: 'default',
          height: '100%',
          willChange: 'transform',
          boxShadow: GLOW_AMBIENT,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {project.featured && (
          <span style={{
            position: 'absolute', top: 20, right: 20,
            background: 'var(--accent-muted)',
            color: 'var(--accent)',
            fontSize: 11, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 99,
            border: '1px solid var(--accent)',
          }}>
            Featured
          </span>
        )}

        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {project.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--accent)', margin: '4px 0 0', fontWeight: 500 }}>
            {project.subtitle}
          </p>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0, flexGrow: 1 }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 12, fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 99, padding: '3px 12px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13, fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              ↗ GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13, fontWeight: 600,
                color: 'var(--accent)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
            >
              ↗ Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Projects() {
  return (
    <section
      id="projects"
      style={{ background: 'var(--surface)', padding: '100px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}
        >
          Things I've built
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.21, 1.11, 0.81, 0.99] }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 64 }}
        >
          My <span style={{ color: 'var(--accent)' }}>Projects</span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
