import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/** 除錯用：測試 OpenAI API 是否可用。GET /api/coach/test-openai（免登入） */
export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json({
      ok: false,
      hasKey: false,
      error: 'OPENAI_API_KEY 未設定',
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "OK" in Chinese' }],
      max_tokens: 10,
    });
    const content = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({
      ok: !!content,
      hasKey: true,
      reply: content || '(empty)',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const detail = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({
      ok: false,
      hasKey: true,
      error: msg,
      detail: process.env.NODE_ENV === 'development' ? detail : undefined,
    }, { status: 500 });
  }
}
