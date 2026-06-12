export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, data } = req.body || {}
  const apiKey = process.env.GEMINI_API_KEY

  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data in request body' })
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' })
  }

  let prompt = ''
  if (type === 'summary') {
    prompt = `Write a professional 60-80 word ATS-friendly resume summary for:
Name: ${data.name}, Title: ${data.title}, Experience: ${data.experience}, Skills: ${data.skills}.
First-person tone, no filler phrases. Return only the summary text, nothing else.`
  } else if (type === 'bullets') {
    const jdPart = data.jobDescription ? `Tailor the bullets to match this job description: ${data.jobDescription}.` : ''
    prompt = `Write 3 achievement-focused resume bullet points for this job role: ${data.roleDescription}.
${jdPart}
Use strong action verbs. Include measurable outcomes where possible.
Return only a plain numbered list, nothing else.`
  } else if (type === 'coach') {
    const resumeContext = data.resumeData
      ? `Here is the user's current resume data:\n${JSON.stringify(data.resumeData, null, 2)}`
      : 'The user has not filled in their resume yet.'

    prompt = `You are an expert resume coach helping someone get hired.\nYou can see their resume in real time.\n\n${resumeContext}\n\nThe user asks: "${data.message}"\n\nGive a specific, actionable answer based on their actual resume content.\nBe concise (max 3-4 sentences or a short bullet list).\nDo not repeat their question back. Do not use filler phrases like "Great question!".\nSpeak directly like a professional coach.`
  } else if (type === 'prompt') {
    if (!data.prompt) {
      return res.status(400).json({ error: 'Missing prompt for generic generation' })
    }
    prompt = data.prompt
    if (data.systemInstruction) {
      prompt = `${data.systemInstruction}\n\n${prompt}`
    }
  } else {
    return res.status(400).json({ error: 'Invalid type' })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      console.error('Gemini API error:', err)
      return res.status(response.status).json({ error: err?.error?.message || `Gemini API error ${response.status}` })
    }

    const result = await response.json()

    if (result.error) {
      console.error('Gemini API error:', result.error)
      return res.status(500).json({ error: result.error.message })
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) return res.status(500).json({ error: 'Empty response from AI' })

    return res.status(200).json({ text })
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
