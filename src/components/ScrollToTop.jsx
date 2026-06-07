import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          onClick={scrollUp}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0,  scale: 1   }}
          exit={{    opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          whileHover={{ scale: 1.12, boxShadow: '0 0 0 1px rgba(245,158,11,0.8), 0 0 20px rgba(245,158,11,0.5), 0 0 44px rgba(245,158,11,0.2)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: 36,
            right: 36,
            zIndex: 200,
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'rgba(4,3,0,0.85)',
            border: '1px solid rgba(245,158,11,0.45)',
            color: 'var(--accent)',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 0 1px rgba(245,158,11,0.28), 0 0 14px rgba(245,158,11,0.2)',
            transition: 'box-shadow 0.2s',
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}
