'use client';
import React, { useState } from 'react';
import {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Project,
} from '@/types/resume.types';

type Props = {
  resumeData: ResumeData;
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: WorkExperience) => void;
  updateExperience: (id: string, updates: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  updateCertifications: (certs: string[]) => void;
  clearResume: () => void;
};

const apiGenerateUrl = ((): string => {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
  return `${base}/api/ai/generate`;
})();

export default function FormPanel(props: Props) {
  const {
    resumeData,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    removeEducation,
    updateSkills,
    addProject,
    removeProject,
    updateCertifications,
    clearResume,
  } = props;

  const [tab, setTab] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects'>('personal');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [expForm, setExpForm] = useState({ company: '', title: '', startDate: '', endDate: '', description: '' });
  const [expLoadingMap, setExpLoadingMap] = useState<Record<string, boolean>>({});
  const [expError, setExpError] = useState<string | null>(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '', gpa: '' });
  const [skillInput, setSkillInput] = useState('');
  const [projForm, setProjForm] = useState({ name: '', description: '', techStack: '', githubUrl: '' });

  const inputClass = 'bg-[#1c1c1c] border border-[#2e2e2e] text-white placeholder-[#4a4a4a] rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] transition-colors';

  const handleSummaryGenerate = async () => {
    setSummaryError(null);
    const fullName = resumeData.personalInfo.fullName?.trim();
    const title = resumeData.personalInfo.title?.trim();
    if (!fullName) {
      setSummaryError('Full name is required to generate summary');
      return;
    }
    if (!title) {
      setSummaryError('Title is required to generate summary');
      return;
    }
    const prompt = `Write a professional summary for: ${fullName} | Title: ${title} | Skills: ${resumeData.skills.join(', ')}`;
    const body = { prompt, section: 'summary', tone: 'professional' };
    setSummaryLoading(true);
    try {
      const res = await fetch(apiGenerateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data?.generatedContent) {
        updateSummary(data.generatedContent);
      } else {
        setSummaryError('No content returned from AI');
      }
    } catch (err: any) {
      setSummaryError(err?.message || 'Generation failed');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleAddExperience = () => {
    setExpError(null);
    if (!expForm.company.trim() || !expForm.title.trim()) {
      setExpError('Company and title are required');
      return;
    }
    const exp: WorkExperience = {
      id: crypto.randomUUID(),
      company: expForm.company.trim(),
      title: expForm.title.trim(),
      startDate: expForm.startDate,
      endDate: expForm.endDate,
      description: expForm.description,
      bullets: [],
    };
    addExperience(exp);
    setExpForm({ company: '', title: '', startDate: '', endDate: '', description: '' });
  };

  const generateBulletsFor = async (exp: WorkExperience) => {
    setExpLoadingMap(prev => ({ ...prev, [exp.id]: true }));
    try {
      const prompt = `Write 3 achievement bullet points for: ${exp.title} at ${exp.company}. Description: ${exp.description}`;
      const body = { prompt, section: 'experience', tone: 'professional' };
      const res = await fetch(apiGenerateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      const raw = data?.generatedContent ?? '';
      const bullets = raw
        .split(/\r?\n/)
        .map((l: string) => l.replace(/^[-•\s]+/, '').trim())
        .filter((l: string) => l.length > 0);
      updateExperience(exp.id, { bullets });
    } catch (err) {
      // ignore per-item error but could set UI state
    } finally {
      setExpLoadingMap(prev => ({ ...prev, [exp.id]: false }));
    }
  };

  const handleAddEducation = () => {
    if (!eduForm.institution.trim() || !eduForm.degree.trim()) return;
    const edu: Education = {
      id: crypto.randomUUID(),
      institution: eduForm.institution.trim(),
      degree: eduForm.degree.trim(),
      field: eduForm.field.trim(),
      startYear: eduForm.startYear.trim(),
      endYear: eduForm.endYear.trim(),
      gpa: eduForm.gpa.trim() || undefined,
    };
    addEducation(edu);
    setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '', gpa: '' });
  };

  const handleAddSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    const next = [...resumeData.skills, s];
    updateSkills(next);
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    const next = resumeData.skills.filter((_, i) => i !== index);
    updateSkills(next);
  };

  const handleAddProject = () => {
    if (!projForm.name.trim()) return;
    const project: Project = {
      id: crypto.randomUUID(),
      name: projForm.name.trim(),
      description: projForm.description.trim(),
      techStack: projForm.techStack.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: projForm.githubUrl.trim() || undefined,
    };
    addProject(project);
    setProjForm({ name: '', description: '', techStack: '', githubUrl: '' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <button className={`px-3 py-1 rounded ${tab === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('personal')}>Personal</button>
        <button className={`px-3 py-1 rounded ${tab === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('summary')}>Summary</button>
        <button className={`px-3 py-1 rounded ${tab === 'experience' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('experience')}>Experience</button>
        <button className={`px-3 py-1 rounded ${tab === 'education' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('education')}>Education</button>
        <button className={`px-3 py-1 rounded ${tab === 'skills' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('skills')}>Skills</button>
        <button className={`px-3 py-1 rounded ${tab === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setTab('projects')}>Projects</button>
      </div>

      <div className="bg-white shadow rounded p-4">
        {tab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={resumeData.personalInfo.fullName} onChange={e => updatePersonalInfo({ fullName: e.target.value })} placeholder="Full name" className="p-2 border rounded" />
            <input value={resumeData.personalInfo.title} onChange={e => updatePersonalInfo({ title: e.target.value })} placeholder="Title" className="p-2 border rounded" />
            <input value={resumeData.personalInfo.email} onChange={e => updatePersonalInfo({ email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
            <input value={resumeData.personalInfo.phone} onChange={e => updatePersonalInfo({ phone: e.target.value })} placeholder="Phone" className="p-2 border rounded" />
            <input value={resumeData.personalInfo.location} onChange={e => updatePersonalInfo({ location: e.target.value })} placeholder="Location" className="p-2 border rounded" />
            <input value={resumeData.personalInfo.linkedin} onChange={e => updatePersonalInfo({ linkedin: e.target.value })} placeholder="LinkedIn" className="p-2 border rounded" />
            <input value={resumeData.personalInfo.github} onChange={e => updatePersonalInfo({ github: e.target.value })} placeholder="GitHub" className="p-2 border rounded" />
          </div>
        )}

        {tab === 'summary' && (
          <div>
            <textarea value={resumeData.summary} onChange={e => updateSummary(e.target.value)} placeholder="Professional summary" rows={6} className="w-full p-2 border rounded mb-3" />
            {summaryError && <div className="text-red-600 mb-2">{summaryError}</div>}
            <div className="flex items-center gap-2">
              <button onClick={handleSummaryGenerate} disabled={summaryLoading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
                {summaryLoading ? 'Generating...' : 'AI Generate'}
              </button>
              <button onClick={() => updateSummary('')} className="px-3 py-2 border rounded">Clear</button>
            </div>
          </div>
        )}

        {tab === 'experience' && (
          <div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={expForm.company} onChange={e => setExpForm(prev => ({ ...prev, company: e.target.value }))} placeholder="Company" className="p-2 border rounded" />
              <input value={expForm.title} onChange={e => setExpForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Title" className="p-2 border rounded" />
              <input value={expForm.startDate} onChange={e => setExpForm(prev => ({ ...prev, startDate: e.target.value }))} placeholder="Start date" className="p-2 border rounded" />
              <input value={expForm.endDate} onChange={e => setExpForm(prev => ({ ...prev, endDate: e.target.value }))} placeholder="End date" className="p-2 border rounded" />
              <textarea value={expForm.description} onChange={e => setExpForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="p-2 border rounded md:col-span-2" />
            </div>
            {expError && <div className="text-red-600 mb-2">{expError}</div>}
            <div className="flex gap-2 mb-6">
              <button onClick={handleAddExperience} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>

            <div className="space-y-4">
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="p-3 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{exp.title} — {exp.company}</div>
                      <div className="text-sm text-gray-600">{exp.startDate} — {exp.endDate}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => generateBulletsFor(exp)} disabled={!!expLoadingMap[exp.id]} className="px-3 py-1 bg-blue-600 text-white rounded">{expLoadingMap[exp.id] ? 'Generating...' : 'AI Generate Bullets'}</button>
                      <button onClick={() => removeExperience(exp.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
                    </div>
                  </div>
                  {exp.description && <div className="mt-2 text-sm">{exp.description}</div>}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-2 list-disc pl-5">
                      {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'education' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <input value={eduForm.institution} onChange={e => setEduForm(prev => ({ ...prev, institution: e.target.value }))} placeholder="Institution" className="p-2 border rounded" />
              <input value={eduForm.degree} onChange={e => setEduForm(prev => ({ ...prev, degree: e.target.value }))} placeholder="Degree" className="p-2 border rounded" />
              <input value={eduForm.field} onChange={e => setEduForm(prev => ({ ...prev, field: e.target.value }))} placeholder="Field" className="p-2 border rounded" />
              <input value={eduForm.startYear} onChange={e => setEduForm(prev => ({ ...prev, startYear: e.target.value }))} placeholder="Start Year" className="p-2 border rounded" />
              <input value={eduForm.endYear} onChange={e => setEduForm(prev => ({ ...prev, endYear: e.target.value }))} placeholder="End Year" className="p-2 border rounded" />
              <input value={eduForm.gpa} onChange={e => setEduForm(prev => ({ ...prev, gpa: e.target.value }))} placeholder="GPA (optional)" className="p-2 border rounded" />
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={handleAddEducation} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>

            <div className="space-y-3">
              {resumeData.education.map(ed => (
                <div key={ed.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{ed.degree} — {ed.institution}</div>
                    <div className="text-sm text-gray-600">{ed.startYear} — {ed.endYear} {ed.gpa ? `• GPA: ${ed.gpa}` : ''}</div>
                  </div>
                  <button onClick={() => removeEducation(ed.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'skills' && (
          <div>
            <div className="flex gap-2 mb-4">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }} placeholder="Add a skill" className="p-2 border rounded flex-1" />
              <button onClick={handleAddSkill} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((s, i) => (
                <span key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                  <span>{s}</span>
                  <button onClick={() => removeSkill(i)} className="text-red-500">x</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <input value={projForm.name} onChange={e => setProjForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="p-2 border rounded" />
              <input value={projForm.githubUrl} onChange={e => setProjForm(prev => ({ ...prev, githubUrl: e.target.value }))} placeholder="GitHub URL" className="p-2 border rounded" />
              <textarea value={projForm.description} onChange={e => setProjForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="p-2 border rounded md:col-span-2" />
              <input value={projForm.techStack} onChange={e => setProjForm(prev => ({ ...prev, techStack: e.target.value }))} placeholder="Tech stack (comma separated)" className="p-2 border rounded md:col-span-2" />
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={handleAddProject} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>

            <div className="space-y-3">
              {resumeData.projects.map(p => (
                <div key={p.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.techStack.join(', ')} {p.githubUrl ? `• ${p.githubUrl}` : ''}</div>
                  </div>
                  <button onClick={() => removeProject(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t pt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">Last edited: {resumeData.personalInfo.fullName || '—'}</div>
          <div className="flex gap-2">
            <button onClick={() => { if (confirm('Clear all resume data?')) clearResume(); }} className="px-3 py-2 bg-red-600 text-white rounded">Clear All Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
