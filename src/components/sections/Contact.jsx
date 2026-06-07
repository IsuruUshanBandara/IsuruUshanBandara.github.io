import { useState } from 'react'
import { motion } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'isuruushan2003@gmail.com',
    href: 'mailto:isuruushan2003@gmail.com',
    icon: '✉️',
  },
  {
    label: 'GitHub',
    value: 'github.com/IsuruUshanBandara',
    href: 'https://github.com/IsuruUshanBandara',
    icon: '🐙',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/isuru-ushan-b2761a24a',
    href: 'https://linkedin.com/in/isuru-ushan-b2761a24a',
    icon: '💼',
  },
  {
    label: 'Phone',
    value: '(071) 266-3115',
    href: 'tel:+94712663115',
    icon: '📱',
  },
]

function inputStyle(focused) {
  return {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--background)',
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

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState({})
  const [status, setStatus]   = useState('idle') // idle | sending | sent | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name:      form.name,
        email:     form.email,
        message:   form.message,
        read:      false,
        createdAt: serverTimestamp(),
      })
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error('Contact form error:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section
      id="contact"
      style={{ background: 'var(--surface)', padding: '100px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ color: 'var(--accent)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}
        >
          Let's work together
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}
        >
          Get In <span style={{ color: 'var(--accent)' }}>Touch</span>
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 64, maxWidth: 540 }}
        >
          I'm open to remote frontend opportunities. Whether it's a full-time role, freelance project,
          or just a chat — my inbox is open.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>

          {/* Contact links */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {CONTACT_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== 'Phone' && link.label !== 'Email' ? '_blank' : undefined}
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '20px 24px',
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.transform = 'translateX(6px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ fontSize: 22 }}>{link.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
                    {link.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {link.value}
                  </div>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Contact form */}
          <motion.form
            custom={4}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused(f => ({ ...f, name: true }))}
                onBlur={() => setFocused(f => ({ ...f, name: false }))}
                placeholder="Your name"
                required
                style={inputStyle(focused.name)}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused(f => ({ ...f, email: true }))}
                onBlur={() => setFocused(f => ({ ...f, email: false }))}
                placeholder="your@email.com"
                required
                style={inputStyle(focused.email)}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused(f => ({ ...f, message: true }))}
                onBlur={() => setFocused(f => ({ ...f, message: false }))}
                placeholder="What's on your mind?"
                required
                rows={5}
                style={{ ...inputStyle(focused.message), resize: 'vertical' }}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              style={{
                padding: '13px 32px',
                background:
                  status === 'sent'    ? 'var(--surface)' :
                  status === 'error'   ? 'rgba(248,81,73,0.12)' :
                  'var(--accent)',
                color:
                  status === 'sent'    ? 'var(--accent)' :
                  status === 'error'   ? '#f85149' :
                  '#040300',
                border:
                  status === 'sent'    ? '1px solid var(--accent)' :
                  status === 'error'   ? '1px solid #f85149' :
                  'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 15,
                cursor: status === 'sending' || status === 'sent' ? 'default' : 'pointer',
                opacity: status === 'sending' ? 0.7 : 1,
                transition: 'background 0.2s, color 0.2s, opacity 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (status === 'idle') e.currentTarget.style.background = 'var(--accent-hover)' }}
              onMouseLeave={e => { if (status === 'idle') e.currentTarget.style.background = 'var(--accent)' }}
            >
              {status === 'sending' ? 'Sending…'        :
               status === 'sent'    ? '✓ Message sent!' :
               status === 'error'   ? '✕ Failed — try again' :
               'Send Message'}
            </button>
          </motion.form>

        </div>
      </div>
    </section>
  )
}
