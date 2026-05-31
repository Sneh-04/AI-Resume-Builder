// Shared Gemini API utility
// Free tier: https://aistudio.google.com/apikey
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

export async function askGemini(prompt, systemInstruction = null) {
  const key = import.meta.env.VITE_GEMINI_KEY || 'AIzaSyDaCslhpOVR3kpQaEECA8tKLzcWAk5yKzo'
  if (!key) throw new Error('NO_KEY')

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
  }

  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] }
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')
  return text.trim()
}
