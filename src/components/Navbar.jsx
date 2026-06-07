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
        padding: '0 40px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(4,3,0,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Logo */}
      <a href="#hero" style={{ textDecoration: 'none' }}>
        <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
          IU<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
      </a>

      {/* Nav links */}
      <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
        {LINKS.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={() => setActive(link.href)}
              style={{
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                color: active === link.href ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
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

      {/* Glowing bottom border line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '1px',
        background: `rgba(245,158,11,${scrolled ? '0.55' : '0.28'})`,
        boxShadow: scrolled
          ? '0 0 8px rgba(245,158,11,0.6), 0 0 22px rgba(245,158,11,0.3), 0 0 50px rgba(245,158,11,0.12)'
          : '0 0 6px rgba(245,158,11,0.35), 0 0 16px rgba(245,158,11,0.14)',
        transition: 'background 0.4s, box-shadow 0.4s',
      }} />
    </motion.nav>
  )
}
