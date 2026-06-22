import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pieces, tempCategory, condition, occasion, gender } = req.body ?? {}

  if (!pieces?.length) {
    return res.status(400).json({ error: 'No pieces provided' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured' })
  }

  const pieceList = pieces
    .map(p => `${p.name} (${p.colors?.[0] ? p.colors[0] + ' ' : ''}${p.type})`)
    .join(', ')

  const weatherDesc = `${tempCategory ?? 'mild'} temperature, ${condition ?? 'clear'} conditions`
  const genderDesc = gender && gender !== 'all' ? `for a ${gender}` : ''

  const prompt = `You are a concise fashion stylist. Name this outfit and give a punchy style tip.

Outfit: ${pieceList}
Context: ${weatherDesc}, ${occasion ?? 'casual'} occasion ${genderDesc}

Reply with ONLY valid JSON, no markdown, no extra text:
{"name":"2-4 word creative outfit name","tip":"One punchy tip under 12 words"}`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = response.content[0]?.text?.trim() ?? ''
    const match = raw.match(/\{[\s\S]*?\}/)
    if (!match) throw new Error('No JSON in response')
    const { name, tip } = JSON.parse(match[0])
    return res.status(200).json({ name: name ?? '', tip: tip ?? '' })
  } catch (err) {
    console.error('[suggest]', err.message)
    return res.status(500).json({ error: 'Generation failed' })
  }
}
