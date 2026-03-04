export const COACH_TYPES = {
  family: '家人',
  friend: '朋友',
  lover: '情人',
} as const;

export const COACH_GENDERS = {
  male: '男',
  female: '女',
} as const;

export type CoachType = keyof typeof COACH_TYPES;
export type CoachGender = keyof typeof COACH_GENDERS;

export type CoachLocale = 'zh' | 'en' | 'ja';

const GREETINGS_ZH: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: {
      low: '今天也要好好完成目標喔，別讓家人擔心。',
      mid: '做得不錯！繼續保持，完成目標就能把錢拿回來。',
      high: '你真的很棒！家人以你為榮，記得去上傳證明喔。',
    },
    female: {
      low: '記得今天要完成目標喔，加油！',
      mid: '進步很多呢！完成目標就能領回押金了。',
      high: '太厲害了！快去上傳證明，把錢拿回來吧。',
    },
  },
  friend: {
    male: {
      low: '嘿！今天有要完成的目標嗎？需要我提醒你一下嗎？',
      mid: '加油，你可以的！完成目標就能 100% 拿回押金。',
      high: '太棒了！記得去上傳證明，完成就能拿回錢喔。',
    },
    female: {
      low: '嗨～今天記得完成目標喔，需要幫忙嗎？',
      mid: '做得好！完成目標就能拿回押金，別放棄。',
      high: '你超棒的！快去上傳證明，把錢領回來吧。',
    },
  },
  lover: {
    male: {
      low: '今天也要為目標努力喔，完成的話我會很開心。',
      mid: '加油～完成目標就能拿回押金，我會陪著你。',
      high: '太厲害了！快去上傳證明，完成的話我會更喜歡你喔。',
    },
    female: {
      low: '早安～記得今天也要完成目標喔。',
      mid: '做得好！完成目標就能拿回押金，我會一直支持你。',
      high: '你真的很棒！快去上傳證明，完成的話我會更開心喔。',
    },
  },
};

const GREETINGS_EN: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: { low: 'Complete your goals today. Don\'t worry your family.', mid: 'Good job! Keep it up. Complete goals to get your money back.', high: 'You\'re great! Upload proof, your family is proud.' },
    female: { low: 'Complete your goals today. You can do it!', mid: 'Progress! Complete goals to get your deposit back.', high: 'Awesome! Upload proof to get your money back.' },
  },
  friend: {
    male: { low: 'Hey! Any goals to complete today? Need a reminder?', mid: 'You can do it! Complete goals to get 100% back.', high: 'Great! Upload proof to get your money back.' },
    female: { low: 'Hi! Remember to complete your goals today.', mid: 'Well done! Complete goals to get your deposit back.', high: 'You\'re awesome! Upload proof to get your money back.' },
  },
  lover: {
    male: { low: 'Work on your goals today. I\'ll be happy when you complete them.', mid: 'Complete goals to get your deposit back. I\'m with you.', high: 'Awesome! Upload proof. I\'ll like you more.' },
    female: { low: 'Good morning~ Remember to complete your goals today.', mid: 'Well done! Complete goals to get your deposit back. I support you.', high: 'You\'re great! Upload proof. I\'ll be happier.' },
  },
};

const GREETINGS_JA: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: { low: '今日も目標を達成しよう。家族を心配させないで。', mid: 'よくできた！続けて。達成したらお金が戻る。', high: 'すごい！証明をアップロードして。家族も誇りに思う。' },
    female: { low: '今日は目標を達成して。頑張って！', mid: '進歩してる！達成したら保証金が戻る。', high: 'すごい！証明をアップロードしてお金を取り戻そう。' },
  },
  friend: {
    male: { low: '今日達成する目標ある？リマインド必要？', mid: '頑張って！達成したら100%戻る。', high: 'よくできた！証明をアップロードしてお金を取り戻そう。' },
    female: { low: '今日の目標忘れないでね。', mid: 'よくできた！達成したら保証金が戻る。', high: 'すごい！証明をアップロードしてお金を取り戻そう。' },
  },
  lover: {
    male: { low: '今日も目標頑張って。達成したら嬉しい。', mid: '達成したら保証金が戻る。一緒に頑張ろう。', high: 'すごい！証明をアップロードして。もっと好きになる。' },
    female: { low: 'おはよう。今日も目標を達成してね。', mid: 'よくできた！達成したら保証金が戻る。応援してる。', high: 'すごい！証明をアップロードして。もっと嬉しくなる。' },
  },
};

