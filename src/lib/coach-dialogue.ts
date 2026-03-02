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

const GREETINGS: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
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

export function getGreeting(coachType: CoachType, coachGender: CoachGender, affinity: number): string {
  const tier = affinity < -30 ? 'low' : affinity < 30 ? 'mid' : 'high';
  return GREETINGS[coachType][coachGender][tier] ?? GREETINGS.friend.male.mid;
}

/** Coach 圖片副檔名：若你放的是 .png 請改為 '.png' */
const COACH_IMG_EXT = '.svg';

/** Coach 形象路徑（請在 public/coach/ 放入 family_male.svg、friend_female.svg 等） */
export function getCoachImageKey(coachType: CoachType, coachGender: CoachGender): string {
  return `/coach/${coachType}_${coachGender}${COACH_IMG_EXT}`;
}

/** 目標提醒用語（依形象區分） */
const REMINDER_TEMPLATES: Record<CoachType, Record<CoachGender, Record<string, string>>> = {
  family: {
    male: {
      week: '提醒你：目標「{title}」一週後（{date}）截止，記得完成並上傳證明喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，別忘了上傳證明，家人會以你為榮！',
      today: '今天就是目標「{title}」的截止日！快去上傳證明，避免被扣款喔。',
    },
    female: {
      week: '提醒你：目標「{title}」一週後（{date}）截止，記得完成並上傳證明。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明喔。',
      today: '今天目標「{title}」就截止了！快去上傳證明吧。',
    },
  },
  friend: {
    male: {
      week: '嘿！目標「{title}」一週後（{date}）截止，別拖到最後一天喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明，完成就能拿回押金！',
      today: '今天目標「{title}」就截止了！快去上傳證明，不然會被扣款喔。',
    },
    female: {
      week: '提醒你～目標「{title}」一週後（{date}）截止，記得完成喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，快去上傳證明拿回押金吧！',
      today: '今天目標「{title}」截止日！別忘了上傳證明喔。',
    },
  },
  lover: {
    male: {
      week: '目標「{title}」一週後（{date}）截止，完成的話我會很開心喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明，完成我會更喜歡你～',
      today: '今天目標「{title}」就截止了！快去上傳證明，不然會被扣款喔。',
    },
    female: {
      week: '目標「{title}」一週後（{date}）截止，完成的話我會很開心喔。',
      threeDays: '目標「{title}」三天後（{date}）截止，記得去上傳證明喔～',
      today: '今天目標「{title}」截止日！快去上傳證明吧。',
    },
  },
};

type GoalForReminder = { id: string; title: string; dueAt: Date };

/**
 * 依目標截止日產生 Coach 提醒訊息（一週前、三天前、當日）
 * 當日 = 今天截止；三天前 = 3 天後截止；一週前 = 7 天後截止
 */
export function getCoachReminders(
  goals: GoalForReminder[],
  coachType: CoachType,
  coachGender: CoachGender
): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const t = REMINDER_TEMPLATES[coachType][coachGender];
  const reminders: string[] = [];

  for (const g of goals) {
    const due = new Date(g.dueAt);
    due.setHours(0, 0, 0, 0);
    const dateStr = due.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });

    const daysUntil = Math.round((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (daysUntil === 0) {
      reminders.push(t.today.replace('{title}', g.title).replace('{date}', dateStr));
    } else if (daysUntil === 3) {
      reminders.push(t.threeDays.replace('{title}', g.title).replace('{date}', dateStr));
    } else if (daysUntil === 7) {
      reminders.push(t.week.replace('{title}', g.title).replace('{date}', dateStr));
    }
  }

  return reminders;
}
