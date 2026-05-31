import { useState } from 'react'
import { Palette, Check } from 'lucide-react'

const PRESETS = [
  { name: 'Gold', primary: '#e8c97a', dark: '#1a1916', tag: 'Default' },
  { name: 'Blue', primary: '#3b82f6', dark: '#0f172a', tag: '' },
  { name: 'Emerald', primary: '#10b981', dark: '#064e3b', tag: '🌿' },
  { name: 'Rose', primary: '#f43f5e', dark: '#1a0a0e', tag: '💗' },
  { name: 'Violet', primary: '#8b5cf6', dark: '#1a0a2e', tag: '✨' },
  { name: 'Orange', primary: '#f97316', dark: '#1c0e00', tag: '🔥' },
  { name: 'Cyan', primary: '#06b6d4', dark: '#061b22', tag: '' },
  { name: 'Slate', primary: '#94a3b8', dark: '#0f172a', tag: '🎯' },
]

export default function ColorThemePicker({ accentColor, setAccentColor, onClose }) {
  const [custom, setCustom] = useState(accentColor || '#e8c97a')

  const apply = (color) => {
    setAccentColor(color)
    // Update CSS variable live
    document.documentElement.style.setProperty('--accent', color)
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    document.documentElement.style.setProperty('--accent-dim', `rgba(${r},${g},${b},0.12)`)
    document.documentElement.style.setProperty('--accent2', color)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 420, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Palette size={17} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Color Theme</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px' }}>×</button>
        </div>

        <div style={{ padding: '20px 22px' }}>
          <div className="label">Preset Colors</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {PRESETS.map(preset => (
              <button key={preset.name} onClick={() => { apply(preset.primary); setCustom(preset.primary) }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                padding: '10px 6px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                background: 'var(--bg3)', cursor: 'pointer', transition: 'all 0.15s',
                outline: (accentColor === preset.primary || custom === preset.primary) ? `2px solid ${preset.primary}` : 'none',
                outlineOffset: '2px',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: preset.primary, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {custom === preset.primary && <Check size={14} color="#fff" />}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text2)', fontWeight: 500 }}>{preset.name}</span>
                {preset.tag && <span style={{ fontSize: '9px', color: 'var(--text3)' }}>{preset.tag}</span>}
              </button>
            ))}
          </div>

          <div className="label">Custom Color</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <input type="color" value={custom} onChange={e => { setCustom(e.target.value); apply(e.target.value) }}
              style={{ width: 44, height: 44, borderRadius: 'var(--radius)', border: '2px solid var(--border)', cursor: 'pointer', padding: '2px', background: 'var(--bg3)' }} />
            <input className="input-field" value={custom} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) { setCustom(e.target.value); if (e.target.value.length === 7) apply(e.target.value) } }}
              style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '13px' }} />
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: custom, border: '1px solid var(--border)', flexShrink: 0 }} />
          </div>

          <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}>
            Apply Color Theme
          </button>
        </div>
      </div>
    </div>
  )
}
