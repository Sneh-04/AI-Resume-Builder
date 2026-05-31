const s = {
  root: { fontFamily: "'DM Sans', sans-serif", minHeight: '297mm', fontSize: '10pt', color: '#111', background: '#fafafa', padding: '44px 48px' },
  name: { fontFamily: "'Playfair Display', serif", fontSize: '30pt', fontWeight: 700, color: '#111', letterSpacing: '-0.02em', marginBottom: '2px' },
  title: { fontSize: '11pt', color: '#888', fontWeight: 400, marginBottom: '16px', fontStyle: 'italic' },
  contactRow: { display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '8pt', color: '#888', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid #eee' },
  sLabel: { fontSize: '7.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#e53e3e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
  sLabelLine: { flex: 1, height: '1px', background: '#fee2e2' },
  section: { marginBottom: '24px' },
  expTitle: { fontWeight: 700, fontSize: '10.5pt', color: '#111' },
  expRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' },
  expSub: { fontSize: '9pt', color: '#888', marginBottom: '5px' },
  bullet: { fontSize: '9pt', color: '#333', lineHeight: 1.6, paddingLeft: '16px', position: 'relative', marginBottom: '3px' },
  summary: { fontSize: '10pt', color: '#444', lineHeight: 1.75, fontStyle: 'italic' },
  skill: { display: 'inline-block', background: 'transparent', color: '#333', border: '1px solid #ddd', padding: '2px 9px', borderRadius: '2px', fontSize: '8pt', marginRight: '5px', marginBottom: '5px' },
  date: { fontSize: '8.5pt', color: '#bbb', fontFamily: 'monospace' },
}

function Label({ children }) {
  return (
    <div style={s.sLabel}>
      {children}
      <span style={s.sLabelLine} />
    </div>
  )
}

export default function MinimalTemplate({ data }) {
  const p = data.personal
  return (
    <div style={s.root}>
      <div style={s.name}>{p.name || 'Your Name'}</div>
      <div style={s.title}>{p.title || 'Professional Title'}</div>
      <div style={s.contactRow}>
        {p.email && <span>{p.email}</span>}
        {p.phone && <span>{p.phone}</span>}
        {p.location && <span>{p.location}</span>}
        {p.linkedin && <span>{p.linkedin}</span>}
        {p.github && <span>{p.github}</span>}
        {p.website && <span>{p.website}</span>}
      </div>

      {p.summary && (
        <div style={s.section}>
          <Label>About</Label>
          <p style={s.summary}>{p.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={s.section}>
          <Label>Experience</Label>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '15px' }}>
              <div style={s.expRow}>
                <span style={s.expTitle}>{exp.role || 'Job Title'}</span>
                <span style={s.date}>{exp.start}{exp.end ? ` — ${exp.end}` : ''}</span>
              </div>
              <div style={s.expSub}>{exp.company}</div>
              {exp.bullets && exp.bullets.split('\n').filter(Boolean).map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={{ position: 'absolute', left: 0, color: '#e53e3e', fontWeight: 700 }}>—</span>
                  {b.replace(/^[•\-—]\s*/, '')}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          {data.education.length > 0 && (
            <div style={s.section}>
              <Label>Education</Label>
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '11px' }}>
                  <div style={{ fontWeight: 700, fontSize: '9.5pt' }}>{edu.degree}</div>
                  <div style={{ fontSize: '9pt', color: '#666' }}>{edu.institution}</div>
                  <div style={{ fontSize: '8.5pt', color: '#bbb' }}>{edu.year}{edu.gpa ? ` · ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div style={s.section}>
              <Label>Projects</Label>
              {data.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '11px' }}>
                  <div style={{ fontWeight: 700, fontSize: '9.5pt' }}>{proj.name}</div>
                  {proj.tech && <div style={{ fontSize: '8pt', color: '#e53e3e' }}>{proj.tech}</div>}
                  {proj.description && <div style={{ fontSize: '8.5pt', color: '#555', lineHeight: 1.5, marginTop: '2px' }}>{proj.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {data.skills.length > 0 && (
            <div style={s.section}>
              <Label>Skills</Label>
              <div>{data.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}</div>
            </div>
          )}

          {data.certifications.length > 0 && (
            <div style={s.section}>
              <Label>Certifications</Label>
              {data.certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '9pt' }}>{cert.name}</div>
                  <div style={{ fontSize: '8.5pt', color: '#888' }}>{cert.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
