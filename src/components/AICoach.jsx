import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react'
import { askGemini } from '../gemini.js'


const SUGGESTIONS = [
  'How can I improve my summary?',
  'Are my bullet points strong enough?',
  'What skills should I add?',
  'How do I make this ATS-friendly?',
]

export default function AICoach({ resumeData }) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Resume Coach 👋 I can see your resume in real time. Ask me anything — how to improve your summary, make bullets stronger, what skills to add, or how to beat ATS filters." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setLoading(true)

    const p = resumeData.personal
    const context = `Current resume context:
Name: ${p.name || 'Not filled'}, Title: ${p.title || 'Not filled'}
Summary: ${p.summary || 'Not filled'}
Experience: ${resumeData.experience.length} entries. Latest: ${resumeData.experience[0] ? `${resumeData.experience[0].role} at ${resumeData.experience[0].company}` : 'none'}
Skills: ${resumeData.skills.join(', ') || 'none'}
Projects: ${resumeData.projects.length} entries
Education: ${resumeData.education.length} entries`

    try {
      const systemPrompt = `You are a friendly, expert resume coach. Give specific, actionable advice in 2-4 sentences max. Be encouraging but honest. Never be generic. Current resume:\n${context}`
      const history = messages.filter(m => m.role !== 'system').map(m => `${m.role === 'assistant' ? 'Coach' : 'User'}: ${m.text}`).join('\n')
      const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${history}\n\nUser: ${msg}\n\nCoach:`
      const reply = await askGemini(fullPrompt)
      setMessages(m => [...m, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: 'Connection issue — please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 150,
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--accent)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(232,201,122,0.4)',
          transition: 'transform 0.2s',
        }}
        title="AI Resume Coach"
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare size={22} color="#0f0e0c" />
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 150,
      width: 340, background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column',
      height: minimized ? 'auto' : 440,
      transition: 'height 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', borderBottom: minimized ? 'none' : '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setMinimized(m => !m)}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MessageSquare size={13} color="#0f0e0c" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text)' }}>AI Resume Coach</div>
          <div style={{ fontSize: '10px', color: 'var(--green)' }}>● Online · Watching your resume</div>
        </div>
        <button onClick={e => { e.stopPropagation(); setMinimized(m => !m) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '2px' }}>
          {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
        </button>
        <button onClick={e => { e.stopPropagation(); setOpen(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '2px' }}>
          <X size={14} />
        </button>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '8px 12px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg3)',
                  color: m.role === 'user' ? '#0f0e0c' : 'var(--text)',
                  fontSize: '12.5px', lineHeight: 1.55,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: 'var(--bg3)', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)', animation: 'pulse 1.2s ease infinite', animationDelay: `${i * 0.2}s` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 10px 8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)',
                  padding: '4px 9px', borderRadius: '100px', fontSize: '11px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '7px' }}>
            <input
              className="input-field"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask your coach..."
              style={{ flex: 1, padding: '7px 11px', fontSize: '12px' }}
              disabled={loading}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{
              background: input.trim() ? 'var(--accent)' : 'var(--bg3)',
              border: 'none', borderRadius: 'var(--radius)', cursor: input.trim() ? 'pointer' : 'default',
              width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'background 0.2s',
            }}>
              {loading ? <Loader2 size={14} color="var(--text3)" className="spinner" /> : <Send size={14} color={input.trim() ? '#0f0e0c' : 'var(--text3)'} />}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
