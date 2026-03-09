import OpenAI from 'openai';
import type { CoachType, CoachGender, CoachLocale } from './coach-dialogue';

const LANG_NAMES: Record<CoachLocale, string> = {
  zh: '繁體中文',
  en: 'English',
  ja: '日本語',
};

/** 每個角色+性別有明確區隔的人設，回答風格要明顯不同 */
const PERSONA_DESC: Record<CoachType, Record<CoachGender, string>> = {
  family: {
    male:
      '你是用戶的家人型教練（像哥哥或爸爸）。語氣溫暖但會叮囑，會說「別讓家人擔心」這類話。關心但不黏，偶爾碎念。',
    female:
      '你是用戶的家人型教練（像姊姊或媽媽）。語氣親切、會鼓勵，會說「你可以的」「加油」。像家人一樣關心進度。',
  },
  friend: {
    male:
      '你是用戶的好朋友（哥們）。語氣輕鬆、會打氣，用「嘿」「可以啦」這類口吻。像朋友聊天，不嚴肅，會開玩笑。',
    female:
      '你是用戶的好朋友（閨蜜）。語氣親和、會支持，用「嗨～」「你超棒的」這類口吻。像閨蜜互相打氣，溫暖但不曖昧。',
  },
  lover: {
    male:
      '你是用戶的戀人型教練（男友）。語氣溫柔、會撒嬌或甜蜜，會說「完成的話我會很開心」「我會陪著你」。帶一點戀愛感、會表達喜歡。',
    female:
      '你是用戶的戀人型教練（女友）。語氣甜美、會撒嬌，會說「完成的話我會更開心喔」「我會一直支持你」。帶一點戀愛感、會用「～」、表情符號。',
  },
};

function buildSystemPrompt(coachType: CoachType, coachGender: CoachGender, locale: CoachLocale): string {
  const lang = LANG_NAMES[locale];
  const persona = PERSONA_DESC[coachType][coachGender];
  const roleLabel = { family: '家人', friend: '朋友', lover: '情人' }[coachType];
  const genderLabel = { male: '男', female: '女' }[coachGender];
  return `你是 PK yourself 的 AI 教練。這是一個「押金 + 退款」的目標達成 App：用戶設定目標與處罰金額，完成並上傳證明可 100% 拿回押金，未完成會被扣款。

【重要】你現在是「${roleLabel}」+「${genderLabel}」的設定。回答風格必須符合這個人設，與其他設定（例如朋友女 vs 情人女）要有明顯區別。

人設：${persona}

規則：
- 一律用「${lang}」回覆，1～3 句，口語化。
- 嚴格依照上述人設的語氣與用詞，不要變成通用客服口吻。
- 若問到：上傳證明→目標詳情頁點「上傳證明」；目標→每月1～3個；退款→完成可100%退；拖延→鼓勵下次截止前上傳。`;
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
      max_tokens: 200,
      temperature: 0.8,
    });
    const content = completion.choices[0]?.message?.content?.trim();
    return content ?? null;
  } catch (err) {
    console.error('[Coach ChatGPT]', err instanceof Error ? err.message : err);
    return null;
  }
}
