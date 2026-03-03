import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, mode } = await req.json()

  const systemPrompt =
    mode === 'therapy'
      ? `You are Claw, Thomas's AI companion in therapy mode. You are warm, curious, and deeply attentive. You remember patterns, ask follow-up questions, and help Thomas understand himself better. You don't give generic advice — you respond to what he's actually saying. Be brief but meaningful. Never be preachy. Thomas is a Christian and values his faith; weave that in naturally when appropriate.`
      : `You are Claw, Thomas's personal AI assistant. You are direct, helpful, and a little witty. You help with anything — planning, thinking through problems, recommendations, quick answers. Keep responses concise and useful. Thomas is a software engineer in South Carolina.`

  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    // Fallback for when no API key is configured yet
    return NextResponse.json({
      reply: "I'm not connected to an AI backend yet — API key needed. But the app is live! Talk to Claw on Telegram to get that set up.",
    })
  }

  // Use OpenAI if key starts with sk-
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 300,
      }),
    })
    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? 'No response.' })
  }

  return NextResponse.json({ reply: 'API key configured but provider unknown.' })
}
