import { useMemo } from 'react'

const POWER_WORDS = ['achieved','improved','reduced','increased','launched','built','led','managed','designed','developed','created','delivered','optimized','automated','scaled','drove','generated','saved','grew','deployed','architected','spearheaded','pioneered','transformed','streamlined']
const WEAK_WORDS = ['helped','worked','assisted','did','made','responsible for','involved in','participated','tried','attempted']

function pct(val, max) { return Math.min(100, Math.round((val / max) * 100)) }

export default function LiveScoreBar({ resumeData }) {
  const scores = useMemo(() => {
    const p = resumeData.personal
    const allText = [
      p.summary,
      ...resumeData.experience.map(e => e.bullets + ' ' + e.description),
      ...resumeData.projects.map(pr => pr.description),
    ].join(' ').toLowerCase()

    // Completeness
    const fields = [p.name, p.title, p.email, p.phone, p.location, p.summary, p.linkedin, p.github]
    const filledFields = fields.filter(Boolean).length
    const completeness = pct(filledFields, fields.length)
      + (resumeData.experience.length > 0 ? 10 : 0)
      + (resumeData.education.length > 0 ? 10 : 0)
      + (resumeData.skills.length >= 5 ? 10 : pct(resumeData.skills.length, 5) * 0.1)

    // Impact words
    const powerCount = POWER_WORDS.filter(w => allText.includes(w)).length
    const weakCount = WEAK_WORDS.filter(w => allText.includes(w)).length
    const impactScore = Math.max(0, pct(powerCount, 8) - weakCount * 10)

    // Quantification (numbers in bullets)
    const numbers = (allText.match(/\d+/g) || []).length
    const quantScore = pct(numbers, 6)

    // Skills coverage
    const skillScore = pct(resumeData.skills.length, 10)

    // Section completeness
    const sections = [
      resumeData.experience.length > 0,
      resumeData.education.length > 0,
      resumeData.skills.length > 0,
      resumeData.projects.length > 0,
      resumeData.certifications.length > 0,
      p.summary?.length > 50,
    ]
    const sectionScore = pct(sections.filter(Boolean).length, sections.length)

    const overall = Math.round(
      completeness * 0.25 +
      impactScore * 0.25 +
      quantScore * 0.2 +
      skillScore * 0.15 +
      sectionScore * 0.15
    )

    const foundPower = POWER_WORDS.filter(w => allText.includes(w))
    const foundWeak = WEAK_WORDS.filter(w => allText.includes(w))

    return { overall, completeness: Math.min(100, completeness), impactScore, quantScore, skillScore, sectionScore, foundPower, foundWeak, numbers }
  }, [resumeData])

  const color = scores.overall >= 80 ? '#6fcf97' : scores.overall >= 60 ? '#f2994a' : '#eb5757'
  const grade = scores.overall >= 90 ? 'A' : scores.overall >= 80 ? 'B' : scores.overall >= 70 ? 'C' : scores.overall >= 60 ? 'D' : 'F'

  const bars = [
    { label: 'Completeness', val: scores.completeness, color: '#5b9cf6' },
    { label: 'Impact Words', val: scores.impactScore, color: '#e8c97a' },
    { label: 'Quantified Results', val: scores.quantScore, color: '#a78bfa' },
    { label: 'Skills Coverage', val: scores.skillScore, color: '#4ade80' },
    { label: 'Section Coverage', val: scores.sectionScore, color: '#f2994a' },
  ]

  return (
    <div style={{ padding: '16px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      {/* Overall */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '2px' }}>Resume Score</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>{scores.overall}<span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>/100</span></div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
          {grade}
        </div>
      </div>

      {/* Sub-scores */}
      {bars.map(b => (
        <div key={b.label} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text2)' }}>{b.label}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: b.color }}>{b.val}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${b.val}%`, height: '100%', background: b.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}

      {/* Tips */}
      <div style={{ marginTop: '12px', fontSize: '11px' }}>
        {scores.foundWeak.length > 0 && (
          <div style={{ background: 'rgba(235,87,87,0.08)', border: '1px solid rgba(235,87,87,0.2)', borderRadius: '6px', padding: '7px 10px', marginBottom: '6px', color: '#eb5757' }}>
            ⚠ Weak words: <strong>{scores.foundWeak.slice(0, 3).join(', ')}</strong>
          </div>
        )}
        {scores.numbers < 3 && (
          <div style={{ background: 'rgba(242,153,74,0.08)', border: '1px solid rgba(242,153,74,0.2)', borderRadius: '6px', padding: '7px 10px', marginBottom: '6px', color: '#f2994a' }}>
            💡 Add numbers to bullets (%, $, users, time saved)
          </div>
        )}
        {scores.overall >= 80 && (
          <div style={{ background: 'rgba(111,207,151,0.08)', border: '1px solid rgba(111,207,151,0.2)', borderRadius: '6px', padding: '7px 10px', color: '#6fcf97' }}>
            ✅ Strong resume! Ready to apply.
          </div>
        )}
      </div>
    </div>
  )
}
