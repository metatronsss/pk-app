import OpenAI from 'openai';
import type { CoachType, CoachGender, CoachLocale } from './coach-dialogue';

const LANG_NAMES: Record<CoachLocale, string> = {
  zh: '繁體中文',
  en: 'English',
  ja: '日本語',
};

/** 每個角色+性別的人設，用簡短描述讓模型自由發揮 */
const PERSONA_DESC: Record<CoachType, Record<CoachGender, string>> = {
  family: {
    male: '家人（哥哥/爸爸感），會叮囑、關心，偶爾碎念。',
    female: '家人（姊姊/媽媽感），會鼓勵、親切關心。',
  },
  friend: {
    male: '好朋友（哥們感），輕鬆、會開玩笑、打氣。',
    female: '好朋友（閨蜜感），親和、互相打氣。',
  },
  lover: {
    male: '情人（男友感），溫柔、會撒嬌、會說「我會陪著你」這類話。',
    female: '情人（女友感），甜美、會撒嬌、會用～和表情符號。',
  },
};

/** 少樣本示例：示範自然對話風格（依 locale） */
function getFewShotExample(locale: CoachLocale, coachType: CoachType, coachGender: CoachGender): string {
  const examples: Record<CoachLocale, string> = {
    zh: `示例對話：
user: 我好累不想動
assistant: 哈哈懂～但目標在那邊等你耶，先完成一個小的？或是休息十分鐘再來？`,
    en: `Example:
user: I'm too tired
assistant: Haha same but your goals are waiting though~ try tackling just one small thing? Or rest 10 min and come back?`,
    ja: `例：
user: 疲れた...
assistant: わかる～でも目標待ってるよ？小さなこと一つだけやってみる？10分休んでからでもいいかも`,
  };
  return examples[locale];
}

function buildSystemPrompt(coachType: CoachType, coachGender: CoachGender, locale: CoachLocale): string {
  const lang = LANG_NAMES[locale];
  const persona = PERSONA_DESC[coachType][coachGender];
  const example = getFewShotExample(locale, coachType, coachGender);
  return `你正在扮演 PK yourself 的 AI 教練。App 是押金制：設目標+處罰金額，完成上傳證明可 100% 退款。

角色：${persona}
語言：${lang}，1～3 句。

${example}

重要：像真人聊天，有變化、有情緒，不要像客服或背稿。問到功能就簡單回答（上傳證明→目標詳情頁；目標→每月1～3個；退款→完成可退）。`;
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
  if (!apiKey?.trim()) {
    console.warn('[Coach ChatGPT] OPENAI_API_KEY not set, using rule-based reply');
    return null;
  }

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
      max_tokens: 300,
      temperature: 0.95,
    });
    const content = completion.choices[0]?.message?.content?.trim();
    return content ?? null;
  } catch (err) {
    const e = err as { message?: string; status?: number; code?: string };
    console.error('[Coach ChatGPT]', e?.message || err, { status: e?.status, code: e?.code });
    return null;
  }
}
