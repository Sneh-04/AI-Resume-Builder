import { useState } from 'react'
import { Link2, Copy, Check, X } from 'lucide-react'

export default function ShareResume({ resumeData, template, onClose }) {
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    try {
      const payload = JSON.stringify({ data: resumeData, template })
      const encoded = btoa(encodeURIComponent(payload))
      return `${window.location.origin}${window.location.pathname}?resume=${encoded}`
    } catch (e) {
      return window.location.href
    }
  }

  const link = generateLink()

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link2 size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Share Resume</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ padding: '22px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px', lineHeight: 1.6 }}>
            Your resume is encoded into this link — anyone with it can view your resume in the builder. No account needed.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '10px 12px',
              fontSize: '11px', color: 'var(--text3)', wordBreak: 'break-all',
              fontFamily: 'var(--font-mono)', lineHeight: 1.4,
              maxHeight: 80, overflow: 'hidden',
            }}>
              {link.slice(0, 120)}...
            </div>
          </div>

          <button className="btn-primary" onClick={copy} style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '11px' }}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Link Copied!' : 'Copy Shareable Link'}
          </button>

          <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '12px', textAlign: 'center' }}>
            💡 The link contains your full resume data — share with recruiters or friends for feedback.
          </p>
        </div>
      </div>
    </div>
  )
}
