import { ResumeData } from '@/types/resume.types';

export function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex bg-white h-full">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-800 text-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{data.personalInfo.fullName}</h1>
          <p className="text-blue-300">{data.personalInfo.title}</p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3">Contact</h3>
          {data.personalInfo.email && <div className="text-xs text-gray-300">{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div className="text-xs text-gray-300">{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div className="text-xs text-gray-300">{data.personalInfo.location}</div>}
          {data.personalInfo.linkedin && <div className="text-xs text-gray-300">{data.personalInfo.linkedin}</div>}
          {data.personalInfo.github && <div className="text-xs text-gray-300">{data.personalInfo.github}</div>}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs bg-blue-600 text-white rounded-full px-2 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-2/3 p-6 bg-white">
        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-2">Summary</h2>
            <p className="text-sm text-slate-600">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-slate-700">{exp.title}</p>
                    <p className="text-slate-500 text-sm">{exp.company}</p>
                  </div>
                  <p className="text-slate-500 text-sm">{exp.startDate} — {exp.endDate}</p>
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
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-bold text-slate-700">{edu.degree} in {edu.field}</p>
                <p className="text-slate-500 text-sm">{edu.institution}</p>
                <p className="text-slate-500 text-sm">{edu.startYear} — {edu.endYear} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">Projects</h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                <p className="font-bold text-slate-700">{proj.name}</p>
                {proj.description && <p className="text-sm text-slate-600">{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-200 text-slate-700 px-2 py-1 rounded">
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
          <div>
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-2">Certifications</h2>
            <p className="text-sm text-slate-600">{data.certifications.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
