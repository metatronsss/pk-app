import type { CoachType, CoachGender, CoachLocale } from './coach-dialogue';

type ReplySet = Record<CoachType, Record<CoachGender, string[]>>;

const KEYWORD_REPLIES_ZH: Record<string, ReplySet> = {
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

const DEFAULT_REPLIES_ZH: ReplySet = {
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

const DEFAULT_REPLIES_EN: ReplySet = {
  family: { male: ['Complete your goals today.', 'Complete goals to get your money back.', 'Upload proof before the deadline.'], female: ['You can do it!', 'Complete goals to get your deposit back.', 'Every little progress counts.'] },
  friend: { male: ['You can do it!', 'Complete goals to get 100% back. Don\'t give up.', 'Need a deadline reminder?'], female: ['You can do it!', 'Complete goals to get your deposit back.', 'Every little progress counts.'] },
  lover: { male: ['I\'ll support you.', 'Complete goals to get your deposit back.', 'Upload proof before the deadline.'], female: ['I\'ll always support you.', 'Complete goals to get your deposit back.', 'Every little progress counts.'] },
};

const DEFAULT_REPLIES_JA: ReplySet = {
  family: { male: ['今日も目標を達成しよう。', '達成したらお金が戻るよ。', '期限前に証明をアップロードして。'], female: ['頑張ろう！', '達成したら保証金が戻るよ。', '少しずつ進歩すれば大丈夫。'] },
  friend: { male: ['頑張ろう！', '達成したら100%戻る。諦めないで。', '期限のリマインド必要？'], female: ['頑張って！', '達成したら保証金が戻る。', '少しずつ進歩すれば大丈夫。'] },
  lover: { male: ['応援してる。', '達成したら保証金が戻る。', '期限前に証明をアップロードして。'], female: ['ずっと応援してる。', '達成したら保証金が戻る。', '少しずつ進歩すれば大丈夫。'] },
};

const KEYWORD_REPLIES_EN: Record<string, ReplySet> = {
  完成: { family: { male: ['Great! Upload proof. Your family is proud.', 'Well done! Upload proof to get your money back.'], female: ['Great! Upload proof.', 'Complete goals to get your deposit back.'] }, friend: { male: ['Great! Upload proof to get 100% back.', 'Well done! Go upload proof.'], female: ['Awesome! Upload proof.', 'Complete goals to get your deposit back.'] }, lover: { male: ['Great! Upload proof. I\'ll be happy.', 'Well done! Upload proof.'], female: ['Awesome! Upload proof.', 'Great! Upload proof.'] } },
  證明: { family: { male: ['Go to goal detail and click "Upload proof".'], female: ['Go to goal detail and click "Upload proof".'] }, friend: { male: ['Go to goal detail and click "Upload proof".'], female: ['Go to goal detail and click "Upload proof".'] }, lover: { male: ['Go to goal detail and click "Upload proof".'], female: ['Go to goal detail and click "Upload proof".'] } },
  目標: { family: { male: ['Add or view goals on the Goals page.'], female: ['Add goals on the Goals page.'] }, friend: { male: ['Add or view goals on the Goals page.'], female: ['Add goals on the Goals page.'] }, lover: { male: ['Add goals on the Goals page.'], female: ['Add goals on the Goals page.'] } },
  教練: { family: { male: ['I\'ll support you. Complete goals to raise affinity.'], female: ['I\'ll support you.'] }, friend: { male: ['I\'ll support you. Complete goals to raise affinity.'], female: ['I\'ll support you.'] }, lover: { male: ['I\'ll support you.'], female: ['I\'ll support you.'] } },
  退款: { family: { male: ['Complete goals to get 100% back.'], female: ['Complete goals to get your deposit back.'] }, friend: { male: ['Complete goals to get 100% back.'], female: ['Complete goals to get your deposit back.'] }, lover: { male: ['Complete goals to get your deposit back.'], female: ['Complete goals to get your deposit back.'] } },
  拖延: { family: { male: ['Upload proof before the deadline next time.'], female: ['You can still get a refund if you complete later.'] }, friend: { male: ['Upload proof before the deadline. You can get a refund for completed goals.'], female: ['You can still get a refund if you complete later.'] }, lover: { male: ['Upload proof before the deadline next time.'], female: ['You can still get a refund if you complete later.'] } },
};

const KEYWORD_REPLIES_JA: Record<string, ReplySet> = {
  完成: { family: { male: ['すごい！証明をアップロードして。', 'よくできた！証明をアップロードしてお金を取り戻そう。'], female: ['すごい！証明をアップロードして。', '達成したら保証金が戻るよ。'] }, friend: { male: ['すごい！証明をアップロードして100%戻そう。', 'よくできた！証明をアップロードして。'], female: ['すごい！証明をアップロードして。', '達成したら保証金が戻る。'] }, lover: { male: ['すごい！証明をアップロードして。', 'よくできた！証明をアップロードして。'], female: ['すごい！証明をアップロードして。', 'よくできた！証明をアップロードして。'] } },
  證明: { family: { male: ['目標詳細で「証明をアップロード」をクリック。'], female: ['目標詳細で「証明をアップロード」をクリック。'] }, friend: { male: ['目標詳細で「証明をアップロード」をクリック。'], female: ['目標詳細で「証明をアップロード」をクリック。'] }, lover: { male: ['目標詳細で「証明をアップロード」をクリック。'], female: ['目標詳細で「証明をアップロード」をクリック。'] } },
  目標: { family: { male: ['目標ページで目標を追加・確認。'], female: ['目標ページで目標を追加。'] }, friend: { male: ['目標ページで目標を追加・確認。'], female: ['目標ページで目標を追加。'] }, lover: { male: ['目標ページで目標を追加。'], female: ['目標ページで目標を追加。'] } },
  教練: { family: { male: ['応援してる。達成したら好感度アップ。'], female: ['応援してる。'] }, friend: { male: ['応援してる。達成したら好感度アップ。'], female: ['応援してる。'] }, lover: { male: ['応援してる。'], female: ['応援してる。'] } },
  退款: { family: { male: ['達成したら100%返金。'], female: ['達成したら保証金が戻る。'] }, friend: { male: ['達成したら100%返金。'], female: ['達成したら保証金が戻る。'] }, lover: { male: ['達成したら保証金が戻る。'], female: ['達成したら保証金が戻る。'] } },
  拖延: { family: { male: ['次は期限前に証明をアップロードして。'], female: ['後から達成しても返金申請できる。'] }, friend: { male: ['期限前に証明をアップロード。達成すれば返金可。'], female: ['後から達成しても返金申請できる。'] }, lover: { male: ['次は期限前に証明をアップロードして。'], female: ['後から達成しても返金申請できる。'] } },
};

const KEYWORD_REPLIES: Record<CoachLocale, Record<string, ReplySet>> = { zh: KEYWORD_REPLIES_ZH, en: KEYWORD_REPLIES_EN, ja: KEYWORD_REPLIES_JA };
const DEFAULT_REPLIES: Record<CoachLocale, ReplySet> = { zh: DEFAULT_REPLIES_ZH, en: DEFAULT_REPLIES_EN, ja: DEFAULT_REPLIES_JA };

function matchKeywordImpl(message: string, locale: CoachLocale): string | null {
  const zhKw = ['完成', '證明', '退款', '拖延', '目標', '教練'];
  const enKw = ['complete', 'proof', 'refund', 'procrastinate', 'goal', 'coach'];
  const jaKw = ['完了', '証明', '返金', '先延ばし', '目標', 'コーチ'];
  const keys = locale === 'zh' ? zhKw : locale === 'en' ? enKw : jaKw;
  const zhMap: Record<string, string> = { complete: '完成', proof: '證明', refund: '退款', procrastinate: '拖延', goal: '目標', coach: '教練' };
  const jaMap: Record<string, string> = { '完了': '完成', '証明': '證明', '返金': '退款', '先延ばし': '拖延', '目標': '目標', 'コーチ': '教練' };
  const msg = message.toLowerCase();
  for (let i = 0; i < keys.length; i++) {
    const kw = keys[i];
    if (msg.includes(kw.toLowerCase()) || message.includes(kw)) {
      return locale === 'zh' ? kw : locale === 'en' ? zhMap[kw] ?? kw : jaMap[kw] ?? kw;
    }
  }
  for (const k of zhKw) {
    if (message.includes(k)) return k;
  }
  return null;
}

export function getKeywordReply(
  keyword: string,
  coachType: CoachType,
  coachGender: CoachGender,
  locale: CoachLocale = 'zh'
): string | null {
  const replies = KEYWORD_REPLIES[locale] ?? KEYWORD_REPLIES_ZH;
  const set = replies[keyword];
  if (!set) return null;
  const arr = set[coachType]?.[coachGender];
  if (!arr?.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getDefaultReply(coachType: CoachType, coachGender: CoachGender, locale: CoachLocale = 'zh'): string {
  const replies = DEFAULT_REPLIES[locale] ?? DEFAULT_REPLIES_ZH;
  const arr = replies[coachType]?.[coachGender] ?? replies.friend.male;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getReply(message: string, coachType: CoachType, coachGender: CoachGender, locale: CoachLocale): string {
  const keyword = matchKeywordImpl(message, locale);
  if (keyword) {
    const reply = getKeywordReply(keyword, coachType, coachGender, locale);
    if (reply) return reply;
  }
  return getDefaultReply(coachType, coachGender, locale);
}
