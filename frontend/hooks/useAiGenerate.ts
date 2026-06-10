'use client';
import { useState } from 'react';
import { aiApi } from '@/lib/api';
import { AiGenerateRequest } from '@/types/resume.types';

export function useAiGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (request: AiGenerateRequest): Promise<string | null> => {
    if (!request.prompt.trim()) {
      setError('Prompt cannot be empty');
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await aiApi.generate(request);
      return res.data.generatedContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI generation failed';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const rewrite = async (request: AiGenerateRequest): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await aiApi.rewrite(request);
      return res.data.generatedContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI rewrite failed';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { generate, rewrite, isLoading, error, clearError };
}
