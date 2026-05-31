import { useState } from 'react'
import { Wand2, Loader2, Check, ArrowRight } from 'lucide-react'
import { askGemini } from '../gemini.js'


export default function BeforeAfterRewrite({ resumeData, setResumeData, onClose }) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [applied, setApplied] = useState({})
  const [error, setError] = useState(null)

  const analyze = async () => {
    setLoading(true); setError(null)
    const p = resumeData.personal
    const items = []

    if (p.summary) items.push({ id: 'summary', type: 'Summary', original: p.summary })
    resumeData.experience.forEach(e => {
      if (e.bullets) items.push({ id: `exp_${e.id}`, type: `${e.role} Bullets`, original: e.bullets })
    })
    resumeData.projects.forEach(pr => {
      if (pr.description) items.push({ id: `proj_${pr.id}`, type: `${pr.name} Description`, original: pr.description })
    })

    if (items.length === 0) { setError('Add some content first (summary, bullets, project descriptions).'); setLoading(false); return }

    const prompt = `You are a professional resume editor. Rewrite each piece of content to be more impactful, specific, and ATS-friendly. Use stronger action verbs, add implied metrics, and remove weak language.

Return ONLY a JSON array like this (no markdown):
[
  { "id": "<same id>", "improved": "<rewritten text>" }
]

Items to improve:
${JSON.stringify(items.map(i => ({ id: i.id, type: i.type, text: i.original })))}`

    try {
      const raw = await askGemini(prompt)
      const rewrites = JSON.parse(raw.replace(/```json|```/g, '').trim())
      const merged = items.map(item => ({ ...item, improved: rewrites.find(r => r.id === item.id)?.improved || item.original }))
      setResults(merged)
    } catch (e) { setError('AI rewrite failed. Try again.') }
    finally { setLoading(false) }
  }

  const applyOne = (item) => {
    setResumeData(d => {
      if (item.id === 'summary') return { ...d, personal: { ...d.personal, summary: item.improved } }
      if (item.id.startsWith('exp_')) {
        const expId = parseInt(item.id.replace('exp_', ''))
        return { ...d, experience: d.experience.map(e => e.id === expId ? { ...e, bullets: item.improved } : e) }
      }
      if (item.id.startsWith('proj_')) {
        const projId = parseInt(item.id.replace('proj_', ''))
        return { ...d, projects: d.projects.map(p => p.id === projId ? { ...p, description: item.improved } : p) }
      }
      return d
    })
    setApplied(a => ({ ...a, [item.id]: true }))
  }

  const applyAll = () => {
    results.forEach(item => applyOne(item))
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 660, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Wand2 size={17} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>AI Content Rewriter</span>
            <span style={{ fontSize: '11px', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(232,201,122,0.2)' }}>Before vs After</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px' }}>
          {!results ? (
            <>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px', lineHeight: 1.6 }}>
                AI will review every summary, bullet point, and project description on your resume — then show you a <strong style={{ color: 'var(--text)' }}>before vs after comparison</strong>. Accept only the changes you like.
              </p>
              {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
              <button className="btn-primary" onClick={analyze} disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '12px' }}>
                {loading ? <Loader2 size={15} className="spinner" /> : <Wand2 size={15} />}
                {loading ? 'AI is reviewing your resume...' : 'Analyze & Rewrite Everything'}
              </button>
            </>
          ) : (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{results.length} sections rewritten</span>
                <button className="btn-primary" onClick={applyAll} style={{ fontSize: '12px', padding: '6px 14px' }}>
                  ✨ Apply All Improvements
                </button>
              </div>

              {results.map(item => (
                <div key={item.id} style={{ marginBottom: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ padding: '8px 14px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text3)' }}>{item.type}</span>
                    {applied[item.id]
                      ? <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Applied</span>
                      : <button onClick={() => applyOne(item)} className="btn-ghost" style={{ fontSize: '11px', padding: '3px 10px' }}>Use this →</button>
                    }
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ padding: '12px 14px', borderRight: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#eb5757', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Before</div>
                      <p style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6, margin: 0 }}>{item.original}</p>
                    </div>
                    <div style={{ padding: '12px 14px', background: 'rgba(111,207,151,0.04)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#6fcf97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>After ✨</div>
                      <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{item.improved}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {results && (
          <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={onClose} style={{ fontSize: '13px' }}>Done & View Resume →</button>
          </div>
        )}
      </div>
    </div>
  )
}
