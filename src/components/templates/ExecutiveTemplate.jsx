export default function ExecutiveTemplate({ data }) {
  const p = data.personal
  const s = {
    root: { fontFamily: "'DM Sans', sans-serif", width: '794px', minHeight: '1123px', fontSize: '10pt', color: '#1a1816', background: '#fff' },
    header: { background: '#1a2332', color: '#fff', padding: '36px 44px 28px', marginBottom: '0' },
    name: { fontFamily: "'Playfair Display', serif", fontSize: '28pt', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.01em' },
    title: { fontSize: '11pt', color: '#94a3b8', fontWeight: 400, marginBottom: '16px' },
    contactRow: { display: 'flex', flexWrap: 'wrap', gap: '4px 20px', fontSize: '8.5pt', color: '#94a3b8' },
    body: { display: 'flex', flex: 1 },
    left: { width: '34%', background: '#f8fafc', padding: '28px 20px', borderRight: '1px solid #e2e8f0' },
    right: { flex: 1, padding: '28px 28px' },
    sLabel: { fontSize: '7.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a2332', marginBottom: '12px', marginTop: '20px', paddingBottom: '5px', borderBottom: '2px solid #1a2332', display: 'flex', alignItems: 'center', gap: '6px' },
    sLabelFirst: { marginTop: '0' },
    expTitle: { fontWeight: 700, fontSize: '10.5pt', color: '#1a2332', marginBottom: '1px' },
    expSub: { fontSize: '9pt', color: '#64748b', marginBottom: '5px' },
    bullet: { fontSize: '9pt', color: '#334155', lineHeight: 1.55, paddingLeft: '14px', position: 'relative', marginBottom: '3px' },
    summary: { fontSize: '9.5pt', color: '#475569', lineHeight: 1.7 },
    skill: { display: 'block', background: '#e2e8f0', color: '#1a2332', padding: '5px 10px', borderRadius: '4px', fontSize: '8.5pt', marginBottom: '5px', fontWeight: 500 },
  }
  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.name}>{p.name || 'Your Name'}</div>
        <div style={s.title}>{p.title || 'Professional Title'}</div>
        <div style={s.contactRow}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>☎ {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.github && <span>⌥ {p.github}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>
      <div style={s.body}>
        <div style={s.left}>
          {data.skills.length > 0 && (
            <>
              <div style={{ ...s.sLabel, ...s.sLabelFirst }}>Skills</div>
              {data.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}
            </>
          )}
          {data.education.length > 0 && (
            <>
              <div style={s.sLabel}>Education</div>
              {data.education.map(e => (
                <div key={e.id} style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#1a2332' }}>{e.degree}</div>
                  <div style={{ fontSize: '9pt', color: '#64748b' }}>{e.institution}</div>
                  <div style={{ fontSize: '8.5pt', color: '#94a3b8' }}>{e.year}{e.gpa ? ` · ${e.gpa}` : ''}</div>
                </div>
              ))}
            </>
          )}
          {data.certifications.length > 0 && (
            <>
              <div style={s.sLabel}>Certifications</div>
              {data.certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '9pt', color: '#1a2332' }}>{c.name}</div>
                  <div style={{ fontSize: '8.5pt', color: '#64748b' }}>{c.issuer}</div>
                </div>
              ))}
            </>
          )}
        </div>
        <div style={s.right}>
          {p.summary && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ ...s.sLabel, ...s.sLabelFirst }}>Professional Summary</div>
              <p style={s.summary}>{p.summary}</p>
            </div>
          )}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={p.summary ? s.sLabel : { ...s.sLabel, ...s.sLabelFirst }}>Experience</div>
              {data.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={s.expTitle}>{exp.role || 'Job Title'}</span>
                    <span style={{ fontSize: '8.5pt', color: '#94a3b8' }}>{exp.start}{exp.end ? ` – ${exp.end}` : ''}</span>
                  </div>
                  <div style={s.expSub}>{exp.company}</div>
                  {exp.bullets && exp.bullets.split('\n').filter(Boolean).map((b, i) => (
                    <div key={i} style={s.bullet}><span style={{ position: 'absolute', left: 0, color: '#1a2332', fontWeight: 700 }}>›</span>{b.replace(/^[•›\-]\s*/, '')}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {data.projects.length > 0 && (
            <div>
              <div style={s.sLabel}>Projects</div>
              {data.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={s.expTitle}>{proj.name}</span>
                    {proj.tech && <span style={{ fontSize: '8pt', color: '#3b82f6', fontFamily: 'monospace' }}>{proj.tech}</span>}
                  </div>
                  {proj.description && <p style={{ ...s.bullet, paddingLeft: 0, marginTop: '3px' }}>{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
