import { useState } from 'react'
import { FileText, Loader2, Copy, Check, Download, X } from 'lucide-react'
import { askGemini } from '../gemini.js'


export default function CoverLetterGenerator({ resumeData, onClose }) {
  const [jd, setJd] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [tone, setTone] = useState('professional')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const generate = async () => {
    setLoading(true); setError(null)
    const p = resumeData.personal
    const expText = resumeData.experience.map(e => `${e.role} at ${e.company}: ${e.bullets}`).join('\n')
    const prompt = `Write a compelling cover letter for this candidate applying to ${role || 'the position'} at ${company || 'the company'}.

Candidate Info:
Name: ${p.name}
Title: ${p.title}
Summary: ${p.summary}
Experience: ${expText}
Skills: ${resumeData.skills.join(', ')}
Projects: ${resumeData.projects.map(pr => pr.name + ': ' + pr.description).join(' | ')}

${jd ? `Job Description:\n${jd}` : ''}

Tone: ${tone}
Rules:
- 3 paragraphs: hook opener, main value prop with specific examples, confident close
- Reference specific experience from their resume
- ${tone === 'professional' ? 'Formal and polished' : tone === 'confident' ? 'Bold and assertive' : 'Warm, genuine, human'}
- Do NOT use generic phrases like "I am writing to apply" or "please find attached"
- Max 280 words
- Return ONLY the letter body (no subject line, no date, no address)`

    try {
      const letter = await askGemini(prompt)
      setLetter(letter)
    } catch (e) { setError('Generation failed. Try again.') }
    finally { setLoading(false) }
  }

  const copy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadTxt = () => {
    const blob = new Blob([`${resumeData.personal.name}\n${resumeData.personal.email}\n\n${letter}`], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cover_letter_${company || 'company'}.txt`
    a.click()
  }

  const tones = [
    { id: 'professional', label: '👔 Professional' },
    { id: 'confident', label: '🔥 Confident' },
    { id: 'warm', label: '😊 Warm' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 600, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <FileText size={17} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Cover Letter Generator</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px' }}>
          {!letter ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="label">Company Name</label>
                  <input className="input-field" value={company} onChange={e => setCompany(e.target.value)} placeholder="Google" />
                </div>
                <div>
                  <label className="label">Role / Position</label>
                  <input className="input-field" value={role} onChange={e => setRole(e.target.value)} placeholder="Software Engineer" />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="label">Tone</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {tones.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)} style={{
                      flex: 1, padding: '8px', borderRadius: 'var(--radius)', border: 'none',
                      background: tone === t.id ? 'var(--accent)' : 'var(--bg3)',
                      color: tone === t.id ? '#0f0e0c' : 'var(--text2)',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="label">Job Description (optional but recommended)</label>
                <textarea className="input-field" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste JD for a tailored letter..." style={{ minHeight: 120 }} />
              </div>

              {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

              <button className="btn-primary" onClick={generate} disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '11px' }}>
                {loading ? <Loader2 size={14} className="spinner" /> : <FileText size={14} />}
                {loading ? 'Writing your cover letter...' : 'Generate Cover Letter'}
              </button>
            </>
          ) : (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                  Cover letter for <strong style={{ color: 'var(--accent)' }}>{role || 'the role'}</strong> at <strong style={{ color: 'var(--text)' }}>{company || 'company'}</strong>
                </div>
                <button className="btn-ghost" onClick={() => setLetter('')} style={{ fontSize: '12px', padding: '4px 10px' }}>Regenerate</button>
              </div>

              {/* Letter preview */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10pt', color: '#1a1816', lineHeight: 1.8 }}>
                  <div style={{ marginBottom: '20px', fontSize: '11pt', fontWeight: 600, color: '#1a1816' }}>{resumeData.personal.name}</div>
                  <div style={{ marginBottom: '24px', fontSize: '9pt', color: '#64748b' }}>
                    {[resumeData.personal.email, resumeData.personal.phone, resumeData.personal.location].filter(Boolean).join(' · ')}
                  </div>
                  <div style={{ whiteSpace: 'pre-line' }}>{letter}</div>
                  <div style={{ marginTop: '24px', fontWeight: 500 }}>Sincerely,<br />{resumeData.personal.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-ghost" onClick={copy} style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>
                  {copied ? <Check size={13} color="var(--green)" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button className="btn-primary" onClick={downloadTxt} style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>
                  <Download size={13} /> Download .txt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
