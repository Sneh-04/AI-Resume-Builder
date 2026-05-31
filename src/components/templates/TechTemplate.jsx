export default function TechTemplate({ data }) {
  const p = data.personal
  const s = {
    root: { fontFamily: "'JetBrains Mono', 'Courier New', monospace", width: '794px', minHeight: '1123px', fontSize: '9pt', color: '#e2e8f0', background: '#0f172a' },
    header: { padding: '32px 40px 24px', borderBottom: '1px solid #1e293b' },
    prompt: { color: '#4ade80', fontSize: '8pt', marginBottom: '4px' },
    name: { fontFamily: "'Playfair Display', serif", fontSize: '26pt', fontWeight: 700, color: '#f8fafc', marginBottom: '3px' },
    title: { fontSize: '10pt', color: '#64748b', marginBottom: '14px' },
    contactRow: { display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '8pt', color: '#475569' },
    body: { padding: '24px 40px' },
    sLabel: { fontSize: '7.5pt', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
    sLabelFirst: { marginTop: '0' },
    expTitle: { fontWeight: 700, fontSize: '10pt', color: '#f8fafc', marginBottom: '1px' },
    expSub: { fontSize: '8.5pt', color: '#64748b', marginBottom: '5px' },
    bullet: { fontSize: '8.5pt', color: '#94a3b8', lineHeight: 1.6, paddingLeft: '16px', position: 'relative', marginBottom: '3px' },
    skill: { display: 'inline-block', background: '#1e293b', color: '#4ade80', border: '1px solid #1e3a2f', padding: '2px 8px', borderRadius: '3px', fontSize: '8pt', marginRight: '5px', marginBottom: '5px' },
    summary: { fontSize: '9pt', color: '#94a3b8', lineHeight: 1.7, fontStyle: 'normal' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' },
  }
  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.prompt}>$ whoami</div>
        <div style={s.name}>{p.name || 'Your Name'}</div>
        <div style={s.title}>{p.title || 'Software Engineer'}</div>
        <div style={s.contactRow}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.github && <span>{p.github}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>
      <div style={s.body}>
        {p.summary && (
          <>
            <div style={{ ...s.sLabel, ...s.sLabelFirst }}># about</div>
            <p style={s.summary}>{p.summary}</p>
          </>
        )}
        {data.experience.length > 0 && (
          <>
            <div style={s.sLabel}># experience</div>
            {data.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={s.expTitle}>{exp.role}</span>
                  <span style={{ fontSize: '8pt', color: '#475569' }}>{exp.start}{exp.end ? ` → ${exp.end}` : ''}</span>
                </div>
                <div style={s.expSub}>@{exp.company}</div>
                {exp.bullets && exp.bullets.split('\n').filter(Boolean).map((b, i) => (
                  <div key={i} style={s.bullet}><span style={{ position: 'absolute', left: 0, color: '#4ade80' }}>→</span>{b.replace(/^[•→\-]\s*/, '')}</div>
                ))}
              </div>
            ))}
          </>
        )}
        <div style={s.grid}>
          <div>
            {data.skills.length > 0 && (
              <>
                <div style={s.sLabel}># skills</div>
                <div>{data.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}</div>
              </>
            )}
            {data.education.length > 0 && (
              <>
                <div style={s.sLabel}># education</div>
                {data.education.map(e => (
                  <div key={e.id} style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '9pt' }}>{e.degree}</div>
                    <div style={{ color: '#64748b', fontSize: '8.5pt' }}>{e.institution}</div>
                    <div style={{ color: '#475569', fontSize: '8pt' }}>{e.year}{e.gpa ? ` · ${e.gpa}` : ''}</div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div>
            {data.projects.length > 0 && (
              <>
                <div style={s.sLabel}># projects</div>
                {data.projects.map(proj => (
                  <div key={proj.id} style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '9pt' }}>{proj.name}</div>
                    {proj.tech && <div style={{ color: '#4ade80', fontSize: '8pt', marginBottom: '2px' }}>{proj.tech}</div>}
                    {proj.description && <div style={{ color: '#94a3b8', fontSize: '8.5pt', lineHeight: 1.5 }}>{proj.description}</div>}
                  </div>
                ))}
              </>
            )}
            {data.certifications.length > 0 && (
              <>
                <div style={s.sLabel}># certs</div>
                {data.certifications.map(c => (
                  <div key={c.id} style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '9pt' }}>{c.name}</div>
                    <div style={{ color: '#64748b', fontSize: '8.5pt' }}>{c.issuer}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
