import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.21, 1.11, 0.81, 0.99] },
  }),
}

const SKILL_GROUPS = [
  {
    category: 'Frontend',
    icon: '🖥️',
    skills: ['Angular', 'React.js', 'React Native', 'JavaScript (ES6+)', 'HTML5', 'CSS3 / SCSS', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    category: 'Backend Integration',
    icon: '🔗',
    skills: ['Node.js', 'Express.js', 'ASP.NET (C#)', 'Java / JSP', 'REST APIs', 'Spring Boot (integration)'],
  },
  {
    category: 'Cloud & Databases',
    icon: '☁️',
    skills: ['Firebase (Firestore, Realtime DB, Auth)', 'MS SQL Server', 'MySQL', 'Azure'],
  },
  {
    category: 'Tools & Practices',
    icon: '🛠️',
    skills: ['Git & GitHub', 'Vite', 'Web Accessibility (WCAG)', 'User Testing', 'Framer Motion', 'Figma'],
  },
]

function SkillPill({ label, index }) {
  return (
    <motion.span
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{
        scale: 1.12,
        y: -5,
        borderColor: 'rgba(245,158,11,0.7)',
        color: 'var(--accent)',
        backgroundColor: 'rgba(245, 158, 11, 0.09)',
        boxShadow: '0 0 10px rgba(245,158,11,0.3), 0 0 22px rgba(245,158,11,0.12)',
        transition: { type: 'spring', stiffness: 420, damping: 16 },
      }}
      style={{
        display: 'inline-block',
        padding: '6px 16px',
        border: '1px solid var(--border)',
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--text-secondary)',
        background: 'var(--surface-hover)',
        cursor: 'default',
      }}
    >
      {label}
    </motion.span>
  )
}

function SkillCard({ group, cardIndex }) {
  return (
    <motion.div
      custom={cardIndex}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        background: 'var(--surface)',
        border: '1px solid rgba(245,158,11,0.18)',
        borderRadius: 16,
        padding: '32px 28px',
        boxShadow: '0 0 0 1px rgba(245,158,11,0.12), 0 0 18px rgba(245,158,11,0.08), 0 0 40px rgba(245,158,11,0.03)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      whileHover={{
        scale: 1.01,
        borderColor: 'rgba(245,158,11,0.55)',
        boxShadow: '0 0 0 1px rgba(245,158,11,0.55), 0 0 24px rgba(245,158,11,0.28), 0 0 55px rgba(245,158,11,0.10)',
        transition: { duration: 0.28 },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 24 }}>{group.icon}</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {group.category}
        </h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {group.skills.map((skill, i) => (
          <SkillPill key={skill} label={skill} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section
      id="skills"
      style={{ background: 'var(--surface)', padding: '100px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}
        >
          What I work with
        </motion.p>

        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 64 }}
        >
          My <span style={{ color: 'var(--accent)' }}>Skills</span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {SKILL_GROUPS.map((group, i) => (
            <SkillCard key={group.category} group={group} cardIndex={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
