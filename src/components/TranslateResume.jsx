import { useState } from 'react'
import { Globe, Loader2, Check, X } from 'lucide-react'
import { askGemini } from '../gemini.js'


const LANGUAGES = [
  { code: 'de', label: '🇩🇪 German' },
  { code: 'fr', label: '🇫🇷 French' },
  { code: 'es', label: '🇪🇸 Spanish' },
  { code: 'ja', label: '🇯🇵 Japanese' },
  { code: 'zh', label: '🇨🇳 Chinese' },
  { code: 'ar', label: '🇸🇦 Arabic' },
  { code: 'hi', label: '🇮🇳 Hindi' },
  { code: 'pt', label: '🇧🇷 Portuguese' },
  { code: 'ko', label: '🇰🇷 Korean' },
  { code: 'nl', label: '🇳🇱 Dutch' },
]

export default function TranslateResume({ resumeData, setResumeData, onClose }) {
  const [selectedLang, setSelectedLang] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const [original, setOriginal] = useState(null)

  const translate = async () => {
    if (!selectedLang) return
    const lang = LANGUAGES.find(l => l.code === selectedLang)
    setLoading(true); setError(null)
    setOriginal(resumeData)

    const textToTranslate = JSON.stringify({
      title: resumeData.personal.title,
      summary: resumeData.personal.summary,
      experience: resumeData.experience.map(e => ({ role: e.role, company: e.company, bullets: e.bullets, description: e.description })),
      education: resumeData.education.map(e => ({ degree: e.degree, institution: e.institution })),
      projects: resumeData.projects.map(p => ({ name: p.name, description: p.description })),
      certifications: resumeData.certifications.map(c => ({ name: c.name })),
    })

    const prompt = `Translate all text values in this JSON to ${lang.label.split(' ')[1]}. Keep keys in English. Keep proper nouns (company names, tool names, technologies) in English. Return ONLY valid JSON, nothing else:\n\n${textToTranslate}`

    try {
      const raw = await askGemini(prompt)
      const translated = JSON.parse(raw.replace(/```json|```/g, '').trim())

      setResumeData(d => ({
        ...d,
        personal: { ...d.personal, title: translated.title || d.personal.title, summary: translated.summary || d.personal.summary },
        experience: d.experience.map((e, i) => ({ ...e, ...(translated.experience?.[i] || {}) })),
        education: d.education.map((e, i) => ({ ...e, ...(translated.education?.[i] || {}) })),
        projects: d.projects.map((p, i) => ({ ...p, ...(translated.projects?.[i] || {}) })),
        certifications: d.certifications.map((c, i) => ({ ...c, ...(translated.certifications?.[i] || {}) })),
      }))
      setDone(true)
    } catch (e) { setError('Translation failed. Try again.') }
    finally { setLoading(false) }
  }

  const revert = () => {
    if (original) { setResumeData(original); setDone(false); setOriginal(null) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 460, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Globe size={17} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Translate Resume</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ padding: '22px' }}>
          {!done ? (
            <>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px', lineHeight: 1.6 }}>
                Translate your entire resume to another language while keeping company names, tools, and technologies in English.
              </p>
              <div className="label">Target Language</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setSelectedLang(l.code)} style={{
                    padding: '9px 12px', borderRadius: 'var(--radius)', border: 'none', textAlign: 'left',
                    background: selectedLang === l.code ? 'var(--accent)' : 'var(--bg3)',
                    color: selectedLang === l.code ? '#0f0e0c' : 'var(--text2)',
                    fontSize: '13px', fontWeight: selectedLang === l.code ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s',
                  }}>{l.label}</button>
                ))}
              </div>
              {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button className="btn-primary" onClick={translate} disabled={!selectedLang || loading} style={{ flex: 2, justifyContent: 'center' }}>
                  {loading ? <Loader2 size={14} className="spinner" /> : <Globe size={14} />}
                  {loading ? 'Translating...' : 'Translate Resume'}
                </button>
              </div>
            </>
          ) : (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--green)', marginBottom: '18px' }}>
                <Check size={22} />
                <span style={{ fontWeight: 700, fontSize: '15px' }}>
                  Resume translated to {LANGUAGES.find(l => l.code === selectedLang)?.label}!
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '18px', lineHeight: 1.6 }}>
                Your resume content has been translated. The preview is updated. You can export the translated PDF now.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-ghost" onClick={revert} style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>↩ Revert to English</button>
                <button className="btn-primary" onClick={onClose} style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>View Resume →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
