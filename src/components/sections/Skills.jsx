import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.21, 1.11, 0.81, 0.99] },
  }),
}

// icon: devicon class name, or null for skills with no devicon
const SKILL_GROUPS = [
  {
    category: 'Frontend',
    skills: [
      { name: 'Angular',           icon: 'devicon-angular-plain colored'        },
      { name: 'React.js',          icon: 'devicon-react-original colored'        },
      { name: 'React Native',      icon: 'devicon-react-original colored'        },
      { name: 'JavaScript (ES6+)', icon: 'devicon-javascript-plain colored'      },
      { name: 'HTML5',             icon: 'devicon-html5-plain colored'           },
      { name: 'CSS3 / SCSS',       icon: 'devicon-sass-original colored'         },
      { name: 'Tailwind CSS',      icon: 'devicon-tailwindcss-plain colored'     },
      { name: 'Bootstrap',         icon: 'devicon-bootstrap-plain colored'       },
    ],
  },
  {
    category: 'Backend Integration',
    skills: [
      { name: 'Node.js',              icon: 'devicon-nodejs-plain colored'       },
      { name: 'Express.js',           icon: 'devicon-express-original'           },
      { name: 'ASP.NET (C#)',         icon: 'devicon-csharp-plain colored'       },
      { name: 'Java / JSP',           icon: 'devicon-java-plain colored'         },
      { name: 'REST APIs',            icon: null                                  },
      { name: 'Spring Boot',          icon: 'devicon-spring-plain colored'       },
    ],
  },
  {
    category: 'Cloud & Databases',
    skills: [
      { name: 'Firebase',      icon: 'devicon-firebase-plain colored'            },
      { name: 'MySQL',         icon: 'devicon-mysql-plain colored'               },
      { name: 'MS SQL Server', icon: 'devicon-microsoftsqlserver-plain colored'  },
      { name: 'Azure',         icon: 'devicon-azure-plain colored'               },
    ],
  },
  {
    category: 'Tools & Practices',
    skills: [
      { name: 'Git & GitHub',           icon: 'devicon-git-plain colored'        },
      { name: 'Figma',                  icon: 'devicon-figma-plain colored'      },
      { name: 'Vite',                   icon: 'devicon-vitejs-plain colored'     },
      { name: 'Framer Motion',          icon: null                               },
      { name: 'Web Accessibility (WCAG)', icon: null                             },
      { name: 'User Testing',           icon: null                               },
      { name: 'Draw.io',               icon: null                               },
    ],
  },
]

function SkillPill({ skill, index }) {
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
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        border: '1px solid var(--border)',
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--text-secondary)',
        background: 'var(--surface-hover)',
        cursor: 'default',
      }}
    >
      {skill.icon && (
        <i
          className={skill.icon}
          style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}
        />
      )}
      {skill.name}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ width: 3, height: 18, background: 'var(--accent)', borderRadius: 99, display: 'inline-block', boxShadow: '0 0 6px rgba(245,158,11,0.6)' }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {group.category}
        </h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {group.skills.map((skill, i) => (
          <SkillPill key={skill.name} skill={skill} index={i} />
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
