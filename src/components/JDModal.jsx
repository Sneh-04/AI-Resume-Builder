import { useState } from 'react'
import { X, Loader2, Zap, Target } from 'lucide-react'
import { askGemini } from '../gemini.js'


export default function JDModal({ resumeData, setResumeData, setTemplate, onClose }) {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [changes, setChanges] = useState(null)
  const [error, setError] = useState(null)

  const handleMatch = async () => {
    if (!jd.trim()) return
    setLoading(true)
    setError(null)
    const p = resumeData.personal

    const prompt = `You are a resume tailoring expert. Given this job description and the user's resume data, return ONLY a JSON object that tailors the resume to maximize match.

JOB DESCRIPTION:
${jd}

CURRENT RESUME:
Name: ${p.name}, Title: ${p.title}
Summary: ${p.summary}
Skills: ${resumeData.skills.join(', ')}

Return ONLY this JSON (no markdown):
{
  "template": "<modern|classic|minimal|executive|tech>",
  "templateReason": "<one sentence why this template fits this role>",
  "newTitle": "<optimized job title that matches JD>",
  "newSummary": "<rewritten 70-word summary tailored to this JD>",
  "suggestedSkills": ["<skill from JD not in their list>", "<skill 2>", "<skill 3>"],
  "changes": ["<change 1 made>", "<change 2 made>", "<change 3 made>"]
}`

    try {
      const raw = await askGemini(prompt)
      const text = raw.replace(/```json|```/g, '').trim()
      const result = JSON.parse(text)

      // Apply changes
      setResumeData(d => ({
        ...d,
        personal: { ...d.personal, title: result.newTitle || d.personal.title, summary: result.newSummary || d.personal.summary },
        skills: [...new Set([...d.skills, ...(result.suggestedSkills || [])])],
      }))
      setTemplate(result.template || 'modern')
      setChanges(result)
      setDone(true)
    } catch (e) {
      setError('Failed to analyze JD. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 520, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Match Resume to Job Description</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '22px' }}>
          {!done ? (
            <>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px', lineHeight: 1.6 }}>
                Paste the job description below. AI will rewrite your summary, optimize your title, suggest missing skills, and pick the best template automatically.
              </p>
              <label className="label">Job Description</label>
              <textarea
                className="input-field"
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder="Paste the full job description here..."
                style={{ minHeight: 180, marginBottom: '16px' }}
              />
              {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleMatch} disabled={loading || !jd.trim()}>
                  {loading ? <Loader2 size={14} className="spinner" /> : <Zap size={14} />}
                  {loading ? 'Analyzing...' : 'Tailor My Resume'}
                </button>
              </div>
            </>
          ) : (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--green)' }}>
                <Zap size={20} />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Resume tailored successfully!</span>
              </div>
              {changes?.templateReason && (
                <div style={{ background: 'var(--accent-dim)', border: '1px solid rgba(232,201,122,0.2)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--text2)' }}>
                  <strong style={{ color: 'var(--accent)' }}>Template: {changes.template}</strong> — {changes.templateReason}
                </div>
              )}
              <div className="label">Changes Made</div>
              {(changes?.changes || []).map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{c}</span>
                </div>
              ))}
              {(changes?.suggestedSkills?.length > 0) && (
                <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text2)' }}>
                  <strong style={{ color: 'var(--text)' }}>Skills added: </strong>
                  {changes.suggestedSkills.join(', ')}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button className="btn-primary" onClick={onClose}>View Updated Resume →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
