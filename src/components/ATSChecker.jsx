import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle, AlertCircle, XCircle, Shield } from 'lucide-react'
import { askGemini } from '../gemini.js'


export default function ATSChecker({ resumeData, onClose }) {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    runCheck()
  }, [])

  const runCheck = async () => {
    setLoading(true)
    setError(null)
    const p = resumeData.personal
    const resumeText = `
Name: ${p.name}, Title: ${p.title}
Summary: ${p.summary}
Experience: ${resumeData.experience.map(e => `${e.role} at ${e.company}: ${e.bullets}`).join(' | ')}
Education: ${resumeData.education.map(e => `${e.degree} from ${e.institution}`).join(', ')}
Skills: ${resumeData.skills.join(', ')}
Projects: ${resumeData.projects.map(pr => `${pr.name}: ${pr.description}`).join(' | ')}
    `.trim()

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume and return ONLY a JSON object (no markdown, no explanation):

Resume:
${resumeText}

Return this exact JSON:
{
  "score": <number 0-100>,
  "grade": "<A/B/C/D/F>",
  "summary": "<2 sentence overall assessment>",
  "checks": [
    { "label": "Contact Information", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Professional Summary", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Work Experience Quality", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Action Verbs Used", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Quantified Achievements", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Skills Section", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Education Details", "status": "<pass/warn/fail>", "note": "<short note>" },
    { "label": "Keyword Density", "status": "<pass/warn/fail>", "note": "<short note>" }
  ],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "contentScore": <0-100>,
  "keywordScore": <0-100>,
  "formatScore": <0-100>
}`

    try {
      const raw = await askGemini(prompt)
      const text = raw.replace(/```json|```/g, '').trim()
      setResult(JSON.parse(text))
    } catch (e) {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusIcon = (s) => {
    if (s === 'pass') return <CheckCircle size={15} color="#6fcf97" />
    if (s === 'warn') return <AlertCircle size={15} color="#f2994a" />
    return <XCircle size={15} color="#eb5757" />
  }

  const scoreColor = (score) => score >= 80 ? '#6fcf97' : score >= 60 ? '#f2994a' : '#eb5757'
  const gradeColor = (g) => ({ A: '#6fcf97', B: '#5b9cf6', C: '#f2994a', D: '#e8c97a', F: '#eb5757' }[g] || '#eb5757')

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 560, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>ATS Resume Checker</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '22px', flex: 1 }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '40px 0' }}>
              <Loader2 size={32} color="var(--accent)" className="spinner" />
              <div style={{ color: 'var(--text2)', fontSize: '14px' }}>Analyzing your resume with AI...</div>
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--red)', textAlign: 'center', padding: '40px 0' }}>
              {error}
              <br /><br />
              <button className="btn-ghost" onClick={runCheck}>Retry</button>
            </div>
          )}

          {result && (
            <div className="fade-in">
              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: 700, color: scoreColor(result.score), lineHeight: 1, fontFamily: 'var(--font-display)' }}>{result.score}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Score</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    {[['Content', result.contentScore], ['Keywords', result.keywordScore], ['Format', result.formatScore]].map(([label, score]) => (
                      <div key={label} style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '4px' }}>{label}</div>
                        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${score}%`, height: '100%', background: scoreColor(score), borderRadius: '3px', transition: 'width 1s ease' }} />
                        </div>
                        <div style={{ fontSize: '11px', color: scoreColor(score), fontWeight: 600, marginTop: '2px' }}>{score}%</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, margin: 0 }}>{result.summary}</p>
                </div>
              </div>

              {/* Checks */}
              <div style={{ marginBottom: '20px' }}>
                <div className="label">Checklist</div>
                {result.checks.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    {statusIcon(c.status)}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '1px' }}>{c.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{c.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Improvements */}
              <div>
                <div className="label">Top Improvements</div>
                {result.improvements.map((imp, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 12px', background: 'rgba(232,201,122,0.07)', border: '1px solid rgba(232,201,122,0.15)', borderRadius: 'var(--radius)', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.5 }}>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {result && (
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button className="btn-ghost" onClick={runCheck} style={{ fontSize: '13px' }}>Re-analyze</button>
            <button className="btn-primary" onClick={onClose} style={{ fontSize: '13px' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
