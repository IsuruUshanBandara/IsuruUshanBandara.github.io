import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

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
  const [scrolled,   setScrolled]   = useState(false)
  const [active,     setActive]     = useState('')
  const [menuOpen,   setMenuOpen]   = useState(false)
  const isMobile    = useIsMobile()
  // Prevent scroll handler from clearing active while a click-initiated scroll is still animating
  const justClicked = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      // Clear the active highlight only when scrolled to the very top AND it wasn't
      // triggered by a nav-link click (which starts from near the top)
      if (!justClicked.current && window.scrollY < 80) setActive('')
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => { if (!isMobile) setMenuOpen(false) }, [isMobile])

  const handleLinkClick = (href) => {
    setActive(href)
    setMenuOpen(false)
    // Suppress the scroll-based clear for long enough for smooth-scroll to pass the 80px mark
    justClicked.current = true
    setTimeout(() => { justClicked.current = false }, 900)
  }

  return (
    <>
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
          justifyContent: isMobile ? 'space-between' : 'center',
          padding: isMobile ? '0 20px' : '0',
          background: scrolled || menuOpen ? 'rgba(4,3,0,0.96)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(14px)' : 'none',
          transition: 'background 0.4s, backdrop-filter 0.4s',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {/* Mobile: logo */}
        {isMobile && (
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
            IU<span style={{ color: 'var(--accent)', textShadow: BRACKET_GLOW }}>.</span>
          </span>
        )}

        {/* Desktop: bracketed nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 300, lineHeight: 1, color: 'var(--accent)', textShadow: BRACKET_GLOW, userSelect: 'none', marginRight: 4 }}>[</span>
            <ul style={{ display: 'flex', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}>
              {LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: active === link.href ? 600 : 500,
                      color: active === link.href ? 'var(--accent)' : 'rgba(255,255,255,0.72)',
                      padding: '0 16px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => { e.currentTarget.style.color = active === link.href ? 'var(--accent)' : 'rgba(255,255,255,0.72)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <span style={{ fontSize: 32, fontWeight: 300, lineHeight: 1, color: 'var(--accent)', textShadow: BRACKET_GLOW, userSelect: 'none', marginLeft: 4 }}>]</span>
          </div>
        )}

        {/* Mobile: hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              alignItems: 'flex-end',
            }}
          >
            <motion.span animate={{ width: menuOpen ? 24 : 24, rotate: menuOpen ? 45 : 0, y: menuOpen ? 9 : 0 }} style={{ display: 'block', height: 2, width: 24, background: 'var(--accent)', borderRadius: 2, transformOrigin: 'center' }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1, width: menuOpen ? 0 : 16 }} style={{ display: 'block', height: 2, width: 16, background: 'var(--accent)', borderRadius: 2 }} />
            <motion.span animate={{ width: menuOpen ? 24 : 24, rotate: menuOpen ? -45 : 0, y: menuOpen ? -9 : 0 }} style={{ display: 'block', height: 2, width: 24, background: 'var(--accent)', borderRadius: 2, transformOrigin: 'center' }} />
          </button>
        )}
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 64, left: 0, right: 0,
              zIndex: 99,
              background: 'rgba(4,3,0,0.97)',
              backdropFilter: 'blur(14px)',
              borderBottom: '1px solid rgba(245,158,11,0.2)',
              padding: '16px 0 24px',
            }}
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'block',
                  padding: '14px 28px',
                  textDecoration: 'none',
                  fontSize: 15,
                  fontWeight: active === link.href ? 700 : 500,
                  color: active === link.href ? 'var(--accent)' : 'rgba(255,255,255,0.72)',
                  borderLeft: active === link.href ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
