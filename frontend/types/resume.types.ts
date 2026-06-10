export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  title: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  template: 'modern' | 'classic' | 'minimal';
}

export type TemplateName = 'modern' | 'classic' | 'minimal';

export interface AiGenerateRequest {
  prompt: string;
  section: string;
  resumeContext?: string;
  tone?: string;
}

export interface AiGenerateResponse {
  generatedContent: string;
  section: string;
  tokensUsed: number;
  model: string;
}
