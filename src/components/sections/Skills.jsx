import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'

const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, delay: i * 0.04, ease: [0.21, 1.11, 0.81, 0.99] },
  }),
}

// icon: devicon class name | iconUrl: absolute/relative URL | null = no icon
// Skills with icons first, no-icon skills at the end
const SKILLS = [
  // ── Highlighted first ────────────────────────────────────────────────
  { name: 'WCAG',               iconUrl: 'https://www.wcag.com/wp-content/uploads/2025/09/level_icon_header_logo.svg' },
  // ── Languages & Frameworks ────────────────────────────────────────────
  { name: 'Angular',            icon: 'devicon-angular-plain colored'              },
  { name: 'React.js',           icon: 'devicon-react-original colored'             },
  { name: 'React Native',       icon: 'devicon-react-original colored'             },
  { name: 'JavaScript (ES6+)',  icon: 'devicon-javascript-plain colored'           },
  { name: 'HTML',               icon: 'devicon-html5-plain colored'                },
  { name: 'CSS3 / SCSS',        icon: 'devicon-sass-original colored'              },
  { name: 'Tailwind CSS',       icon: 'devicon-tailwindcss-plain colored'          },
  { name: 'Bootstrap',          icon: 'devicon-bootstrap-plain colored'            },
  { name: 'Material UI',        icon: 'devicon-materialui-plain colored'           },
  { name: 'Expo',               icon: 'devicon-expo-original'                      },
  { name: 'Node.js',            icon: 'devicon-nodejs-plain colored'               },
  { name: 'Express.js',         icon: 'devicon-express-original'                   },
  { name: 'ASP.NET (C#)',       icon: 'devicon-dot-net-plain colored'              },
  { name: 'Spring Boot',        icon: 'devicon-spring-plain colored'               },
  { name: 'Java / JSP',         icon: 'devicon-java-plain colored'                 },
  { name: 'C',                  icon: 'devicon-c-plain colored'                    },
  { name: 'C#',                 icon: 'devicon-csharp-plain colored'               },
  { name: 'PHP',                icon: 'devicon-php-plain colored'                  },
  { name: 'Python',             icon: 'devicon-python-plain colored'               },
  // ── Databases & Cloud ────────────────────────────────────────────────
  { name: 'Firebase',           icon: 'devicon-firebase-plain colored'             },
  { name: 'MySQL',              icon: 'devicon-mysql-plain colored'                },
  { name: 'MS SQL Server',      icon: 'devicon-microsoftsqlserver-plain colored'   },
  { name: 'MongoDB',            icon: 'devicon-mongodb-plain colored'              },
  // ── Tools ────────────────────────────────────────────────────────────
  { name: 'Git & GitHub',       icon: 'devicon-git-plain colored'                  },
  { name: 'Figma',              icon: 'devicon-figma-plain colored'                },
  { name: 'Vite',               icon: 'devicon-vitejs-plain colored'               },
  { name: 'Docker',             icon: 'devicon-docker-plain colored'               },
  { name: 'Postman',            icon: 'devicon-postman-plain colored'              },
  { name: 'Google Maps',        iconUrl: 'https://cdn.simpleicons.org/googlemaps'  },
  { name: 'i18next',            iconUrl: 'https://cdn.simpleicons.org/i18next'     },
  { name: 'Gifted Charts',      iconUrl: '/gifted-charts.svg'                      },
  { name: 'React Native Paper', iconUrl: '/react-native-paper.svg'                 },
  { name: 'Draw.io',            iconUrl: 'https://cdn.simpleicons.org/diagramsdotnet' },
]

const GLOW_HOVER = '0 0 0 1px rgba(245,158,11,0.70), 0 0 26px rgba(245,158,11,0.40), 0 0 55px rgba(245,158,11,0.16)'

function SkillTile({ skill, index }) {
  const hasIcon = !!(skill.icon || skill.iconUrl)

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <motion.div
        whileHover={{
          scale: 1.07,
          y: -4,
          borderColor: 'rgba(245,158,11,0.70)',
          boxShadow: GLOW_HOVER,
          transition: { type: 'spring', stiffness: 380, damping: 18 },
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: hasIcon ? 12 : 0,
          padding: '22px 12px',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(245,158,11,0.18)',
          borderRadius: 14,
          cursor: 'default',
          minHeight: 96,
          height: '100%',
        }}
      >
        {skill.iconUrl ? (
          <img
            src={skill.iconUrl}
            alt={skill.name}
            style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }}
          />
        ) : skill.icon ? (
          <i
            className={skill.icon}
            style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}
          />
        ) : null}

        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: 0.3,
        }}>
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function Skills() {
  const isMobile = useIsMobile()

  return (
    <section
      id="skills"
      style={{ background: 'var(--surface)', padding: isMobile ? '64px 20px' : '100px 24px' }}
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
          gridTemplateColumns: isMobile
            ? 'repeat(3, 1fr)'
            : 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: isMobile ? 12 : 16,
        }}>
          {SKILLS.map((skill, i) => (
            <SkillTile
              key={skill.name}
              skill={skill}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
