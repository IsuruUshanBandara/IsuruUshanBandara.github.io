import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'About',          href: '#about'          },
  { label: 'Skills',         href: '#skills'         },
  { label: 'Projects',       href: '#projects'       },
  { label: 'Education',      href: '#education'      },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact',        href: '#contact'        },
]

const BRACKET_GLOW = '0 0 8px rgba(245,158,11,0.9), 0 0 20px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.2)'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: scrolled ? 'rgba(4,3,0,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Bracketed nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

        {/* Left bracket */}
        <span style={{
          fontSize: 32,
          fontWeight: 300,
          lineHeight: 1,
          color: 'var(--accent)',
          textShadow: BRACKET_GLOW,
          userSelect: 'none',
          marginRight: 4,
        }}>
          [
        </span>

        {/* Links */}
        <ul style={{ display: 'flex', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}>
          {LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setActive(link.href)}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: active === link.href ? 600 : 500,
                  color: active === link.href ? 'var(--accent)' : 'var(--text-secondary)',
                  padding: '0 16px',
                  transition: 'color 0.2s, font-weight 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => {
                  e.currentTarget.style.color = active === link.href
                    ? 'var(--accent)'
                    : 'var(--text-secondary)'
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right bracket */}
        <span style={{
          fontSize: 32,
          fontWeight: 300,
          lineHeight: 1,
          color: 'var(--accent)',
          textShadow: BRACKET_GLOW,
          userSelect: 'none',
          marginLeft: 4,
        }}>
          ]
        </span>

      </div>
    </motion.nav>
  )
}
