import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage.jsx'
import Builder from './components/Builder.jsx'

const defaultData = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', summary: '' },
  experience: [], education: [], skills: [], projects: [], certifications: [],
}

export default function App() {
  const [page, setPage] = useState('landing')
  const [darkMode, setDarkMode] = useState(true)
  const [resumeData, setResumeData] = useState(defaultData)
  const [template, setTemplate] = useState('modern')
  const [hasSaved, setHasSaved] = useState(false)

  useEffect(() => {
    // Check for shared resume link first
    try {
      const params = new URLSearchParams(window.location.search)
      const encoded = params.get('resume')
      if (encoded) {
        const payload = JSON.parse(decodeURIComponent(atob(encoded)))
        if (payload.data) { setResumeData(payload.data); setTemplate(payload.template || 'modern'); setPage('builder') }
        window.history.replaceState({}, '', window.location.pathname)
        return
      }
    } catch (e) {}

    // Load saved data
    try {
      const saved = localStorage.getItem('resumeai_data')
      const savedTemplate = localStorage.getItem('resumeai_template')
      if (saved) { setResumeData(JSON.parse(saved)); setHasSaved(true) }
      if (savedTemplate) setTemplate(savedTemplate)
    } catch (e) {}
  }, [])

  const appClass = darkMode ? '' : 'light-mode'

  if (page === 'landing') {
    return (
      <div className={appClass}>
        <LandingPage onStart={() => setPage('builder')} darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} hasSaved={hasSaved} />
      </div>
    )
  }

  return (
    <div className={appClass}>
      <Builder
        resumeData={resumeData} setResumeData={setResumeData}
        template={template} setTemplate={setTemplate}
        darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)}
        onBack={() => setPage('landing')}
      />
    </div>
  )
}
