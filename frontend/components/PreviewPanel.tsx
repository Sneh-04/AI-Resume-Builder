'use client';
import { ResumeData } from '@/types/resume.types';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

type Props = {
  data: ResumeData;
  onExportPdf: () => void;
};

export default function PreviewPanel({ data, onExportPdf }: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h1 className="text-lg font-semibold">Preview</h1>
        <button onClick={onExportPdf} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      {/* Resume Preview */}
      <div id="resume-preview" className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div className="bg-white shadow">
          {data.template === 'modern' && <ModernTemplate data={data} />}
          {data.template === 'classic' && <ClassicTemplate data={data} />}
          {data.template === 'minimal' && <MinimalTemplate data={data} />}
        </div>
      </div>
    </div>
  );
}
