const s = {
  root: { fontFamily: "'DM Sans', sans-serif", minHeight: '297mm', fontSize: '10pt', color: '#1a1816', background: '#ffffff', padding: '40px 44px' },
  header: { borderBottom: '3px solid #2d3748', paddingBottom: '18px', marginBottom: '20px' },
  name: { fontFamily: "'Playfair Display', serif", fontSize: '26pt', fontWeight: 700, color: '#2d3748', marginBottom: '4px' },
  title: { fontSize: '12pt', color: '#718096', fontWeight: 500, marginBottom: '12px' },
  contactRow: { display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: '8.5pt', color: '#718096' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  section: { marginBottom: '20px' },
  sLabel: { fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2d3748', marginBottom: '10px', paddingBottom: '4px', borderBottom: '1.5px solid #e2e8f0' },
  expTitle: { fontWeight: 700, fontSize: '10.5pt', color: '#2d3748' },
  expRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' },
  expSub: { fontSize: '9pt', color: '#718096', marginBottom: '5px', fontStyle: 'italic' },
  bullet: { fontSize: '9pt', color: '#4a5568', lineHeight: 1.55, paddingLeft: '14px', position: 'relative', marginBottom: '3px' },
  summary: { fontSize: '9.5pt', color: '#4a5568', lineHeight: 1.7 },
  skill: { display: 'inline-block', background: '#edf2f7', color: '#2d3748', padding: '3px 10px', borderRadius: '3px', fontSize: '8pt', marginRight: '5px', marginBottom: '5px', fontWeight: 500 },
  date: { fontSize: '8.5pt', color: '#a0aec0', fontWeight: 500, flexShrink: 0 },
}

function CI({ icon, text }) {
  if (!text) return null
  return <span style={s.contactItem}><span>{icon}</span><span>{text}</span></span>
}

export default function ClassicTemplate({ data }) {
  const p = data.personal
  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.name}>{p.name || 'Your Name'}</div>
        <div style={s.title}>{p.title || 'Professional Title'}</div>
        <div style={s.contactRow}>
          <CI icon="✉" text={p.email} />
          <CI icon="☎" text={p.phone} />
          <CI icon="📍" text={p.location} />
          <CI icon="in" text={p.linkedin} />
          <CI icon="⌥" text={p.github} />
          <CI icon="🌐" text={p.website} />
        </div>
      </div>

      {p.summary && (
        <div style={s.section}>
          <div style={s.sLabel}>Professional Summary</div>
          <p style={s.summary}>{p.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={s.section}>
          <div style={s.sLabel}>Work Experience</div>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={s.expRow}>
                <span style={s.expTitle}>{exp.role || 'Job Title'}</span>
                <span style={s.date}>{exp.start}{exp.end ? ` – ${exp.end}` : ''}</span>
              </div>
              <div style={s.expSub}>{exp.company}</div>
              {exp.bullets && exp.bullets.split('\n').filter(Boolean).map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={{ position: 'absolute', left: 0, color: '#2d3748' }}>›</span>
                  {b.replace(/^[•›\-]\s*/, '')}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        <div>
          {data.education.length > 0 && (
            <div style={s.section}>
              <div style={s.sLabel}>Education</div>
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#2d3748' }}>{edu.degree}</div>
                  <div style={{ fontSize: '9pt', color: '#718096', fontStyle: 'italic' }}>{edu.institution}</div>
                  <div style={{ fontSize: '8.5pt', color: '#a0aec0' }}>{edu.year}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          {data.certifications.length > 0 && (
            <div style={s.section}>
              <div style={s.sLabel}>Certifications</div>
              {data.certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '9pt', color: '#2d3748' }}>{cert.name}</div>
                  <div style={{ fontSize: '8.5pt', color: '#718096' }}>{cert.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {data.skills.length > 0 && (
            <div style={s.section}>
              <div style={s.sLabel}>Skills</div>
              <div>{data.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}</div>
            </div>
          )}

          {data.projects.length > 0 && (
            <div style={s.section}>
              <div style={s.sLabel}>Projects</div>
              {data.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '9pt', color: '#2d3748' }}>{proj.name}</div>
                  {proj.tech && <div style={{ fontSize: '8pt', color: '#4a90d9', marginBottom: '2px' }}>{proj.tech}</div>}
                  {proj.description && <div style={{ fontSize: '8.5pt', color: '#4a5568', lineHeight: 1.5 }}>{proj.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
