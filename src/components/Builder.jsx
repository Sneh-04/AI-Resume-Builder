import { useState } from 'react'
import { Moon, Sun, ArrowLeft, Download, Edit3, Palette, Loader2, Save, CheckCircle, ClipboardCheck, FolderOpen, Link2, Mic, FileText, Globe, Wand2 } from 'lucide-react'
import FormPanel from './FormPanel.jsx'
import PreviewPanel from './PreviewPanel.jsx'
import TemplateSelector from './TemplateSelector.jsx'
import ATSChecker from './ATSChecker.jsx'
import JDModal from './JDModal.jsx'
import AICoach from './AICoach.jsx'
import LiveScoreBar from './LiveScoreBar.jsx'
import ResumeVersions from './ResumeVersions.jsx'
import ShareResume from './ShareResume.jsx'
import VoiceInput from './VoiceInput.jsx'
import CoverLetterGenerator from './CoverLetterGenerator.jsx'
import TranslateResume from './TranslateResume.jsx'
import BeforeAfterRewrite from './BeforeAfterRewrite.jsx'
import ColorThemePicker from './ColorThemePicker.jsx'

export default function Builder({ resumeData, setResumeData, template, setTemplate, darkMode, toggleDark, onBack }) {
  const [activeTab, setActiveTab] = useState('edit')
  const [showTemplates, setShowTemplates] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [accentColor, setAccentColor] = useState('#e8c97a')
  const [modal, setModal] = useState(null)

  const openModal = (name) => setModal(name)
  const closeModal = () => setModal(null)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById('resume-preview-content')
      const opt = {
        margin: 0,
        filename: `${resumeData.personal.name || 'resume'}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }
      await html2pdf().set(opt).from(element).save()
    } catch (e) { alert('PDF export failed.') }
    finally { setIsExporting(false) }
  }

  const handleSave = () => {
    try {
      localStorage.setItem('resumeai_data', JSON.stringify(resumeData))
      localStorage.setItem('resumeai_template', template)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {}
  }

  const handleVoiceInsert = (field, text) => {
    if (field === 'summary') setResumeData(d => ({ ...d, personal: { ...d.personal, summary: text } }))
    else if (field === 'skills') {
      const newSkills = text.split(',').map(s => s.trim()).filter(Boolean)
      setResumeData(d => ({ ...d, skills: [...new Set([...d.skills, ...newSkills])] }))
    }
  }

  const toolbarGroups = [
    {
      label: 'AI Tools',
      items: [
        { label: '🎯 Match JD', key: 'jd' },
        { label: '✅ ATS Check', key: 'ats' },
        { label: '✍️ Rewrite', key: 'rewrite' },
        { label: '📄 Cover Letter', key: 'cover' },
      ]
    },
    {
      label: 'More',
      items: [
        { label: '🎤 Voice', key: 'voice' },
        { label: '🌍 Translate', key: 'translate' },
        { label: '🎨 Colors', key: 'colors' },
        { label: '📁 Versions', key: 'versions' },
        { label: '🔗 Share', key: 'share' },
      ]
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)', position: 'sticky', top: 0, zIndex: 100, gap: '8px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-ghost" onClick={onBack} style={{ padding: '5px 9px' }}><ArrowLeft size={14} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: 25, height: 25, background: 'var(--accent)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit3 size={11} color="#0f0e0c" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>ResumeAI</span>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '2px' }}>
          {['edit', 'preview'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '4px 12px', borderRadius: '5px', border: 'none',
              background: activeTab === t ? 'var(--accent)' : 'transparent',
              color: activeTab === t ? '#0f0e0c' : 'var(--text2)',
              fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {t === 'edit' ? '✏️ Edit' : '👁 Preview'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '🎯 Match JD', key: 'jd' },
            { label: '✅ ATS', key: 'ats' },
            { label: '✍️ Rewrite', key: 'rewrite' },
            { label: '📄 Cover', key: 'cover' },
            { label: '🎤 Voice', key: 'voice' },
            { label: '🌍 Translate', key: 'translate' },
            { label: '🎨 Colors', key: 'colors' },
            { label: '📁 Versions', key: 'versions' },
            { label: '🔗 Share', key: 'share' },
          ].map(btn => (
            <button key={btn.key} className="btn-ghost" onClick={() => openModal(btn.key)}
              style={{ fontSize: '11px', padding: '4px 9px' }}>
              {btn.label}
            </button>
          ))}
          <button className="btn-ghost" onClick={() => setShowTemplates(t => !t)} style={{ fontSize: '11px', padding: '4px 9px' }}>
            <Palette size={11} /> Templates
          </button>
          <button className="btn-ghost" onClick={handleSave} style={{ fontSize: '11px', padding: '4px 9px' }}>
            {saved ? <CheckCircle size={11} color="var(--green)" /> : <Save size={11} />}
            {saved ? 'Saved!' : 'Save'}
          </button>
          <button className="btn-ghost" onClick={toggleDark} style={{ padding: '5px 7px' }}>
            {darkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button className="btn-primary" onClick={handleExportPDF} disabled={isExporting} style={{ fontSize: '11px', padding: '6px 12px' }}>
            {isExporting ? <Loader2 size={12} className="spinner" /> : <Download size={12} />}
            {isExporting ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </header>

      {showTemplates && (
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', padding: '10px 16px' }}>
          <TemplateSelector selected={template} onSelect={(t) => { setTemplate(t); setShowTemplates(false) }} />
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 49px)' }}>
        <div style={{
          width: '42%', minWidth: 320, display: activeTab === 'preview' ? 'none' : 'flex',
          flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <FormPanel resumeData={resumeData} setResumeData={setResumeData} />
          </div>
          <LiveScoreBar resumeData={resumeData} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg3)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px' }}>
          <PreviewPanel resumeData={resumeData} template={template} />
        </div>
      </div>

      {/* Modals */}
      {modal === 'ats' && <ATSChecker resumeData={resumeData} onClose={closeModal} />}
      {modal === 'jd' && <JDModal resumeData={resumeData} setResumeData={setResumeData} setTemplate={setTemplate} onClose={closeModal} />}
      {modal === 'versions' && <ResumeVersions resumeData={resumeData} setResumeData={setResumeData} template={template} setTemplate={setTemplate} onClose={closeModal} />}
      {modal === 'share' && <ShareResume resumeData={resumeData} template={template} onClose={closeModal} />}
      {modal === 'voice' && <VoiceInput onInsert={handleVoiceInsert} onClose={closeModal} />}
      {modal === 'cover' && <CoverLetterGenerator resumeData={resumeData} onClose={closeModal} />}
      {modal === 'translate' && <TranslateResume resumeData={resumeData} setResumeData={setResumeData} onClose={closeModal} />}
      {modal === 'rewrite' && <BeforeAfterRewrite resumeData={resumeData} setResumeData={setResumeData} onClose={closeModal} />}
      {modal === 'colors' && <ColorThemePicker accentColor={accentColor} setAccentColor={setAccentColor} onClose={closeModal} />}

      <AICoach resumeData={resumeData} />
    </div>
  )
}
