import { ResumeData } from '@/types/resume.types';

export function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white text-black">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{data.personalInfo.fullName}</h1>
        {data.personalInfo.title && <p className="text-slate-600">{data.personalInfo.title}</p>}
      </div>

      {/* Contact Bar */}
      <div className="text-center text-sm text-slate-600 border-b pb-4 mb-6">
        {[
          data.personalInfo.email,
          data.personalInfo.phone,
          data.personalInfo.location,
          data.personalInfo.linkedin,
          data.personalInfo.github,
        ]
          .filter(Boolean)
          .join(' | ')}
      </div>

      {/* Summary */}
      {data.summary && (
        <>
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">Summary</h2>
            <p className="text-sm mt-2">{data.summary}</p>
          </div>
          <div className="border-b pb-4 mb-4" />
        </>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mt-3 mb-3">
                <div className="flex justify-between">
                  <span className="font-bold">{exp.title}</span>
                  <span className="text-slate-600 text-sm">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-slate-600 text-sm">{exp.company}</div>
                {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-2 ml-4">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-sm">
                        — {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="border-b pb-4 mb-4" />
        </>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mt-2 mb-2">
                <div className="font-bold">{edu.degree} in {edu.field}</div>
                <div className="text-slate-600 text-sm">{edu.institution}</div>
                <div className="text-slate-600 text-sm">{edu.startYear} — {edu.endYear} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </div>
          <div className="border-b pb-4 mb-4" />
        </>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">Skills</h2>
            <p className="text-sm mt-2">{data.skills.join(', ')}</p>
          </div>
          <div className="border-b pb-4 mb-4" />
        </>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black pb-1">Projects</h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mt-2 mb-3">
                <div className="font-bold">{proj.name}</div>
                {proj.description && <p className="text-sm">{proj.description}</p>}
                {proj.techStack.length > 0 && <p className="text-sm text-slate-600">{proj.techStack.join(', ')}</p>}
                {proj.githubUrl && <a href={proj.githubUrl} className="text-sm text-blue-600">{proj.githubUrl}</a>}
              </div>
            ))}
          </div>
          <div className="border-b pb-4 mb-4" />
        </>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1">Certifications</h2>
          <p className="text-sm mt-2">{data.certifications.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
