'use client';
import { useState, useEffect, useCallback } from 'react';
import { ResumeData, WorkExperience, Education, Project } from '@/types/resume.types';

const STORAGE_KEY = 'resumeai_data';

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  template: 'modern',
};

export function useResume() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setResumeData(JSON.parse(saved));
    } catch {
      console.error('Failed to load resume from localStorage');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      console.error('Failed to save resume to localStorage');
    }
  }, [resumeData]);

  const updatePersonalInfo = useCallback((updates: Partial<ResumeData['personalInfo']>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates },
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResumeData(prev => ({ ...prev, summary }));
  }, []);

  const updateTemplate = useCallback((template: ResumeData['template']) => {
    setResumeData(prev => ({ ...prev, template }));
  }, []);

  const addExperience = useCallback((exp: WorkExperience) => {
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, exp] }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<WorkExperience>) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  }, []);

  const addEducation = useCallback((edu: Education) => {
    setResumeData(prev => ({ ...prev, education: [...prev.education, edu] }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  }, []);

  const updateSkills = useCallback((skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  }, []);

  const addProject = useCallback((project: Project) => {
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, project] }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const updateCertifications = useCallback((certifications: string[]) => {
    setResumeData(prev => ({ ...prev, certifications }));
  }, []);

  const clearResume = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResumeData(defaultResumeData);
  }, []);

  return {
    resumeData,
    isSaved,
    updatePersonalInfo,
    updateSummary,
    updateTemplate,
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
  };
}
