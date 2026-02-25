import type { CoachType, CoachGender } from './coach-dialogue';

type ReplySet = Record<CoachType, Record<CoachGender, string[]>>;

const KEYWORD_REPLIES: Record<string, ReplySet> = {
  完成: {
    family: {
      male: ['太棒了！記得去上傳證明，家人會以你為榮。', '做得好！快去上傳證明把錢拿回來。'],
      female: ['太好了！記得去上傳證明喔。', '完成目標就能領回押金，加油！'],
    },
    friend: {
      male: ['太棒了！記得去上傳證明，就能 100% 拿回押金。', '做得好！快去上傳證明吧。'],
      female: ['太厲害了！記得去上傳證明喔。', '完成目標就能拿回押金，別忘了上傳證明。'],
    },
    lover: {
      male: ['太棒了！快去上傳證明，完成的話我會很開心喔。', '做得好！記得去上傳證明。'],
      female: ['你超棒的！快去上傳證明，完成的話我會更喜歡你喔。', '太厲害了！記得去上傳證明。'],
    },
  },
  證明: {
    family: { male: ['到目標詳情頁點「上傳證明」，可以貼連結或上傳檔案。'], female: ['到目標詳情頁點「上傳證明」就可以上傳囉。'] },
    friend: { male: ['到目標詳情頁點「上傳證明」，可以貼連結或上傳圖片/檔案。'], female: ['到目標詳情頁點「上傳證明」就可以上傳了。'] },
    lover: { male: ['到目標詳情頁點「上傳證明」就可以上傳囉，完成的話我會很開心。'], female: ['到目標詳情頁點「上傳證明」就可以上傳了喔。'] },
  },
  目標: {
    family: { male: ['在「目標」頁可以新增或查看本月目標，記得設定處罰金額。'], female: ['在「目標」頁可以新增目標喔。'] },
    friend: { male: ['在「目標」頁可以新增或查看本月目標，記得設定處罰金額才有動力。'], female: ['在「目標」頁可以新增目標，設定處罰金額會更有動力喔。'] },
    lover: { male: ['在「目標」頁可以新增目標，完成的話我會很開心喔。'], female: ['在「目標」頁可以新增目標，我會陪著你一起完成。'] },
  },
  教練: {
    family: { male: ['我會一直陪著你，完成目標好感度會上升喔。'], female: ['我會支持你的，完成目標好感度會上升。'] },
    friend: { male: ['我會一直陪著你，完成目標好感度會上升喔！'], female: ['我會陪著你的，完成目標好感度會上升喔。'] },
    lover: { male: ['我會一直陪著你，完成目標的話我會更喜歡你喔。'], female: ['我會一直支持你，完成目標好感度會上升喔。'] },
  },
  退款: {
    family: { male: ['完成目標後即可領回 100% 金額；補完成也可申請退款。'], female: ['完成目標就能領回押金，補完成也可申請退款喔。'] },
    friend: { male: ['完成目標後即可領回 100% 金額；未完成的目標補完成也可申請退款（免費用戶僅限上個月）。'], female: ['完成目標就能領回押金，補完成也可申請退款喔。'] },
    lover: { male: ['完成目標就能領回押金，補完成也可申請退款喔。'], female: ['完成目標就能領回押金，補完成也可申請退款。'] },
  },
  拖延: {
    family: { male: ['沒關係，下次在截止前上傳證明就不會被扣款。'], female: ['沒關係，補完成還能申請退款喔。'] },
    friend: { male: ['沒關係，下次在截止前上傳證明就不會被扣款。補完成還能申請退款喔。'], female: ['沒關係，補完成還能申請退款喔。'] },
    lover: { male: ['沒關係，下次記得在截止前上傳證明喔。'], female: ['沒關係，補完成還能申請退款喔。'] },
  },
};

const DEFAULT_REPLIES: ReplySet = {
  family: {
    male: ['今天也要好好完成目標喔。', '完成目標就能把錢拿回來，加油。', '記得在截止前上傳證明。'],
    female: ['加油，你可以的！', '完成目標就能領回押金喔。', '每天進步一點點就很棒了。'],
  },
  friend: {
    male: ['加油，你可以的！', '完成目標就能 100% 拿回押金，別放棄。', '需要我提醒你截止時間嗎？'],
    female: ['加油喔！', '完成目標就能拿回押金，別放棄。', '每天進步一點點就很棒了。'],
  },
  lover: {
    male: ['加油～我會陪著你。', '完成目標就能拿回押金，我會支持你的。', '記得在截止前上傳證明喔。'],
    female: ['加油，我會一直支持你。', '完成目標就能拿回押金喔。', '每天進步一點點就很棒了。'],
  },
};

export function getKeywordReply(
  keyword: string,
  coachType: CoachType,
  coachGender: CoachGender
): string | null {
  const set = KEYWORD_REPLIES[keyword];
  if (!set) return null;
  const arr = set[coachType]?.[coachGender];
  if (!arr?.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getDefaultReply(coachType: CoachType, coachGender: CoachGender): string {
  const arr = DEFAULT_REPLIES[coachType]?.[coachGender] ?? DEFAULT_REPLIES.friend.male;
  return arr[Math.floor(Math.random() * arr.length)];
}
