const templates = [
  { id: 'modern', name: 'Modern', desc: 'Dark sidebar + gold', tag: '🔥 Trending', tagColor: '#e8c97a', bg: '#1a1916', accent: '#e8c97a', sidebar: '#252420' },
  { id: 'classic', name: 'Classic', desc: 'Navy professional', tag: '✅ ATS-Safe', tagColor: '#6fcf97', bg: '#fff', accent: '#2d3748', sidebar: '#edf2f7' },
  { id: 'minimal', name: 'Minimal', desc: 'Typographic clean', tag: '⭐ Popular', tagColor: '#5b9cf6', bg: '#fafafa', accent: '#e53e3e', sidebar: '#fafafa' },
  { id: 'executive', name: 'Executive', desc: 'Premium dark header', tag: '💼 Senior', tagColor: '#a78bfa', bg: '#f8fafc', accent: '#1a2332', sidebar: '#e2e8f0' },
  { id: 'tech', name: 'Tech', desc: 'Terminal dark theme', tag: '👨‍💻 Dev', tagColor: '#4ade80', bg: '#0f172a', accent: '#4ade80', sidebar: '#1e293b' },
]

export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '12px' }}>
        Choose Template
      </div>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {templates.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
            padding: '10px 12px', borderRadius: 'var(--radius-lg)', flexShrink: 0,
            border: selected === t.id ? '2px solid var(--accent)' : '1px solid var(--border)',
            background: selected === t.id ? 'var(--accent-dim)' : 'var(--bg)',
            cursor: 'pointer', transition: 'all 0.2s', width: 140,
          }}>
            <div style={{ width: '100%', height: 52, borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: t.bg, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', background: t.sidebar }} />
              <div style={{ position: 'absolute', right: '4px', top: '8px', left: '42%', height: '3px', background: t.accent, borderRadius: '2px' }} />
              <div style={{ position: 'absolute', right: '4px', top: '14px', left: '42%', height: '2px', background: t.accent, borderRadius: '2px', opacity: 0.4 }} />
              <div style={{ position: 'absolute', right: '4px', top: '19px', left: '42%', height: '2px', background: t.accent, borderRadius: '2px', opacity: 0.2 }} />
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '12px', color: selected === t.id ? 'var(--accent)' : 'var(--text)' }}>{t.name}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '4px' }}>{t.desc}</div>
              <span style={{ fontSize: '10px', color: t.tagColor, fontWeight: 600 }}>{t.tag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
