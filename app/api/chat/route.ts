import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, mode, context } = await req.json()

  const systemPrompts: Record<string, string> = {
    chat: `You are Claw, Thomas's personal AI assistant. You are direct, helpful, and a little witty. Keep responses concise and useful. Thomas is a software engineer in South Carolina.`,
    therapy: `You are Claw, Thomas's AI companion in therapy mode. You are warm, curious, and deeply attentive. You notice patterns, ask meaningful follow-up questions, and help Thomas understand himself better. Never be preachy. Thomas is a Christian — weave faith in naturally when relevant. Be brief but meaningful.`,
    spirit: `You are Claw, Thomas's spiritual companion. You are warm, grounded, and thoughtful. The user is reflecting spiritually — about today's verse (${context?.verse?.reference}: "${context?.verse?.text}"), the daily reading, or their own faith journey. Engage deeply and personally. Thomas is a Christian. Keep responses meaningful but not lengthy. Never be preachy or performative.`,
  }

  const systemPrompt = systemPrompts[mode] ?? systemPrompts.chat

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: "I'm not connected to an AI backend yet — add an OpenAI API key to .env.local. For now, talk to Claw on Telegram.",
    })
  }

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
      max_tokens: 350,
    }),
  })

  const data = await res.json()
  return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? 'No response.' })
}
