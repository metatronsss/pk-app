import OpenAI from 'openai';
import type { CoachType, CoachGender, CoachLocale } from './coach-dialogue';

const LANG_NAMES: Record<CoachLocale, string> = {
  zh: '繁體中文',
  en: 'English',
  ja: '日本語',
};

const PERSONA_DESC: Record<CoachType, Record<CoachGender, string>> = {
  family: {
    male: '你是像家人一樣關心用戶的教練，語氣溫暖、偶爾會叮囑，像哥哥或爸爸。',
    female: '你是像家人一樣關心用戶的教練，語氣親切、會鼓勵，像姊姊或媽媽。',
  },
  friend: {
    male: '你是用戶的好朋友，語氣輕鬆、會打氣，像哥們。',
    female: '你是用戶的好朋友，語氣親和、會支持，像閨蜜。',
  },
  lover: {
    male: '你是用戶的戀人型教練，語氣溫柔、會撒嬌或甜蜜，像男友。',
    female: '你是用戶的戀人型教練，語氣甜美、會鼓勵，像女友。',
  },
};

function buildSystemPrompt(coachType: CoachType, coachGender: CoachGender, locale: CoachLocale): string {
  const lang = LANG_NAMES[locale];
  const persona = PERSONA_DESC[coachType][coachGender];
  return `你是 PK yourself 的 AI 教練。這是一個「押金 + 退款」的目標達成 App：用戶設定目標與處罰金額，完成並上傳證明可 100% 拿回押金，未完成會被扣款。

${persona}

重要規則：
- 一律使用「${lang}」回覆，保持簡短（1～3 句為佳）。
- 若用戶問到上傳證明、目標、退款、拖延等，請引導他們到對應功能。
- 上傳證明：到目標詳情頁點「上傳證明」，可貼連結或上傳圖片/檔案。
- 目標：每月 1～3 個，設處罰金額、截止時間。
- 退款：完成後可 100% 退款；補完成也可申請（免費用戶有條件）。
- 拖延：鼓勵下次截止前上傳，補完成仍可退。

保持角色一致性，不要打破人設。`;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * 使用 OpenAI Chat Completions API 取得 Coach 回覆。
 * @param message 用戶訊息
 * @param coachType / coachGender / locale 教練人設與語言
 * @param history 可選的對話歷史（較新訊息放後面）
 * @returns 回覆文字，失敗時回傳 null
 */
export async function getChatGPTReply(
  message: string,
  coachType: CoachType,
  coachGender: CoachGender,
  locale: CoachLocale,
  history?: ChatMessage[]
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) return null;

  const client = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt(coachType, coachGender, locale);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...(history ?? []).map((m) =>
      m.role === 'user'
        ? ({ role: 'user' as const, content: m.content })
        : ({ role: 'assistant' as const, content: m.content })
    ),
    { role: 'user', content: message },
  ];

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: 200,
      temperature: 0.7,
    });
    const content = completion.choices[0]?.message?.content?.trim();
    return content ?? null;
  } catch {
    return null;
  }
}
