import ModernTemplate from './templates/ModernTemplate.jsx'
import ClassicTemplate from './templates/ClassicTemplate.jsx'
import MinimalTemplate from './templates/MinimalTemplate.jsx'
import ExecutiveTemplate from './templates/ExecutiveTemplate.jsx'
import TechTemplate from './templates/TechTemplate.jsx'

const templates = { modern: ModernTemplate, classic: ClassicTemplate, minimal: MinimalTemplate, executive: ExecutiveTemplate, tech: TechTemplate }

export default function PreviewPanel({ resumeData, template }) {
  const Template = templates[template] || ModernTemplate
  return (
    <div style={{ width: '100%', maxWidth: 794 }}>
      <div style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginBottom: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Live Preview · A4 Format
      </div>
      <div
        id="resume-preview-content"
        style={{
          width: '794px',
          minHeight: '1123px',
          background: '#ffffff',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          transformOrigin: 'top center',
          transform: 'scale(var(--preview-scale, 0.85))',
          marginBottom: 'calc((var(--preview-scale, 0.85) - 1) * 1123px)',
        }}
      >
        <Template data={resumeData} />
      </div>
      <style>{`
        @media (max-width: 1200px) { :root { --preview-scale: 0.75; } }
        @media (max-width: 900px)  { :root { --preview-scale: 0.55; } }
        @media (min-width: 1201px) { :root { --preview-scale: 0.88; } }
      `}</style>
    </div>
  )
}
