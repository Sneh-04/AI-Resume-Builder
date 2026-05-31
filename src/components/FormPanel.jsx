import { useState } from 'react'
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2, User, Briefcase, GraduationCap, Code2, FolderOpen, Award } from 'lucide-react'
import { askGemini } from '../gemini.js'


async function generateWithAI(prompt) {
  return await askGemini(prompt)
}

function SectionHeader({ icon, title, open, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
      padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--accent)' }}>{icon}</span>
      <span style={{ flex: 1, fontWeight: 600, fontSize: '14px', color: 'var(--text)', textAlign: 'left' }}>{title}</span>
      {open ? <ChevronUp size={15} color="var(--text3)" /> : <ChevronDown size={15} color="var(--text3)" />}
    </button>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

export default function FormPanel({ resumeData, setResumeData }) {
  const [openSections, setOpenSections] = useState({ personal: true, experience: true, education: true, skills: true, projects: false, certifications: false })
  const [aiLoading, setAiLoading] = useState({})
  const [aiError, setAiError] = useState(null)

  const toggle = (s) => setOpenSections(p => ({ ...p, [s]: !p[s] }))

  const updatePersonal = (field, val) =>
    setResumeData(d => ({ ...d, personal: { ...d.personal, [field]: val } }))

  const addItem = (section, template) =>
    setResumeData(d => ({ ...d, [section]: [...d[section], { ...template, id: Date.now() }] }))

  const updateItem = (section, id, field, val) =>
    setResumeData(d => ({
      ...d,
      [section]: d[section].map(item => item.id === id ? { ...item, [field]: val } : item),
    }))

  const removeItem = (section, id) =>
    setResumeData(d => ({ ...d, [section]: d[section].filter(item => item.id !== id) }))

  const addSkill = () => {
    const skill = prompt('Enter skill name:')
    if (skill?.trim()) {
      setResumeData(d => ({ ...d, skills: [...d.skills, skill.trim()] }))
    }
  }

  const removeSkill = (i) =>
    setResumeData(d => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }))

  const generateSummary = async () => {
    const { name, title, experience, skills } = resumeData.personal
    const expText = resumeData.experience.map(e => `${e.role} at ${e.company}`).join(', ')
    const skillsText = resumeData.skills.join(', ')
    const prompt = `Write a compelling, concise professional resume summary (3-4 sentences, 60-80 words) for:
Name: ${name || 'a professional'}
Title: ${title || 'Software Developer'}
Experience: ${expText || 'software development'}
Skills: ${skillsText || 'programming'}

Write in first person. Make it specific, impactful, and ATS-friendly. Return ONLY the summary text, nothing else.`
    setAiLoading(l => ({ ...l, summary: true }))
    setAiError(null)
    try {
      const text = await generateWithAI(prompt)
      updatePersonal('summary', text.trim())
    } catch (e) {
      setAiError('AI generation failed. Check your connection.')
    } finally {
      setAiLoading(l => ({ ...l, summary: false }))
    }
  }

  const generateBullets = async (expId, exp) => {
    const prompt = `Write 3 strong resume bullet points for this job:
Role: ${exp.role || 'Developer'}
Company: ${exp.company || 'Company'}
Duration: ${exp.start} - ${exp.end}
Description: ${exp.description || ''}

Rules: Start each with a strong action verb. Include metrics where possible. Be specific and impactful. Return ONLY the 3 bullets as plain text lines starting with •, nothing else.`
    setAiLoading(l => ({ ...l, [expId]: true }))
    setAiError(null)
    try {
      const text = await generateWithAI(prompt)
      updateItem('experience', expId, 'bullets', text.trim())
    } catch (e) {
      setAiError('AI generation failed.')
    } finally {
      setAiLoading(l => ({ ...l, [expId]: false }))
    }
  }

  const p = resumeData.personal

  return (
    <div style={{ paddingBottom: '40px' }}>
      {aiError && (
        <div style={{ margin: '16px', padding: '10px 14px', background: 'rgba(235,87,87,0.1)', border: '1px solid rgba(235,87,87,0.3)', borderRadius: 'var(--radius)', fontSize: '13px', color: 'var(--red)' }}>
          {aiError}
        </div>
      )}

      {/* PERSONAL */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <SectionHeader icon={<User size={16} />} title="Personal Information" open={openSections.personal} onToggle={() => toggle('personal')} />
        {openSections.personal && (
          <div style={{ padding: '20px', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name">
                <input className="input-field" value={p.name} onChange={e => updatePersonal('name', e.target.value)} placeholder="Jane Doe" />
              </Field>
              <Field label="Professional Title">
                <input className="input-field" value={p.title} onChange={e => updatePersonal('title', e.target.value)} placeholder="Software Engineer" />
              </Field>
              <Field label="Email">
                <input className="input-field" type="email" value={p.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="jane@email.com" />
              </Field>
              <Field label="Phone">
                <input className="input-field" value={p.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Location">
                <input className="input-field" value={p.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="Hyderabad, India" />
              </Field>
              <Field label="LinkedIn">
                <input className="input-field" value={p.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/janedoe" />
              </Field>
              <Field label="GitHub">
                <input className="input-field" value={p.github} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/janedoe" />
              </Field>
              <Field label="Website / Portfolio">
                <input className="input-field" value={p.website} onChange={e => updatePersonal('website', e.target.value)} placeholder="janedoe.dev" />
              </Field>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="label" style={{ margin: 0 }}>Professional Summary</label>
                <button
                  className="btn-ghost"
                  onClick={generateSummary}
                  disabled={aiLoading.summary}
                  style={{ padding: '5px 12px', fontSize: '12px', gap: '5px' }}
                >
                  {aiLoading.summary ? <Loader2 size={12} className="spinner" /> : <Sparkles size={12} />}
                  {aiLoading.summary ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea
                className="input-field"
                value={p.summary}
                onChange={e => updatePersonal('summary', e.target.value)}
                placeholder="Write a short professional summary or click AI Generate..."
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* EXPERIENCE */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <SectionHeader icon={<Briefcase size={16} />} title="Work Experience" open={openSections.experience} onToggle={() => toggle('experience')} />
        {openSections.experience && (
          <div style={{ padding: '20px', animation: 'fadeIn 0.2s ease' }}>
            {resumeData.experience.map((exp, i) => (
              <div key={exp.id} className="section-card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Experience #{i + 1}</span>
                  <button onClick={() => removeItem('experience', exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="Job Title">
                    <input className="input-field" value={exp.role} onChange={e => updateItem('experience', exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
                  </Field>
                  <Field label="Company">
                    <input className="input-field" value={exp.company} onChange={e => updateItem('experience', exp.id, 'company', e.target.value)} placeholder="Google" />
                  </Field>
                  <Field label="Start">
                    <input className="input-field" value={exp.start} onChange={e => updateItem('experience', exp.id, 'start', e.target.value)} placeholder="Jun 2022" />
                  </Field>
                  <Field label="End">
                    <input className="input-field" value={exp.end} onChange={e => updateItem('experience', exp.id, 'end', e.target.value)} placeholder="Present" />
                  </Field>
                </div>
                <Field label="Description (for AI)">
                  <textarea className="input-field" value={exp.description} onChange={e => updateItem('experience', exp.id, 'description', e.target.value)} placeholder="What did you do? AI will use this to write bullet points..." style={{ minHeight: 70 }} />
                </Field>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="label" style={{ margin: 0 }}>Bullet Points</label>
                    <button className="btn-ghost" onClick={() => generateBullets(exp.id, exp)} disabled={aiLoading[exp.id]} style={{ padding: '5px 12px', fontSize: '12px', gap: '5px' }}>
                      {aiLoading[exp.id] ? <Loader2 size={12} className="spinner" /> : <Sparkles size={12} />}
                      {aiLoading[exp.id] ? 'Writing...' : 'AI Write'}
                    </button>
                  </div>
                  <textarea className="input-field" value={exp.bullets} onChange={e => updateItem('experience', exp.id, 'bullets', e.target.value)} placeholder="• Built scalable APIs serving 1M+ requests/day&#10;• Reduced latency by 40% through caching..." style={{ minHeight: 90 }} />
                </div>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => addItem('experience', { role: '', company: '', start: '', end: '', description: '', bullets: '' })} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* EDUCATION */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <SectionHeader icon={<GraduationCap size={16} />} title="Education" open={openSections.education} onToggle={() => toggle('education')} />
        {openSections.education && (
          <div style={{ padding: '20px', animation: 'fadeIn 0.2s ease' }}>
            {resumeData.education.map((edu, i) => (
              <div key={edu.id} className="section-card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Education #{i + 1}</span>
                  <button onClick={() => removeItem('education', edu.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="Degree">
                    <input className="input-field" value={edu.degree} onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} placeholder="B.Tech Computer Science" />
                  </Field>
                  <Field label="Institution">
                    <input className="input-field" value={edu.institution} onChange={e => updateItem('education', edu.id, 'institution', e.target.value)} placeholder="KARE University" />
                  </Field>
                  <Field label="Year">
                    <input className="input-field" value={edu.year} onChange={e => updateItem('education', edu.id, 'year', e.target.value)} placeholder="2023 – 2027" />
                  </Field>
                  <Field label="GPA / Score">
                    <input className="input-field" value={edu.gpa} onChange={e => updateItem('education', edu.id, 'gpa', e.target.value)} placeholder="8.7 / 10" />
                  </Field>
                </div>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => addItem('education', { degree: '', institution: '', year: '', gpa: '' })} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* SKILLS */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <SectionHeader icon={<Code2 size={16} />} title="Skills" open={openSections.skills} onToggle={() => toggle('skills')} />
        {openSections.skills && (
          <div style={{ padding: '20px', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {resumeData.skills.map((skill, i) => (
                <span key={i} className="tag" style={{ cursor: 'default' }}>
                  {skill}
                  <button onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: '0 0 0 4px', lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <button className="btn-ghost" onClick={addSkill} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add Skill
            </button>
          </div>
        )}
      </div>

      {/* PROJECTS */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <SectionHeader icon={<FolderOpen size={16} />} title="Projects" open={openSections.projects} onToggle={() => toggle('projects')} />
        {openSections.projects && (
          <div style={{ padding: '20px', animation: 'fadeIn 0.2s ease' }}>
            {resumeData.projects.map((proj, i) => (
              <div key={proj.id} className="section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Project #{i + 1}</span>
                  <button onClick={() => removeItem('projects', proj.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="Project Name">
                    <input className="input-field" value={proj.name} onChange={e => updateItem('projects', proj.id, 'name', e.target.value)} placeholder="RoadGuard" />
                  </Field>
                  <Field label="Tech Stack">
                    <input className="input-field" value={proj.tech} onChange={e => updateItem('projects', proj.id, 'tech', e.target.value)} placeholder="React, FastAPI, YOLOv8" />
                  </Field>
                  <Field label="Link (optional)">
                    <input className="input-field" value={proj.link} onChange={e => updateItem('projects', proj.id, 'link', e.target.value)} placeholder="github.com/..." />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea className="input-field" value={proj.description} onChange={e => updateItem('projects', proj.id, 'description', e.target.value)} placeholder="What does this project do? What impact did it have?" style={{ minHeight: 70 }} />
                </Field>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => addItem('projects', { name: '', tech: '', link: '', description: '' })} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* CERTIFICATIONS */}
      <div>
        <SectionHeader icon={<Award size={16} />} title="Certifications & Awards" open={openSections.certifications} onToggle={() => toggle('certifications')} />
        {openSections.certifications && (
          <div style={{ padding: '20px', animation: 'fadeIn 0.2s ease' }}>
            {resumeData.certifications.map((cert, i) => (
              <div key={cert.id} className="section-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>Cert #{i + 1}</span>
                  <button onClick={() => removeItem('certifications', cert.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="Name">
                    <input className="input-field" value={cert.name} onChange={e => updateItem('certifications', cert.id, 'name', e.target.value)} placeholder="AWS Certified Developer" />
                  </Field>
                  <Field label="Issuer & Year">
                    <input className="input-field" value={cert.issuer} onChange={e => updateItem('certifications', cert.id, 'issuer', e.target.value)} placeholder="Amazon · 2024" />
                  </Field>
                </div>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => addItem('certifications', { name: '', issuer: '' })} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add Certification
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
