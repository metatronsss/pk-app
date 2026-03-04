export type Locale = 'zh' | 'en' | 'ja';

export const LOCALES: Locale[] = ['zh', 'en', 'ja'];

export const LOCALE_NAMES: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
};

/** 從 Accept-Language 或預設推斷 */
export function getLocaleFromHeader(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return 'zh';
  const parts = acceptLanguage.split(',').map((s) => s.split(';')[0].trim().toLowerCase());
  for (const p of parts) {
    if (p.startsWith('zh')) return 'zh';
    if (p.startsWith('ja')) return 'ja';
    if (p.startsWith('en')) return 'en';
  }
  return 'zh';
}

type Messages = Record<string, Record<Locale, string>>;

export const messages: Messages = {
  // Nav
  'nav.dashboard': { zh: 'Dashboard', en: 'Dashboard', ja: 'ダッシュボード' },
  'nav.goals': { zh: '目標', en: 'Goals', ja: '目標' },
  'nav.coach': { zh: 'Coach', en: 'Coach', ja: 'Coach' },
  'nav.shop': { zh: '商城', en: 'Shop', ja: 'ショップ' },
  'nav.payment': { zh: '付款', en: 'Payment', ja: '支払い' },
  'nav.subscription': { zh: '訂閱', en: 'Subscription', ja: 'サブスク' },
  'nav.login': { zh: '登入', en: 'Login', ja: 'ログイン' },
  'nav.register': { zh: '註冊', en: 'Register', ja: '登録' },
  'nav.coachReminder': { zh: 'Coach 有提醒', en: 'Coach has reminders', ja: 'Coachにリマインダーあり' },

  // App
  'app.title': { zh: 'PK yourself — Procrastination Killer', en: 'PK yourself — Procrastination Killer', ja: 'PK yourself — Procrastination Killer' },
  'app.tagline': { zh: '不夠痛你就不會用。押金 + Refund + AI Coach', en: 'Not painful enough, you won\'t use it. Deposit + Refund + AI Coach', ja: '痛くないと使わない。保証金 + 返金 + AI Coach' },
  'app.taglineShort': { zh: '押金 + Refund + AI Coach — 用處罰機制逼自己完成目標，完成就能 100% 拿回。', en: 'Deposit + Refund + AI Coach — Use penalties to push yourself. Complete goals to get 100% back.', ja: '保証金 + 返金 + AI Coach — 罰則で自分を追い込み、達成で100%返金。' },

  // Auth
  'auth.pleaseLogin': { zh: '請先登入。', en: 'Please log in first.', ja: 'ログインしてください。' },
  'auth.login': { zh: '登入', en: 'Login', ja: 'ログイン' },
  'auth.register': { zh: '註冊', en: 'Register', ja: '登録' },
  'auth.loggingIn': { zh: '登入中…', en: 'Logging in…', ja: 'ログイン中…' },
  'auth.registering': { zh: '註冊中…', en: 'Registering…', ja: '登録中…' },
  'auth.loginFailed': { zh: '登入失敗，請稍後再試', en: 'Login failed. Please try again.', ja: 'ログインに失敗しました。' },
  'auth.registerFailed': { zh: '註冊失敗', en: 'Registration failed', ja: '登録に失敗しました' },
  'auth.emailRegistered': { zh: '此 Email 已註冊', en: 'This email is already registered', ja: 'このメールは既に登録済みです' },
  'auth.registerSuccess': { zh: '註冊成功', en: 'Registration successful', ja: '登録完了' },

  // Dashboard
  'dashboard.welcome': { zh: '歡迎回來', en: 'Welcome back', ja: 'おかえりなさい' },
  'dashboard.penalizedRefundable': { zh: '已處罰金額（可退）', en: 'Penalized (Refundable)', ja: '処罰済み（返金可）' },
  'dashboard.getBackByComplete': { zh: '完成目標拿回 →', en: 'Complete goals to get back →', ja: '目標達成で返金 →' },
  'dashboard.points': { zh: '積分', en: 'Points', ja: 'ポイント' },
  'dashboard.shopExchange': { zh: '商城兌換道具 →', en: 'Exchange in Shop →', ja: 'ショップで交換 →' },
  'dashboard.activeGoals': { zh: '進行中目標', en: 'Active Goals', ja: '進行中目標' },
  'dashboard.manageGoals': { zh: '管理目標 →', en: 'Manage goals →', ja: '目標を管理 →' },
  'dashboard.thisMonthGoals': { zh: '本月目標', en: 'This Month\'s Goals', ja: '今月の目標' },
  'dashboard.noGoals': { zh: '尚無目標，先設定一個吧。', en: 'No goals yet. Set one up.', ja: '目標がありません。設定しましょう。' },
  'dashboard.addGoal': { zh: '新增目標', en: 'Add Goal', ja: '目標を追加' },
  'dashboard.statusActive': { zh: '進行中', en: 'Active', ja: '進行中' },
  'dashboard.statusCompleted': { zh: '已完成', en: 'Completed', ja: '完了' },
  'dashboard.statusFailed': { zh: '未完成', en: 'Failed', ja: '未達成' },
  'dashboard.statusRefundPending': { zh: '待退款', en: 'Refund Pending', ja: '返金待ち' },
  'dashboard.statusRefunded': { zh: '已退款', en: 'Refunded', ja: '返金済み' },

  // Goals
  'goals.myGoals': { zh: '我的目標', en: 'My Goals', ja: 'マイ目標' },
  'goals.addGoal': { zh: '新增目標', en: 'Add Goal', ja: '目標を追加' },
  'goals.desc': { zh: '每月可設定 1～3 個目標，未完成即扣款；完成並上傳證明可 100% 拿回。會員 1 日內退款，非會員 60 天後退款。', en: 'Set 1–3 goals per month. Fail = charge. Complete + upload proof = 100% refund. Members: 1 day. Non-members: 60 days.', ja: '月1～3目標。未達成で課金。達成+証明で100%返金。会員1日、非会員60日。' },
  'goals.noGoals': { zh: '尚無目標。', en: 'No goals yet.', ja: '目標がありません。' },
  'goals.setFirst': { zh: '設定第一個目標', en: 'Set your first goal', ja: '最初の目標を設定' },
  'goals.backToList': { zh: '← 回目標列表', en: '← Back to goals', ja: '← 目標一覧へ' },
  'goals.backToDetail': { zh: '回目標詳情', en: 'Back to detail', ja: '詳細へ戻る' },
  'goals.editGoal': { zh: '編輯目標', en: 'Edit Goal', ja: '目標を編集' },
  'goals.editThemeDesc': { zh: '僅可修改目標主題與具體描述，截止日期與處罰金額無法變更。', en: 'Only title and description can be edited. Due date and penalty cannot be changed.', ja: 'タイトルと説明のみ編集可。期限・罰金は変更不可。' },
  'goals.onlyActiveEditable': { zh: '僅進行中的目標可編輯主題與描述。', en: 'Only active goals can be edited.', ja: '進行中目標のみ編集可。' },
  'goals.newGoal': { zh: '新增目標', en: 'New Goal', ja: '新規目標' },
  'goals.bindCardFirst': { zh: '建立目標需預授權處罰金額，請先至付款方式綁定信用卡。', en: 'Goals require penalty pre-auth. Please bind a card in Payment first.', ja: '目標には罰金の事前承認が必要。支払いでカードを登録してください。' },
  'goals.monthLimit': { zh: '本月已達 3 個目標上限，請下月再新增。', en: 'Monthly limit of 3 goals reached. Add more next month.', ja: '今月の目標上限（3件）に達しました。' },
  'goals.goalTitle': { zh: '目標主題', en: 'Goal Title', ja: '目標タイトル' },
  'goals.description': { zh: '具體描述', en: 'Description', ja: '説明' },
  'goals.dueDate': { zh: '截止時間', en: 'Due Date', ja: '期限' },
  'goals.penalty': { zh: '處罰金額', en: 'Penalty', ja: '罰金' },
  'goals.createWarning': { zh: '目標儲存後，截止日期與處罰金額無法調整，請確認後再送出。', en: 'After saving, due date and penalty cannot be changed.', ja: '保存後、期限・罰金は変更不可。' },
  'goals.submit': { zh: '建立目標', en: 'Create Goal', ja: '目標を作成' },
  'goals.submitting': { zh: '送出中…', en: 'Submitting…', ja: '送信中…' },
  'goals.uploadProof': { zh: '上傳證明', en: 'Upload Proof', ja: '証明をアップロード' },
  'goals.uploadProofRefund': { zh: '上傳證明並申請退款', en: 'Upload proof & refund', ja: '証明をアップロードして返金' },
  'goals.editThemeDescBtn': { zh: '編輯主題與描述', en: 'Edit title & description', ja: 'タイトル・説明を編集' },
  'goals.goalEnded': { zh: '此目標已結束，無法上傳證明。', en: 'This goal has ended. Cannot upload proof.', ja: 'この目標は終了済み。証明アップロード不可。' },
  'goals.deadline': { zh: '截止', en: 'Due', ja: '期限' },
  'goals.storageNote': { zh: '儲存後日期與處罰金額無法調整', en: 'Date and penalty cannot be changed after save', ja: '保存後は期限・罰金を変更できません' },

  // Coach
  'coach.aiCoach': { zh: 'AI Coach', en: 'AI Coach', ja: 'AI Coach' },
  'coach.settings': { zh: '教練設定', en: 'Coach Settings', ja: 'Coach設定' },
  'coach.affinity': { zh: '好感度', en: 'Affinity', ja: '好感度' },
  'coach.affinityRange': { zh: '（-100 ~ 100）', en: '(-100 ~ 100)', ja: '（-100～100）' },
  'coach.pointsDaily': { zh: '積分：{points}（每日登入 +10）', en: 'Points: {points} (daily +10)', ja: 'ポイント：{points}（毎日+10）' },
  'coach.equipItems': { zh: '商城兌換道具 →', en: 'Exchange in Shop →', ja: 'ショップで交換 →' },
  'coach.backDashboard': { zh: '回 Dashboard', en: 'Back to Dashboard', ja: 'Dashboardへ' },
  'coach.chat': { zh: '與 Coach 對話', en: 'Chat with Coach', ja: 'Coachと会話' },
  'coach.equipTitle': { zh: '裝備道具（最多 5 個，裝備後才有能力）', en: 'Equip items (max 5, effects apply when equipped)', ja: '装備（最大5個、装備で効果発動）' },
  'coach.equipEmpty': { zh: '空', en: 'Empty', ja: '空' },
  'coach.saveEquip': { zh: '儲存裝備', en: 'Save', ja: '保存' },
  'coach.saving': { zh: '儲存中...', en: 'Saving...', ja: '保存中...' },

  // Shop
  'shop.title': { zh: '商城', en: 'Shop', ja: 'ショップ' },
  'shop.points': { zh: '積分', en: 'Points', ja: 'ポイント' },
  'shop.affinityUnlock': { zh: '好感度：{affinity}（解鎖更多道具）', en: 'Affinity: {affinity} (unlock more)', ja: '好感度：{affinity}（解鎖で追加）' },
  'shop.backCoach': { zh: '回 Coach', en: 'Back to Coach', ja: 'Coachへ' },
  'shop.penaltyReduce': { zh: '失敗扣 {p}%', en: 'Fail: {p}% charged', ja: '失敗時{p}%課金' },
  'shop.gracePeriod': { zh: '+{d} 天寬限期', en: '+{d} day grace', ja: '+{d}日猶予' },
  'shop.affinityBoost': { zh: '好感度 +{a}', en: 'Affinity +{a}', ja: '好感度+{a}' },
  'shop.pointsCost': { zh: '{n} 積分', en: '{n} pts', ja: '{n}pt' },
  'shop.affinityRequired': { zh: '需好感度 {n}', en: 'Affinity {n} req.', ja: '好感度{n}必要' },
  'shop.exchange': { zh: '兌換', en: 'Exchange', ja: '交換' },
  'shop.exchanging': { zh: '兌換中...', en: 'Exchanging...', ja: '交換中...' },
  'shop.affinityLocked': { zh: '好感度不足', en: 'Affinity too low', ja: '好感度不足' },
  'shop.affinityLockedTitle': { zh: '好感度不足，無法購買', en: 'Affinity too low to buy', ja: '好感度不足で購入不可' },
  'shop.owned': { zh: '已擁有', en: 'Owned', ja: '所持済み' },
  'shop.exchangeFailed': { zh: '兌換失敗', en: 'Exchange failed', ja: '交換に失敗しました' },

  // Payment
  'payment.backDashboard': { zh: '← 回 Dashboard', en: '← Back to Dashboard', ja: '← Dashboardへ' },
  'payment.bindCard': { zh: '綁定信用卡後，設定目標時會預授權處罰金額；未完成才會實際扣款，完成則釋放預授權。', en: 'Binding a card enables penalty pre-auth. Charge only on failure; release on completion.', ja: 'カード登録で罰金の事前承認。未達成時のみ課金、達成で解除。' },
  'payment.stripeKeys': { zh: '到 Stripe Dashboard → API Keys 複製測試金鑰。', en: 'Copy test keys from Stripe Dashboard → API Keys.', ja: 'Stripe Dashboard → API Keys でテストキーをコピー。' },
  'payment.cardNote': { zh: '設定目標時將使用此卡進行預授權。', en: 'This card will be used for goal pre-auth.', ja: 'このカードで目標の事前承認を行います。' },

  // Subscription
  'subscription.backDashboard': { zh: '← 回 Dashboard', en: '← Back to Dashboard', ja: '← Dashboardへ' },
  'subscription.freeDesc': { zh: '每月 1～3 個目標', en: '1–3 goals/month', ja: '月1～3目標' },
  'subscription.freeRefund': { zh: '僅能退「上個月」遞延目標的款', en: 'Refund last month\'s deferred only', ja: '先月分のみ返金可' },
  'subscription.freeCoach': { zh: 'AI Coach 基本功能', en: 'AI Coach basic', ja: 'AI Coach基本' },
  'subscription.proRefund': { zh: '可退「所有過往」遞延目標的款', en: 'Refund all past deferred', ja: '過去全て返金可' },

  // Home
  'home.headline': { zh: '不夠痛 你就不會用', en: 'Not painful enough, you won\'t use it', ja: '痛くないと使わない' },
  'home.enterDashboard': { zh: '進入 Dashboard', en: 'Enter Dashboard', ja: 'Dashboardへ' },
  'home.setGoals': { zh: '設定目標', en: 'Set Goals', ja: '目標を設定' },
  'home.login': { zh: '登入', en: 'Login', ja: 'ログイン' },
  'home.register': { zh: '註冊', en: 'Register', ja: '登録' },

  // Common
  'common.detail': { zh: '詳情', en: 'Detail', ja: '詳細' },
  'common.edit': { zh: '編輯', en: 'Edit', ja: '編集' },
};

export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  let str = messages[key]?.[locale] ?? messages[key]?.['zh'] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}
