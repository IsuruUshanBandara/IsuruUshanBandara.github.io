import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import ResumeRequestModal from './ResumeRequestModal'

const LINKS = [
  { label: 'About',     href: '#about'    },
  { label: 'Skills',    href: '#skills'   },
  { label: 'Projects',  href: '#projects' },
  { label: 'Education',      href: '#education'      },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact',        href: '#contact'        },
]

// Resume button states
// 'request'  → no request made yet       → "Request Resume"
// 'pending'  → request submitted          → "Request Pending"
// 'approved' → approved by admin          → "Download Resume"
// 'rejected' → rejected by admin          → "Not Approved"

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [active,       setActive]       = useState('')
  const [modalOpen,    setModalOpen]    = useState(false)
  const [resumeStatus, setResumeStatus] = useState('request')

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Check localStorage for existing request ID and subscribe to its Firestore status
  useEffect(() => {
    const requestId = localStorage.getItem('resumeRequestId')
    if (!requestId) return

    setResumeStatus('pending') // show pending while we fetch

    const unsub = onSnapshot(doc(db, 'resumeRequests', requestId), snap => {
      if (!snap.exists()) {
        setResumeStatus('request')
        localStorage.removeItem('resumeRequestId')
      } else {
        setResumeStatus(snap.data().status) // 'pending' | 'approved' | 'rejected'
      }
    })

    return unsub
  }, [])

  // Called after modal submits successfully — re-subscribe
  const handleModalClose = () => {
    setModalOpen(false)
    const requestId = localStorage.getItem('resumeRequestId')
    if (requestId) setResumeStatus('pending')
  }

  const resumeButtonConfig = {
    request: {
      label:   'Request Resume',
      border:  'var(--accent)',
      color:   'var(--accent)',
      bg:      'transparent',
      hoverBg: 'var(--accent)',
      hoverColor: '#040300',
      action: () => setModalOpen(true),
    },
    pending: {
      label:   '⏳ Request Pending',
      border:  '#e3b341',
      color:   '#e3b341',
      bg:      'transparent',
      hoverBg: 'transparent',
      hoverColor: '#e3b341',
      action: () => {},
    },
    approved: {
      label:   '↗ View Resume',
      border:  'var(--accent)',
      color:   '#040300',
      bg:      'var(--accent)',
      hoverBg: 'var(--accent-hover)',
      hoverColor: '#040300',
      action: () => {
        window.open('/Resume_Isuru.pdf', '_blank')
      },
    },
    rejected: {
      label:   '✕ Not Approved',
      border:  '#f85149',
      color:   '#f85149',
      bg:      'transparent',
      hoverBg: 'transparent',
      hoverColor: '#f85149',
      action: () => {},
    },
  }

  const btn = resumeButtonConfig[resumeStatus] || resumeButtonConfig.request

  return (
    <>
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

        {/* Smart Resume button */}
        <button
          onClick={btn.action}
          style={{
            padding: '8px 20px',
            border: `1px solid ${btn.border}`,
            background: btn.bg,
            color: btn.color,
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: resumeStatus === 'pending' || resumeStatus === 'rejected' ? 'default' : 'pointer',
            transition: 'background 0.2s, color 0.2s',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = btn.hoverBg
            e.currentTarget.style.color      = btn.hoverColor
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = btn.bg
            e.currentTarget.style.color      = btn.color
          }}
        >
          {btn.label}
        </button>
      </motion.nav>

      {/* Request modal */}
      {modalOpen && <ResumeRequestModal onClose={handleModalClose} />}
    </>
  )
}
