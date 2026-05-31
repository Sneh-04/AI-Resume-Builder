import { Moon, Sun, Sparkles, FileText, Download, ChevronRight, Shield, Target, Save } from 'lucide-react'

export default function LandingPage({ onStart, darkMode, toggleDark, hasSaved }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={16} color="#0f0e0c" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>ResumeAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-ghost" onClick={toggleDark} style={{ padding: '8px 12px' }}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="btn-primary" onClick={onStart}>
            {hasSaved ? '↩ Continue Resume' : 'Start Building'} <ChevronRight size={15} />
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', textAlign: 'center', maxWidth: 860, margin: '0 auto', width: '100%' }}>
        <div className="tag" style={{ marginBottom: '22px' }}>
          <Sparkles size={12} /> Powered by Claude AI
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5.5vw,68px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text)', marginBottom: '22px' }}>
          Resumes that get you<br /><span style={{ color: 'var(--accent)' }}>hired faster.</span>
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--text2)', maxWidth: 520, lineHeight: 1.7, marginBottom: '36px' }}>
          AI writes your summary, checks ATS score, matches to job descriptions, and exports a pixel-perfect PDF.
        </p>
        <button className="btn-primary" onClick={onStart} style={{ fontSize: '15px', padding: '13px 30px' }}>
          {hasSaved ? '↩ Continue Building My Resume' : 'Build My Resume Free'} <ChevronRight size={16} />
        </button>
        {hasSaved && <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '10px' }}>Your previous data has been restored automatically</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginTop: '60px', width: '100%' }}>
          {[
            { icon: <Sparkles size={18} />, title: 'AI Content', desc: 'Claude generates tailored summaries & bullet points' },
            { icon: <Shield size={18} />, title: 'ATS Checker', desc: 'Score your resume against applicant tracking systems' },
            { icon: <Target size={18} />, title: 'JD Match', desc: 'Paste a job description — AI tailors everything instantly' },
            { icon: <Save size={18} />, title: 'Auto-Save', desc: 'Your data is saved locally — pick up where you left off' },
            { icon: <FileText size={18} />, title: '5 Templates', desc: 'Modern, Classic, Minimal, Executive & Tech themes' },
            { icon: <Download size={18} />, title: 'PDF Export', desc: 'Download a print-ready A4 PDF in one click' },
          ].map((f, i) => (
            <div key={i} className="section-card fade-in" style={{ textAlign: 'left', animationDelay: `${i * 0.07}s` }}>
              <div style={{ color: 'var(--accent)', marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '5px', color: 'var(--text)' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ padding: '18px 48px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>
        Built for Techrise Internship Assignment · ResumeAI
      </footer>
    </div>
  )
}
