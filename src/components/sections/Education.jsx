import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'

const fadeUp = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.21, 1.11, 0.81, 0.99] },
  }),
}

const GLOW_AMBIENT = '0 0 0 1px rgba(245,158,11,0.12), 0 0 18px rgba(245,158,11,0.08), 0 0 40px rgba(245,158,11,0.03)'
const GLOW_HOVER   = '0 0 0 1px rgba(245,158,11,0.55), 0 0 24px rgba(245,158,11,0.28), 0 0 55px rgba(245,158,11,0.10)'

const EDUCATION = [
  {
    institution: 'University of Plymouth',
    degree: 'BSc (Hons) Software Engineering',
    period: '2021 – 2025',
    detail: 'Graduated with Second Class Upper Division (Honours).',
    grades: null,
  },
  {
    institution: 'Hilburn International College',
    location: 'Avisawella',
    degree: 'Cambridge Ordinary Level Examination',
    period: '2018 – 2021',
    detail: null,
    grades: [
      { subject: 'Computer Science',       grade: 'A*' },
      { subject: 'Physics',                grade: 'A'  },
      { subject: 'Sinhala',               grade: 'A'  },
      { subject: 'Biology',               grade: 'C'  },
      { subject: 'English',               grade: 'C'  },
      { subject: 'Mathematics Syllabus D', grade: 'C'  },
      { subject: 'Chemistry',             grade: 'E'  },
    ],
  },
  {
    institution: 'Sri Lankan International School',
    location: 'Riyadh',
    degree: 'Primary & Secondary Education',
    period: '2010 – 2018',
    detail: 'Completed Grade 1 to Grade 8.',
    grades: null,
  },
]

function GradeBadge({ grade }) {
  const color =
    grade === 'A*' ? '#f59e0b' :
    grade === 'A'  ? '#2ea043' :
    grade === 'B'  ? '#3fb950' :
    grade === 'C'  ? '#8b949e' : '#6e7681'

  return (
    <span style={{ fontWeight: 700, color, fontSize: 13, minWidth: 28, display: 'inline-block' }}>
      {grade}
    </span>
  )
}

function EducationCard({ item, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ display: 'flex', gap: 24 }}
    >
      {/* Timeline dot + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--accent)',
          border: '3px solid var(--background)',
          boxShadow: '0 0 0 2px var(--accent), 0 0 10px rgba(245,158,11,0.5)',
          flexShrink: 0, marginTop: 6,
        }} />
        {index < EDUCATION.length - 1 && (
          <div style={{
            width: 1, flexGrow: 1,
            background: 'rgba(245,158,11,0.2)',
            marginTop: 8,
          }} />
        )}
      </div>

      {/* Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(245,158,11,0.18)',
          borderRadius: 16,
          padding: '28px 28px 32px',
          marginBottom: 24,
          flex: 1,
          boxShadow: GLOW_AMBIENT,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(245,158,11,0.55)'
          e.currentTarget.style.boxShadow   = GLOW_HOVER
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(245,158,11,0.18)'
          e.currentTarget.style.boxShadow   = GLOW_AMBIENT
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {item.institution}
            </h3>
            {item.location && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.location}</span>
            )}
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: 'var(--accent)',
            background: 'var(--accent-muted)',
            border: '1px solid var(--accent)',
            borderRadius: 99, padding: '3px 12px',
            whiteSpace: 'nowrap',
          }}>
            {item.period}
          </span>
        </div>

        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', margin: '0 0 12px' }}>
          {item.degree}
        </p>

        {item.detail && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            {item.detail}
          </p>
        )}

        {item.grades && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px 24px',
            marginTop: 16,
          }}>
            {item.grades.map(g => (
              <div
                key={g.subject}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: '1px solid rgba(245,158,11,0.1)',
                  paddingBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{g.subject}</span>
                <GradeBadge grade={g.grade} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Education() {
  const isMobile = useIsMobile()
  return (
    <section
      id="education"
      style={{ background: 'var(--surface)', padding: isMobile ? '64px 20px' : '100px 24px' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}
        >
          Academic background
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 64 }}
        >
          My <span style={{ color: 'var(--accent)' }}>Education</span>
        </motion.h2>

        <div>
          {EDUCATION.map((item, i) => (
            <EducationCard key={item.institution} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
