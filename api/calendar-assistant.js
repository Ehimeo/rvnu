import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, profile, weather, events, currentDate } = req.body ?? {}

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured' })
  }

  const upcomingEvents = (events ?? [])
    .filter(e => new Date(`${e.date}T${e.time || '23:59'}`) >= new Date())
    .slice(0, 20)
    .map(e => {
      const dt = new Date(`${e.date}T${e.time || '00:00'}`)
      return `- "${e.title}" on ${dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}${e.time ? ` at ${e.time}` : ''} (${e.occasion || 'casual'}${e.notes ? `, note: ${e.notes}` : ''})`
    })
    .join('\n')

  const weatherDesc = weather
    ? `${weather.tempC}°C, ${weather.label}, ${weather.condition} conditions, ${weather.windLabel} wind`
    : 'unknown'

  const systemPrompt = `You are a smart calendar and style assistant for ${profile?.name || 'the user'}. Today is ${currentDate || new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

Current weather: ${weatherDesc}

Upcoming events:
${upcomingEvents || 'No upcoming events scheduled.'}

You help with:
- Summarizing and reviewing their schedule
- Suggesting what to wear for specific events based on occasion and weather
- Setting reminders and giving time-aware updates
- Answering questions about their calendar
- Providing style advice tailored to their events

Be concise, warm, and actionable. Use emojis sparingly for readability. Profile: gender=${profile?.gender || 'unspecified'}, style preferences=${profile?.stylePrefs?.join(', ') || 'casual'}.`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
      system: systemPrompt,
      messages: (messages ?? []).map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const text = response.content[0]?.text?.trim() ?? ''
    return res.status(200).json({ reply: text })
  } catch (err) {
    console.error('[calendar-assistant]', err.message)
    return res.status(500).json({ error: 'Assistant unavailable' })
  }
}