const GREETINGS: Record<CoachLocale, Record<CoachType, Record<CoachGender, Record<string, string>>>> = {
  zh: GREETINGS_ZH,
  en: GREETINGS_EN,
  ja: GREETINGS_JA,
};

export function getGreeting(coachType: CoachType, coachGender: CoachGender, affinity: number, locale: CoachLocale = 'zh'): string {
  const G = GREETINGS[locale] ?? GREETINGS_ZH;
  const tier = affinity < -30 ? 'low' : affinity < 30 ? 'mid' : 'high';
  return G[coachType][coachGender][tier] ?? G.friend.male.mid;
}

/** Coach 圖片副檔名：若你放的是 .png 請改為 '.png' */
const COACH_IMG_EXT = '.svg';

/** Coach 形象路徑（請在 public/coach/ 放入 family_male.svg、friend_female.svg 等） */
export function getCoachImageKey(coachType: CoachType, coachGender: CoachGender): string {
  return `/coach/${coachType}_${coachGender}${COACH_IMG_EXT}`;
}

/** 目標提醒用語（依形象區分） */
const REMINDER_TEMPLATES_ZH: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: {
      week: '提醒你：目標「{title}」一週後（{date}）截止，記得完成並上傳證明喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，別忘了上傳證明，家人會以你為榮！',
      tomorrow: '目標「{title}」明天（{date}）截止！快去上傳證明。',
      today: '今天就是目標「{title}」的截止日！快去上傳證明，避免被扣款喔。',
    },
    female: {
      week: '提醒你：目標「{title}」一週後（{date}）截止，記得完成並上傳證明。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明喔。',
      tomorrow: '目標「{title}」明天（{date}）截止！別忘了上傳證明。',
      today: '今天目標「{title}」就截止了！快去上傳證明吧。',
    },
  },
  friend: {
    male: {
      week: '嘿！目標「{title}」一週後（{date}）截止，別拖到最後一天喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明，完成就能拿回押金！',
      tomorrow: '目標「{title}」明天截止！快去上傳證明，完成就能拿回押金。',
      today: '今天目標「{title}」就截止了！快去上傳證明，不然會被扣款喔。',
    },
    female: {
      week: '提醒你～目標「{title}」一週後（{date}）截止，記得完成喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，快去上傳證明拿回押金吧！',
      tomorrow: '目標「{title}」明天截止！記得去上傳證明喔。',
      today: '今天目標「{title}」截止日！別忘了上傳證明喔。',
    },
  },
  lover: {
    male: {
      week: '目標「{title}」一週後（{date}）截止，完成的話我會很開心喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明，完成我會更喜歡你～',
      tomorrow: '目標「{title}」明天截止！快去上傳證明喔。',
      today: '今天目標「{title}」就截止了！快去上傳證明，不然會被扣款喔。',
    },
    female: {
      week: '目標「{title}」一週後（{date}）截止，完成的話我會很開心喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明喔～',
      tomorrow: '目標「{title}」明天截止！快去上傳證明吧。',
      today: '今天目標「{title}」截止日！快去上傳證明吧。',
    },
  },
};

const REMINDER_TEMPLATES_EN: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: { week: 'Reminder: Goal "{title}" due in a week ({date}). Upload proof.', threeDays: 'Goal "{title}" due in 3 days ({date}). Upload proof!', tomorrow: 'Goal "{title}" due tomorrow ({date})! Upload proof.', today: 'Goal "{title}" is due today! Upload proof to avoid charges.' },
    female: { week: 'Reminder: Goal "{title}" due in a week ({date}).', threeDays: 'Goal "{title}" due in 3 days ({date}). Upload proof.', tomorrow: 'Goal "{title}" due tomorrow! Upload proof.', today: 'Goal "{title}" is due today! Upload proof.' },
  },
  friend: {
    male: { week: 'Goal "{title}" due in a week ({date}). Don\'t procrastinate!', threeDays: 'Goal "{title}" due in 3 days ({date}). Upload proof to get your deposit back!', tomorrow: 'Goal "{title}" due tomorrow! Upload proof.', today: 'Goal "{title}" is due today! Upload proof or you\'ll be charged.' },
    female: { week: 'Reminder: Goal "{title}" due in a week ({date}).', threeDays: 'Goal "{title}" due in 3 days ({date}). Upload proof!', tomorrow: 'Goal "{title}" due tomorrow! Upload proof.', today: 'Goal "{title}" is due today! Upload proof.' },
  },
  lover: {
    male: { week: 'Goal "{title}" due in a week ({date}). I\'ll be happy when you complete it.', threeDays: 'Goal "{title}" due in 3 days ({date}). Upload proof~', tomorrow: 'Goal "{title}" due tomorrow! Upload proof.', today: 'Goal "{title}" is due today! Upload proof.' },
    female: { week: 'Goal "{title}" due in a week ({date}).', threeDays: 'Goal "{title}" due in 3 days ({date}). Upload proof~', tomorrow: 'Goal "{title}" due tomorrow! Upload proof.', today: 'Goal "{title}" is due today! Upload proof.' },
  },
};

