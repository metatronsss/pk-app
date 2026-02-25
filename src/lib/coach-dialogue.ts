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
