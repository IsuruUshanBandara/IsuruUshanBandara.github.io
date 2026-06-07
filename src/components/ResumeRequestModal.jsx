import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

function inputStyle(focused) {
  return {
    width: '100%',
    padding: '12px 16px',
    background: '#040300',
    border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  }
}

export default function ResumeRequestModal({ onClose }) {
  const [form, setForm]       = useState({ name: '', company: '', purpose: '' })
  const [focused, setFocused] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const docRef = await addDoc(collection(db, 'resumeRequests'), {
        name:      form.name.trim(),
        company:   form.company.trim(),
        purpose:   form.purpose.trim(),
        status:    'pending',
        createdAt: serverTimestamp(),
      })
      // Save the request ID to localStorage so we can check status later
      localStorage.setItem('resumeRequestId', docRef.id)
      setDone(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#161B22',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 40,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
        >
          {!done ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                  Request My Resume
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  I review every request personally. Fill in the details below and I'll approve it shortly.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Your Name <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused(f => ({ ...f, name: true }))}
                    onBlur={() => setFocused(f => ({ ...f, name: false }))}
                    placeholder="John Smith"
                    required
                    style={inputStyle(focused.name)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Company / Organisation
                    <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: 12 }}>(optional)</span>
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    onFocus={() => setFocused(f => ({ ...f, company: true }))}
                    onBlur={() => setFocused(f => ({ ...f, company: false }))}
                    placeholder="Acme Corp"
                    style={inputStyle(focused.company)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Purpose <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <textarea
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    onFocus={() => setFocused(f => ({ ...f, purpose: true }))}
                    onBlur={() => setFocused(f => ({ ...f, purpose: false }))}
                    placeholder="e.g. Hiring for a frontend developer role at our company..."
                    required
                    rows={3}
                    style={{ ...inputStyle(focused.purpose), resize: 'vertical' }}
                  />
                </div>

                {error && (
                  <p style={{ color: '#f85149', fontSize: 13, margin: 0 }}>{error}</p>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1, padding: '12px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: 8,
                      color: 'var(--text-secondary)', fontSize: 14,
                      fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 2, padding: '12px',
                      background: loading ? 'var(--surface)' : 'var(--accent)',
                      border: 'none', borderRadius: 8,
                      color: loading ? 'var(--text-muted)' : '#040300',
                      fontSize: 14, fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)' }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--accent-muted)',
                border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: 28,
              }}>
                ✓
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                Request Submitted!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 28px' }}>
                Your request has been received. Come back to this page once it's approved —
                the Resume button will automatically update to let you download it.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 32px',
                  background: 'var(--accent)',
                  border: 'none', borderRadius: 8,
                  color: '#040300', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Got it
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