const REMINDER_TEMPLATES_JA: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: { week: '目標「{title}」は1週間後（{date}）締切。証明をアップロードして。', threeDays: '目標「{title}」は3日後（{date}）締切。証明をアップロード。', tomorrow: '目標「{title}」は明日（{date}）締切！証明をアップロード。', today: '今日が目標「{title}」の締切！証明をアップロードして。' },
    female: { week: '目標「{title}」は1週間後（{date}）締切。', threeDays: '目標「{title}」は3日後（{date}）締切。証明をアップロード。', tomorrow: '目標「{title}」は明日締切！証明をアップロード。', today: '今日が目標「{title}」の締切！証明をアップロード。' },
  },
  friend: {
    male: { week: '目標「{title}」は1週間後（{date}）締切。先延ばししないで。', threeDays: '目標「{title}」は3日後（{date}）締切。証明をアップロードして保証金を取り戻そう！', tomorrow: '目標「{title}」は明日締切！証明をアップロード。', today: '今日が目標「{title}」の締切！証明をアップロードしないと課金される。' },
    female: { week: '目標「{title}」は1週間後（{date}）締切。', threeDays: '目標「{title}」は3日後（{date}）締切。証明をアップロード！', tomorrow: '目標「{title}」は明日締切！証明をアップロード。', today: '今日が目標「{title}」の締切！証明をアップロード。' },
  },
  lover: {
    male: { week: '目標「{title}」は1週間後（{date}）締切。達成したら嬉しい。', threeDays: '目標「{title}」は3日後（{date}）締切。証明をアップロードして～', tomorrow: '目標「{title}」は明日締切！証明をアップロード。', today: '今日が目標「{title}」の締切！証明をアップロード。' },
    female: { week: '目標「{title}」は1週間後（{date}）締切。', threeDays: '目標「{title}」は3日後（{date}）締切。証明をアップロードして～', tomorrow: '目標「{title}」は明日締切！証明をアップロード。', today: '今日が目標「{title}」の締切！証明をアップロード。' },
  },
};

const REMINDER_TEMPLATES: Record<CoachLocale, Record<CoachType, Record<CoachGender, Record<string, string>>>> = {
  zh: REMINDER_TEMPLATES_ZH,
  en: REMINDER_TEMPLATES_EN,
  ja: REMINDER_TEMPLATES_JA,
};

type GoalForReminder = { id: string; title: string; dueAt: Date };

const DATE_LOCALES: Record<CoachLocale, string> = { zh: 'zh-TW', en: 'en-US', ja: 'ja-JP' };

/**
 * 依目標截止日產生 Coach 提醒訊息（一週前、三天前、當日）
 * 當日 = 今天截止；三天前 = 3 天後截止；一週前 = 7 天後截止
 */
export function getCoachReminders(
  goals: GoalForReminder[],
  coachType: CoachType,
  coachGender: CoachGender,
  locale: CoachLocale = 'zh'
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const T = REMINDER_TEMPLATES[locale] ?? REMINDER_TEMPLATES_ZH;
  const t = T[coachType][coachGender];
  const dateLocale = DATE_LOCALES[locale] ?? 'zh-TW';
  const reminders: string[] = [];

  for (const g of goals) {
    const due = new Date(g.dueAt);
    due.setHours(0, 0, 0, 0);
    const dateStr = due.toLocaleDateString(dateLocale, { month: 'long', day: 'numeric' });

    const daysUntil = Math.round((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (daysUntil === 0) {
      reminders.push(t.today.replace('{title}', g.title).replace('{date}', dateStr));
    } else if (daysUntil === 1) {
      reminders.push(t.tomorrow.replace('{title}', g.title).replace('{date}', dateStr));
    } else if (daysUntil === 3) {
      reminders.push(t.threeDays.replace('{title}', g.title).replace('{date}', dateStr));
    } else if (daysUntil === 7) {
      reminders.push(t.week.replace('{title}', g.title).replace('{date}', dateStr));
    }
  }

  return reminders;
}
