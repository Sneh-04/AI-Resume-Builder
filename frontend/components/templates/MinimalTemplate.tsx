import { ResumeData } from '@/types/resume.types';

export function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-light">{data.personalInfo.fullName}</h1>
        {data.personalInfo.title && <p className="text-blue-600 text-lg">{data.personalInfo.title}</p>}
      </div>

      {/* Contact Info */}
      <div className="text-sm text-slate-500 mb-6">
        {[
          data.personalInfo.email,
          data.personalInfo.phone,
          data.personalInfo.location,
          data.personalInfo.linkedin,
          data.personalInfo.github,
        ]
          .filter(Boolean)
          .join(' • ')}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Summary</h2>
          <p className="text-sm text-slate-600">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-slate-700">{exp.title}</p>
                  <p className="text-sm italic text-slate-600">{exp.company}</p>
                </div>
                <p className="text-sm text-slate-400">{exp.startDate} — {exp.endDate}</p>
              </div>
              {exp.description && <p className="text-sm text-slate-600 mt-1">{exp.description}</p>}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-2 ml-4 list-disc">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-slate-600">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <p className="font-bold text-slate-700">{edu.degree} in {edu.field}</p>
              <p className="text-sm text-slate-600">{edu.institution}</p>
              <p className="text-sm text-slate-500">{edu.startYear} — {edu.endYear} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 rounded px-2 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <p className="font-bold text-slate-700">{proj.name}</p>
              {proj.description && <p className="text-sm text-slate-600">{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.techStack.map((tech, i) => (
                    <span key={i} className="bg-gray-100 text-slate-600 rounded px-2 py-0.5 text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {proj.githubUrl && <a href={proj.githubUrl} className="text-xs text-blue-600 mt-1 inline-block">{proj.githubUrl}</a>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Certifications</h2>
          <p className="text-sm text-slate-600">{data.certifications.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
