import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'

// ⚠️ Change this password to something only you know
const ADMIN_PASSWORD = 'isuru@admin2025'

function StatusBadge({ status }) {
  const map = {
    pending:  { color: '#e3b341', bg: 'rgba(227,179,65,0.1)',  label: 'Pending'  },
    approved: { color: '#3fb950', bg: 'rgba(63,185,80,0.1)',   label: 'Approved' },
    rejected: { color: '#f85149', bg: 'rgba(248,81,73,0.1)',   label: 'Rejected' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      color: s.color, background: s.bg,
      border: `1px solid ${s.color}`,
      borderRadius: 99, padding: '3px 10px',
      textTransform: 'uppercase', letterSpacing: 1,
    }}>
      {s.label}
    </span>
  )
}

function RequestCard({ req, onApprove, onReject }) {
  const date = req.createdAt?.toDate?.()?.toLocaleString() ?? '—'

  return (
    <div style={{
      background: '#161B22',
      border: '1px solid #2a2000',
      borderRadius: 12,
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#F0F6FC' }}>{req.name}</p>
          {req.company && (
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#f59e0b' }}>{req.company}</p>
          )}
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* Purpose */}
      <div style={{ background: '#040300', borderRadius: 8, padding: '12px 16px' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#8B949E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Purpose</p>
        <p style={{ margin: 0, fontSize: 14, color: '#C9D1D9', lineHeight: 1.6 }}>{req.purpose}</p>
      </div>

      {/* Date + Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: '#484F58' }}>{date}</span>

        {req.status === 'pending' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => onReject(req.id)}
              title="Reject"
              style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'rgba(248,81,73,0.1)',
                border: '1px solid #f85149',
                color: '#f85149', fontSize: 18,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,81,73,0.1)'}
            >
              ✕
            </button>
            <button
              onClick={() => onApprove(req.id)}
              title="Approve"
              style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid #f59e0b',
                color: '#f59e0b', fontSize: 18,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
            >
              ✓
            </button>
          </div>
        )}

        {req.status !== 'pending' && (
          <div style={{ display: 'flex', gap: 10 }}>
            {req.status === 'approved' && (
              <button
                onClick={() => onReject(req.id)}
                title="Revoke approval"
                style={{
                  padding: '6px 14px', borderRadius: 6,
                  background: 'transparent',
                  border: '1px solid #f85149',
                  color: '#f85149', fontSize: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Revoke
              </button>
            )}
            {req.status === 'rejected' && (
              <button
                onClick={() => onApprove(req.id)}
                title="Approve instead"
                style={{
                  padding: '6px 14px', borderRadius: 6,
                  background: 'transparent',
                  border: '1px solid #f59e0b',
                  color: '#f59e0b', fontSize: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed,   setAuthed]   = useState(false)
  const [password, setPassword] = useState('')
  const [pwError,  setPwError]  = useState('')
  const [requests, setRequests] = useState([])
  const [filter,   setFilter]   = useState('all')

  // Real-time Firestore listener
  useEffect(() => {
    if (!authed) return
    const q = query(collection(db, 'resumeRequests'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [authed])

  const handleLogin = e => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setPwError('Incorrect password.')
      setTimeout(() => setPwError(''), 2000)
    }
  }

  const approve = async id => {
    await updateDoc(doc(db, 'resumeRequests', id), { status: 'approved' })
  }

  const reject = async id => {
    await updateDoc(doc(db, 'resumeRequests', id), { status: 'rejected' })
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const counts = {
    all:      requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#040300',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <form
          onSubmit={handleLogin}
          style={{
            background: '#161B22', border: '1px solid #2a2000',
            borderRadius: 16, padding: 40, width: '100%', maxWidth: 360,
            display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#F0F6FC' }}>
              IU<span style={{ color: '#f59e0b' }}>.</span> Admin
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#8B949E' }}>
              Resume request management
            </p>
          </div>

          <div>
            <label style={{ fontSize: 13, color: '#8B949E', display: 'block', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: '100%', padding: '12px 16px',
                background: '#040300', border: `1px solid ${pwError ? '#f85149' : '#2a2000'}`,
                borderRadius: 8, color: '#F0F6FC', fontSize: 14,
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
            />
            {pwError && (
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#f85149' }}>{pwError}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              padding: '12px', background: '#f59e0b',
              border: 'none', borderRadius: 8,
              color: '#040300', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#040300', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#F0F6FC' }}>
              IU<span style={{ color: '#f59e0b' }}>.</span> Admin
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8B949E' }}>
              Resume Request Dashboard
            </p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            style={{
              padding: '8px 18px', background: 'transparent',
              border: '1px solid #2a2000', borderRadius: 6,
              color: '#8B949E', fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#8B949E'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2000'}
          >
            Sign out
          </button>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { key: 'all',      label: 'All',      color: '#8B949E' },
            { key: 'pending',  label: 'Pending',  color: '#e3b341' },
            { key: 'approved', label: 'Approved', color: '#3fb950' },
            { key: 'rejected', label: 'Rejected', color: '#f85149' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 18px',
                background: filter === tab.key ? `${tab.color}22` : 'transparent',
                border: `1px solid ${filter === tab.key ? tab.color : '#2a2000'}`,
                borderRadius: 99, color: filter === tab.key ? tab.color : '#8B949E',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {tab.label} · {counts[tab.key]}
            </button>
          ))}
        </div>

        {/* Request list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#484F58' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📭</p>
            <p style={{ fontSize: 14 }}>No {filter === 'all' ? '' : filter} requests yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(req => (
              <RequestCard
                key={req.id}
                req={req}
                onApprove={approve}
                onReject={reject}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
