import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check, FolderOpen } from 'lucide-react'

export default function ResumeVersions({ resumeData, setResumeData, template, setTemplate, onClose }) {
  const [versions, setVersions] = useState([])
  const [newName, setNewName] = useState('')
  const [saved, setSaved] = useState(null)

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem('resumeai_versions') || '[]')
      setVersions(v)
    } catch (e) {}
  }, [])

  const saveVersions = (v) => {
    setVersions(v)
    localStorage.setItem('resumeai_versions', JSON.stringify(v))
  }

  const saveCurrentAs = () => {
    const name = newName.trim() || `Version ${versions.length + 1}`
    const version = { id: Date.now(), name, data: resumeData, template, savedAt: new Date().toLocaleDateString() }
    const updated = [version, ...versions].slice(0, 10)
    saveVersions(updated)
    setNewName('')
    setSaved(version.id)
    setTimeout(() => setSaved(null), 2000)
  }

  const loadVersion = (v) => {
    setResumeData(v.data)
    setTemplate(v.template)
    onClose()
  }

  const deleteVersion = (id) => {
    saveVersions(versions.filter(v => v.id !== id))
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderOpen size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Resume Versions</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '20px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>Save the current resume as a named version (e.g. "For Google", "Startup Apply")</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="input-field"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder='e.g. "For Amazon SDE role"'
              onKeyDown={e => e.key === 'Enter' && saveCurrentAs()}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" onClick={saveCurrentAs} style={{ flexShrink: 0, padding: '8px 16px' }}>
              {saved ? <Check size={14} /> : <Plus size={14} />}
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 22px' }}>
          {versions.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '13px', padding: '30px 0' }}>
              No saved versions yet. Save your current resume above.
            </div>
          ) : (
            versions.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius)', marginBottom: '8px', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    {v.template} template · {v.data.personal.name || 'Unnamed'} · {v.savedAt}
                  </div>
                </div>
                <button className="btn-ghost" onClick={() => loadVersion(v)} style={{ padding: '5px 10px', fontSize: '12px' }}>
                  <Copy size={12} /> Load
                </button>
                <button onClick={() => deleteVersion(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: '5px' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
