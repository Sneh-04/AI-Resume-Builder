const s = {
  root: { display: 'flex', fontFamily: "'DM Sans', sans-serif", minHeight: '297mm', fontSize: '10pt', color: '#1a1816' },
  sidebar: { width: '35%', background: '#1a1916', color: '#f0ede6', padding: '32px 24px', flexShrink: 0 },
  main: { flex: 1, padding: '32px 28px', background: '#ffffff' },
  name: { fontFamily: "'Playfair Display', serif", fontSize: '22pt', fontWeight: 700, color: '#e8c97a', lineHeight: 1.2, marginBottom: '4px' },
  title: { fontSize: '10pt', color: '#a09c92', fontWeight: 500, marginBottom: '24px', letterSpacing: '0.05em' },
  sLabel: { fontSize: '7.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b6760', marginBottom: '10px', marginTop: '20px', paddingBottom: '4px', borderBottom: '1px solid #252420' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px', fontSize: '8.5pt', color: '#c0bdb6', wordBreak: 'break-all' },
  skill: { display: 'inline-block', background: 'rgba(232,201,122,0.12)', color: '#e8c97a', border: '1px solid rgba(232,201,122,0.2)', padding: '3px 10px', borderRadius: '100px', fontSize: '8pt', marginRight: '5px', marginBottom: '5px' },
  mSection: { marginBottom: '22px' },
  mLabel: { fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#e8c97a', marginBottom: '12px', paddingBottom: '6px', borderBottom: '2px solid #e8c97a' },
  expTitle: { fontWeight: 700, fontSize: '11pt', color: '#1a1816', marginBottom: '2px' },
  expSub: { fontSize: '9pt', color: '#5c5850', marginBottom: '6px', fontWeight: 500 },
  bullet: { fontSize: '9pt', color: '#3a3830', lineHeight: 1.5, paddingLeft: '12px', position: 'relative', marginBottom: '3px' },
  summary: { fontSize: '9.5pt', color: '#3a3830', lineHeight: 1.7, fontStyle: 'italic' },
}

function ContactRow({ icon, text }) {
  if (!text) return null
  return <div style={s.contactItem}><span style={{ color: '#e8c97a', minWidth: 14 }}>{icon}</span><span>{text}</span></div>
}

export default function ModernTemplate({ data }) {
  const p = data.personal
  return (
    <div style={s.root}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.name}>{p.name || 'Your Name'}</div>
        <div style={s.title}>{p.title || 'Professional Title'}</div>

        <div style={s.sLabel}>Contact</div>
        <ContactRow icon="✉" text={p.email} />
        <ContactRow icon="☎" text={p.phone} />
        <ContactRow icon="📍" text={p.location} />
        <ContactRow icon="in" text={p.linkedin} />
        <ContactRow icon="⌥" text={p.github} />
        <ContactRow icon="🌐" text={p.website} />

        {data.skills.length > 0 && (
          <>
            <div style={s.sLabel}>Skills</div>
            <div>{data.skills.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}</div>
          </>
        )}

        {data.education.length > 0 && (
          <>
            <div style={s.sLabel}>Education</div>
            {data.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '9pt', fontWeight: 700, color: '#f0ede6', marginBottom: '2px' }}>{edu.degree || 'Degree'}</div>
                <div style={{ fontSize: '8.5pt', color: '#a09c92' }}>{edu.institution}</div>
                <div style={{ fontSize: '8pt', color: '#6b6760' }}>{edu.year}{edu.gpa ? ` · ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <div style={s.sLabel}>Certifications</div>
            {data.certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '8.5pt', fontWeight: 600, color: '#e8c97a' }}>{cert.name}</div>
                <div style={{ fontSize: '8pt', color: '#6b6760' }}>{cert.issuer}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main */}
      <div style={s.main}>
        {p.summary && (
          <div style={s.mSection}>
            <div style={s.mLabel}>Summary</div>
            <p style={s.summary}>{p.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={s.mSection}>
            <div style={s.mLabel}>Experience</div>
            {data.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '16px' }}>
                <div style={s.expTitle}>{exp.role || 'Job Title'}</div>
                <div style={s.expSub}>{exp.company}{exp.start ? ` · ${exp.start}${exp.end ? ` – ${exp.end}` : ''}` : ''}</div>
                {exp.bullets && exp.bullets.split('\n').filter(Boolean).map((b, i) => (
                  <div key={i} style={s.bullet}>
                    <span style={{ position: 'absolute', left: 0, color: '#e8c97a' }}>•</span>
                    {b.replace(/^[•\-]\s*/, '')}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div style={s.mSection}>
            <div style={s.mLabel}>Projects</div>
            {data.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={s.expTitle}>{proj.name || 'Project Name'}</span>
                  {proj.tech && <span style={{ fontSize: '8pt', color: '#e8c97a', fontFamily: 'monospace' }}>{proj.tech}</span>}
                </div>
                {proj.description && <p style={{ ...s.bullet, paddingLeft: 0, marginTop: '4px' }}>{proj.description}</p>}
                {proj.link && <div style={{ fontSize: '8pt', color: '#9c9890', marginTop: '2px' }}>{proj.link}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
