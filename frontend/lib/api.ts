import axios from 'axios';
import { ResumeData, AiGenerateRequest, AiGenerateResponse } from '@/types/resume.types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const resumeApi = {
  create: (data: Partial<ResumeData>) =>
    apiClient.post('/api/resumes', data),
  getById: (id: number) =>
    apiClient.get(`/api/resumes/${id}`),
  update: (id: number, data: Partial<ResumeData>) =>
    apiClient.put(`/api/resumes/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/resumes/${id}`),
  getByUser: (userId: string) =>
    apiClient.get(`/api/resumes/user/${userId}`),
};

export const aiApi = {
  generate: (data: AiGenerateRequest) =>
    apiClient.post<AiGenerateResponse>('/api/ai/generate', data),
  rewrite: (data: AiGenerateRequest) =>
    apiClient.post<AiGenerateResponse>('/api/ai/rewrite', data),
};
