import { useState, useRef } from 'react'
import { Mic, MicOff, Loader2, X, Wand2 } from 'lucide-react'
import { askGemini } from '../gemini.js'


export default function VoiceInput({ onInsert, onClose }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [formatted, setFormatted] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [targetField, setTargetField] = useState('summary')
  const recognitionRef = useRef(null)

  const startListening = () => {
    setError(null)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError('Your browser does not support voice input. Try Chrome.'); return }
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(' ')
      setTranscript(t)
    }
    rec.onerror = (e) => { setError('Mic error: ' + e.error); setListening(false) }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const formatWithAI = async () => {
    if (!transcript.trim()) return
    setLoading(true)
    const prompts = {
      summary: `Format this spoken input as a professional resume summary (60-80 words, first person, impactful). Return ONLY the summary text:\n\n"${transcript}"`,
      bullets: `Convert this spoken description into 3 strong resume bullet points. Each starts with a powerful action verb, includes a metric if possible. Return ONLY 3 lines starting with •:\n\n"${transcript}"`,
      skills: `Extract a clean comma-separated list of skills from this spoken input. Return ONLY the skills as a comma-separated list:\n\n"${transcript}"`,
    }
    try {
      const result = await askGemini(prompts[targetField])
      setFormatted(result)
    } catch (e) { setError('AI formatting failed.') }
    finally { setLoading(false) }
  }

  const fields = [
    { id: 'summary', label: '📝 Summary' },
    { id: 'bullets', label: '💼 Job Bullets' },
    { id: 'skills', label: '🛠 Skills List' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Mic size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Voice Input</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ padding: '22px' }}>
          {/* Target field selector */}
          <div style={{ marginBottom: '18px' }}>
            <div className="label">What are you describing?</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {fields.map(f => (
                <button key={f.id} onClick={() => setTargetField(f.id)} style={{
                  flex: 1, padding: '8px', borderRadius: 'var(--radius)', border: 'none',
                  background: targetField === f.id ? 'var(--accent)' : 'var(--bg3)',
                  color: targetField === f.id ? '#0f0e0c' : 'var(--text2)',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* Mic button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <button
              onClick={listening ? stopListening : startListening}
              style={{
                width: 72, height: 72, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: listening ? '#eb5757' : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: listening ? '0 0 0 8px rgba(235,87,87,0.2), 0 0 0 16px rgba(235,87,87,0.1)' : '0 4px 20px rgba(232,201,122,0.3)',
                transition: 'all 0.3s', animation: listening ? 'pulse 1.5s ease infinite' : 'none',
              }}
            >
              {listening ? <MicOff size={28} color="#fff" /> : <Mic size={28} color="#0f0e0c" />}
            </button>
            <span style={{ fontSize: '13px', color: listening ? '#eb5757' : 'var(--text3)', fontWeight: listening ? 600 : 400 }}>
              {listening ? '🔴 Recording... click to stop' : 'Click to start speaking'}
            </span>
          </div>

          {/* Transcript */}
          {transcript && (
            <div style={{ marginBottom: '14px' }}>
              <div className="label">Transcript</div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 13px', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, maxHeight: 100, overflowY: 'auto' }}>
                {transcript}
              </div>
            </div>
          )}

          {/* AI formatted result */}
          {formatted && (
            <div style={{ marginBottom: '14px' }}>
              <div className="label" style={{ color: 'var(--accent)' }}>✨ AI Formatted</div>
              <div style={{ background: 'var(--accent-dim)', border: '1px solid rgba(232,201,122,0.2)', borderRadius: 'var(--radius)', padding: '10px 13px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
                {formatted}
              </div>
            </div>
          )}

          {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {transcript && !formatted && (
              <button className="btn-ghost" onClick={formatWithAI} disabled={loading} style={{ fontSize: '13px' }}>
                {loading ? <Loader2 size={13} className="spinner" /> : <Wand2 size={13} />}
                {loading ? 'Formatting...' : 'Format with AI'}
              </button>
            )}
            {formatted && (
              <button className="btn-primary" onClick={() => { onInsert(targetField, formatted); onClose() }} style={{ fontSize: '13px' }}>
                Insert into Resume →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
