import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { postId, content } = await req.json()
  let summary = content.slice(0, 150) + "..."

  console.log('Summarize called for postId:', postId)
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'EXISTS' : 'MISSING')

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Summarize this blog post in 150-200 words:\n\n${content}` }] }]
        })
      }
    )

    const geminiData = await geminiRes.json()
    console.log('Gemini response:', JSON.stringify(geminiData))
    
    const summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available'


    await supabase.from('posts').update({ summary }).eq('id', postId)

    return NextResponse.json({ success: true, summary })
  } catch (e) {
    console.log('Error:', e)
    await supabase.from('posts').update({ summary: 'No summary available' }).eq('id', postId)
    return NextResponse.json({ success: false })
  }
}
