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
  'auth.userNotFound': { zh: '用戶不存在', en: 'User not found', ja: 'ユーザーが見つかりません' },

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
  'goals.createWarning': { zh: '目標儲存後，截止日期與處罰金額無法調整，請確認後再送出。', en: 'After saving, due date and penalty cannot be changed. Please confirm before submitting.', ja: '保存後、期限・罰金は変更不可。確認してから送信してください。' },
  'goals.submit': { zh: '建立目標', en: 'Create Goal', ja: '目標を作成' },
  'goals.submitting': { zh: '送出中…', en: 'Submitting…', ja: '送信中…' },
  'goals.uploadProof': { zh: '上傳證明', en: 'Upload Proof', ja: '証明をアップロード' },
  'goals.uploadProofRefund': { zh: '上傳證明並申請退款', en: 'Upload proof & refund', ja: '証明をアップロードして返金' },
  'goals.editThemeDescBtn': { zh: '編輯主題與描述', en: 'Edit title & description', ja: 'タイトル・説明を編集' },
  'goals.goalEnded': { zh: '此目標已結束，無法上傳證明。', en: 'This goal has ended. Cannot upload proof.', ja: 'この目標は終了済み。証明アップロード不可。' },
  'goals.deadline': { zh: '截止', en: 'Due', ja: '期限' },
  'goals.storageNote': { zh: '儲存後日期與處罰金額無法調整', en: 'Date and penalty cannot be changed after save', ja: '保存後は期限・罰金を変更できません' },
  'goals.dueLabel': { zh: '截止', en: 'Due', ja: '期限' },
  'goals.viewProof': { zh: '查看證明', en: 'View proof', ja: '証明を見る' },
  'goals.proofUploaded': { zh: '已上傳證明', en: 'Proof uploaded', ja: '証明アップロード済み' },
  'goals.proofType': { zh: '類型', en: 'Type', ja: 'タイプ' },
  'goals.proofStatus': { zh: '證明狀態', en: 'Proof status', ja: '証明状態' },
  'goals.status': { zh: '狀態', en: 'Status', ja: '状態' },
  'goals.statusRefundPending60': { zh: '待退款（60 天後）', en: 'Refund Pending (60 days)', ja: '返金待ち（60日後）' },
  'goals.paymentPrompt': { zh: '請先綁定信用卡', en: 'Bind card first', ja: 'カードを登録してください' },
  'goals.goToPayment': { zh: '前往綁定信用卡', en: 'Go to Payment', ja: '支払いへ' },
  'goals.uploadProofTitle': { zh: '上傳完成證明', en: 'Upload Proof', ja: '証明をアップロード' },
  'goals.proofAlreadyUploaded': { zh: '已上傳過證明，無需重複上傳。', en: 'Proof already uploaded.', ja: '証明は既にアップロード済みです。' },
  'goals.placeholderTitle': { zh: '例：每週運動 3 次', en: 'e.g. Exercise 3x/week', ja: '例：週3回運動' },
  'goals.placeholderDesc': { zh: '例：健身房或跑步，每次至少 30 分鐘，上傳運動紀錄截圖', en: 'e.g. Gym or run, 30min each, upload screenshot', ja: '例：ジムorランニング、30分以上、スクショをアップロード' },
  'goals.submitCreate': { zh: '建立目標', en: 'Create Goal', ja: '目標を作成' },
  'goals.cancel': { zh: '取消', en: 'Cancel', ja: 'キャンセル' },
  'goals.penaltyRange': { zh: '處罰金額（USD $5～$100）', en: 'Penalty (USD $5–$100)', ja: '罰金（$5～$100）' },
  'goals.save': { zh: '儲存', en: 'Save', ja: '保存' },
  'goals.proofTypeLabel': { zh: '證明類型', en: 'Proof type', ja: '証明タイプ' },
  'goals.proofTypeLink': { zh: '連結（社群貼文、雲端連結等）', en: 'Link (social, cloud, etc.)', ja: 'リンク（SNS、クラウド等）' },
  'goals.proofTypeImage': { zh: '圖片', en: 'Image', ja: '画像' },
  'goals.proofTypeVideo': { zh: '影片', en: 'Video', ja: '動画' },
  'goals.proofTypeFile': { zh: '檔案', en: 'File', ja: 'ファイル' },
  'goals.proofLink': { zh: '證明連結', en: 'Proof link', ja: '証明リンク' },
  'goals.selectFile': { zh: '選擇檔案', en: 'Select file', ja: 'ファイルを選択' },
  'goals.clearFile': { zh: '清除', en: 'Clear', ja: '解除' },
  'goals.submitProof': { zh: '送出證明', en: 'Submit proof', ja: '証明を送信' },
  'goals.uploadTooLarge': { zh: '檔案過大，請壓縮後再上傳或改用「連結」上傳。', en: 'File too large. Please compress or use link upload.', ja: 'ファイルが大きすぎます。圧縮するかリンクでアップロードしてください。' },
  'goals.uploadImageTooLarge': { zh: '圖片超過 4MB，請壓縮或改用較小的圖片、連結上傳。', en: 'Image over 4MB. Please compress, use smaller image, or link upload.', ja: '画像が4MB超です。圧縮するか小さな画像・リンクでアップロードしてください。' },
  'goals.fileSizeHint': { zh: '圖片會自動壓縮；影片/檔案建議 1MB 以下', en: 'Images auto-compress; video/file under 1MB recommended', ja: '画像は自動圧縮。動画・ファイルは1MB以下を推奨' },
  'goals.pleaseSelectFile': { zh: '請選擇檔案', en: 'Please select a file', ja: 'ファイルを選択してください' },
  'goals.pleaseEnterLink': { zh: '請填寫連結', en: 'Please enter the link', ja: 'リンクを入力してください' },
  'goals.uploadFailed': { zh: '上傳失敗', en: 'Upload failed', ja: 'アップロードに失敗しました' },
  'goals.createFailed': { zh: '新增失敗', en: 'Create failed', ja: '作成に失敗しました' },
  'goals.updateFailed': { zh: '更新失敗', en: 'Update failed', ja: '更新に失敗しました' },
  'goals.refundFailed': { zh: '申請失敗', en: 'Refund request failed', ja: '返金申請に失敗しました' },
  'goals.refundProcessing': { zh: '處理中…', en: 'Processing…', ja: '処理中…' },
  'goals.refundButton': { zh: '補完成並申請退款', en: 'Complete & request refund', ja: '達成済みにして返金申請' },
  'goals.goalNotFound': { zh: '目標不存在', en: 'Goal not found', ja: '目標が見つかりません' },
  'goals.goalEndedShort': { zh: '目標已結束', en: 'Goal has ended', ja: '目標は終了済み' },
  'goals.missingGoalIdOrUrl': { zh: '缺少 goalId 或 url', en: 'Missing goal ID or URL', ja: '目標IDまたはURLが必要です' },
  'goals.missingFormFields': { zh: '缺少 goalId / type / file', en: 'Missing goal ID, type or file', ja: '目標ID・タイプ・ファイルが必要です' },
  'goals.insufficientBalance': { zh: '餘額不足，無法退款', en: 'Insufficient balance for refund', ja: '残高不足で返金できません' },
  'goals.stripeRefundFailed': { zh: 'Stripe 退款失敗', en: 'Stripe refund failed', ja: 'Stripe返金に失敗しました' },
  'goals.errTitleRequired': { zh: '請填寫主題', en: 'Please enter title', ja: 'タイトルを入力してください' },
  'goals.errDescRequired': { zh: '請填寫具體描述', en: 'Please enter description', ja: '説明を入力してください' },
  'goals.errDueRequired': { zh: '請選擇截止時間', en: 'Please select due date', ja: '期限を選択してください' },
  'goals.errDuePast': { zh: '截止時間不能早於現在', en: 'Due date must be in the future', ja: '期限は未来の日時を選択してください' },
  'goals.errPenaltyMin': { zh: '至少 $5', en: 'Minimum $5', ja: '最低$5' },
  'goals.errPenaltyMax': { zh: '最多 $100', en: 'Maximum $100', ja: '最大$100' },
  'goals.refundOnlyFailed': { zh: '僅未完成目標可申請退款', en: 'Only failed goals can request refund', ja: '未達成目標のみ返金申請可' },
  'goals.uploadProofFirst': { zh: '請先上傳證明後再申請退款', en: 'Upload proof first, then request refund', ja: '証明をアップロードしてから返金申請してください' },
  'goals.freeRefundLimit': { zh: '免費用戶僅能退上個月遞延目標的款', en: 'Free users can only refund last month\'s deferred goals', ja: '無料会員は先月分のみ返金可' },
  'goals.preAuthFailed': { zh: '預授權失敗', en: 'Pre-auth failed', ja: '事前承認に失敗しました' },

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
  'coach.type': { zh: '類型', en: 'Type', ja: 'タイプ' },
  'coach.gender': { zh: '性別', en: 'Gender', ja: '性別' },
  'coach.typeFamily': { zh: '家人', en: 'Family', ja: '家族' },
  'coach.typeFriend': { zh: '朋友', en: 'Friend', ja: '友達' },
  'coach.typeLover': { zh: '情人', en: 'Lover', ja: '恋人' },
  'coach.genderMale': { zh: '男', en: 'Male', ja: '男' },
  'coach.genderFemale': { zh: '女', en: 'Female', ja: '女' },
  'coach.saveSettings': { zh: '儲存設定', en: 'Save Settings', ja: '設定を保存' },
  'coach.chatPlaceholder': { zh: '輸入訊息…', en: 'Type a message…', ja: 'メッセージを入力…' },
  'coach.chatSend': { zh: '送出', en: 'Send', ja: '送信' },
  'coach.chatFallback': { zh: '加油，你可以的！', en: 'You can do it!', ja: '頑張ろう！' },

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
  'shop.locked': { zh: '未解鎖', en: 'Locked', ja: '未解鎖' },
  'shop.itemGloves': { zh: '手套', en: 'Gloves', ja: '手袋' },
  'shop.itemScarf': { zh: '圍巾', en: 'Scarf', ja: 'マフラー' },
  'shop.itemWhip': { zh: '皮鞭', en: 'Whip', ja: '鞭' },
  'shop.itemHat': { zh: '帽子', en: 'Hat', ja: '帽子' },
  'shop.itemProtractor': { zh: '量角器', en: 'Protractor', ja: '分度器' },

  // Payment
  'payment.title': { zh: '付款方式', en: 'Payment', ja: '支払い' },
  'payment.backDashboard': { zh: '← 回 Dashboard', en: '← Back to Dashboard', ja: '← Dashboardへ' },
  'payment.bindCard': { zh: '綁定信用卡後，設定目標時會預授權處罰金額；未完成才會實際扣款，完成則釋放預授權。', en: 'Binding a card enables penalty pre-auth. Charge only on failure; release on completion.', ja: 'カード登録で罰金の事前承認。未達成時のみ課金、達成で解除。' },
  'payment.stripeKeys': { zh: '到 Stripe Dashboard → API Keys 複製測試金鑰。', en: 'Copy test keys from Stripe Dashboard → API Keys.', ja: 'Stripe Dashboard → API Keys でテストキーをコピー。' },
  'payment.cardNote': { zh: '設定目標時將使用此卡進行預授權。', en: 'This card will be used for goal pre-auth.', ja: 'このカードで目標の事前承認を行います。' },
  'payment.stripeNotSet': { zh: 'Stripe 未設定', en: 'Stripe not configured', ja: 'Stripe未設定' },
  'payment.addToEnv': { zh: '請在 .env 加入：', en: 'Add to .env:', ja: '.env に追加：' },
  'payment.cardBound': { zh: '已綁定信用卡', en: 'Card bound', ja: 'カード登録済み' },
  'payment.subscriptionNeedsStripe': { zh: '訂閱方案也需要 Stripe', en: 'Subscription also needs Stripe', ja: 'サブスクも Stripe 必要' },

  // Subscription
  'subscription.backDashboard': { zh: '← 回 Dashboard', en: '← Back to Dashboard', ja: '← Dashboardへ' },
  'subscription.freeDesc': { zh: '每月 1～3 個目標', en: '1–3 goals/month', ja: '月1～3目標' },
  'subscription.freeRefund': { zh: '僅能退「上個月」遞延目標的款', en: 'Refund last month\'s deferred only', ja: '先月分のみ返金可' },
  'subscription.freeCoach': { zh: 'AI Coach 基本功能', en: 'AI Coach basic', ja: 'AI Coach基本' },
  'subscription.proRefund': { zh: '可退「所有過往」遞延目標的款', en: 'Refund all past deferred', ja: '過去全て返金可' },
  'subscription.pleaseLogin': { zh: '請先登入。', en: 'Please log in first.', ja: 'ログインしてください。' },
  'subscription.success': { zh: '訂閱成功！您已是訂閱會員。', en: 'Subscribed! You are now a Pro member.', ja: '購読完了！Pro会員になりました。' },
  'subscription.plans': { zh: '訂閱方案', en: 'Subscription Plans', ja: 'サブスクリプション' },
  'subscription.free': { zh: '免費', en: 'Free', ja: '無料' },
  'subscription.pro': { zh: '訂閱會員', en: 'Pro', ja: 'Pro' },
  'subscription.perMonth': { zh: '/ 月', en: '/ month', ja: '/月' },
  'subscription.freeFeature1': { zh: '每月 1～3 個目標', en: '1–3 goals per month', ja: '月1～3目標' },
  'subscription.freeFeature2': { zh: '處罰押金機制', en: 'Penalty deposit', ja: '罰金保証金' },
  'subscription.freeFeature3': { zh: '完成可 100% Refund', en: '100% refund on completion', ja: '達成で100%返金' },
  'subscription.freeFeature4': { zh: '僅能退「上個月」遞延目標的款', en: 'Refund last month\'s deferred only', ja: '先月分のみ返金可' },
  'subscription.freeFeature5': { zh: 'AI Coach 基本功能', en: 'AI Coach basic', ja: 'AI Coach基本' },
  'subscription.proFeature1': { zh: '免費方案全部功能', en: 'All Free features', ja: '無料プラン全機能' },
  'subscription.proFeature2': { zh: '可退「所有過往」遞延目標的款', en: 'Refund all past deferred', ja: '過去全て返金可' },
  'subscription.proFeature3': { zh: '解鎖完整 Refund 歷史', en: 'Full refund history', ja: '返金履歴すべて' },
  'subscription.proFeature4': { zh: '優先支援', en: 'Priority support', ja: '優先サポート' },
  'subscription.currentPlan': { zh: '目前方案', en: 'Current plan', ja: '現在のプラン' },
  'subscription.stripeNote': { zh: 'Stripe 設定說明', en: 'Stripe setup', ja: 'Stripe設定' },
  'subscription.stripeEnv': { zh: '若「升級訂閱」按鈕無法使用，請在 .env 加入：', en: 'If upgrade button doesn\'t work, add to .env:', ja: 'アップグレードボタンが使えない場合、.env に追加：' },
  'subscription.stripeHint': { zh: '到 Stripe Dashboard → Products → 新增 Product「PK Pro」→ 新增 Price $10/月 → 複製 Price ID（price_xxx）到 STRIPE_PRICE_ID。', en: 'Stripe Dashboard → Products → Add product "PK Pro" → Add price $10/month → Copy Price ID to STRIPE_PRICE_ID.', ja: 'Stripe Dashboard → Products → 商品追加「PK Pro」→ $10/月の価格追加 → Price ID を STRIPE_PRICE_ID に設定。' },

  // User / Nav
  'user.freeMember': { zh: '免費', en: 'Free', ja: '無料' },
  'user.proMember': { zh: '訂閱會員', en: 'Pro', ja: 'Pro' },
  'user.logout': { zh: '登出', en: 'Logout', ja: 'ログアウト' },
  'user.hi': { zh: 'Hi', en: 'Hi', ja: 'こんにちは' },

  // Subscription upgrade
  'subscription.upgradeBtn': { zh: '升級訂閱 $10/月', en: 'Upgrade $10/mo', ja: 'アップグレード $10/月' },
  'subscription.processing': { zh: '處理中…', en: 'Processing…', ja: '処理中…' },
  'subscription.errorCheckout': { zh: '無法建立結帳連結', en: 'Cannot create checkout link', ja: 'チェックアウトリンクを作成できません' },
  'subscription.errorNoUrl': { zh: '未取得結帳連結', en: 'No checkout URL', ja: 'URLを取得できませんでした' },
  'subscription.errorNetwork': { zh: '連線失敗', en: 'Connection failed', ja: '接続に失敗しました' },
  'subscription.loadError': { zh: '載入發生錯誤', en: 'Loading error', ja: '読み込みエラー' },
  'subscription.loadErrorDetail': { zh: '請稍後再試或返回首頁。', en: 'Please try again later or return to the dashboard.', ja: 'しばらくしてからお試しいただくか、ダッシュボードへお戻りください。' },
  'common.retry': { zh: '重試', en: 'Retry', ja: '再試行' },

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

/** 道具 base 名稱 → i18n key */
export const ITEM_NAME_KEYS: Record<string, string> = {
  手套: 'shop.itemGloves',
  圍巾: 'shop.itemScarf',
  皮鞭: 'shop.itemWhip',
  帽子: 'shop.itemHat',
  量角器: 'shop.itemProtractor',
};

export function getItemDisplayName(name: string, locale: Locale): string {
  const base = name.split(' ')[0] || name;
  const suffix = name.split(' ').slice(1).join(' ');
  const key = ITEM_NAME_KEYS[base];
  return key ? t(key, locale) + (suffix ? ' ' + suffix : '') : name;
}

/** 依 API 回傳的中文訊息對應到 i18n key */
const API_MSG_MAP: Record<string, string> = {
  '請先登入': 'auth.pleaseLogin',
  '目標不存在': 'goals.goalNotFound',
  '目標已結束': 'goals.goalEndedShort',
  '已上傳過證明': 'goals.proofAlreadyUploaded',
  '缺少 goalId 或 url': 'goals.missingGoalIdOrUrl',
  '缺少 goalId / type / file': 'goals.missingFormFields',
  '用戶不存在': 'auth.userNotFound',
  '餘額不足，無法退款': 'goals.insufficientBalance',
  'Stripe 退款失敗': 'goals.stripeRefundFailed',
  '請先綁定信用卡才能建立目標': 'goals.bindCardFirst',
  '本月已達 3 個目標上限': 'goals.monthLimit',
  '截止時間不能早於現在': 'goals.errDuePast',
  '僅進行中的目標可編輯': 'goals.onlyActiveEditable',
  '僅未完成目標可申請退款': 'goals.refundOnlyFailed',
  '請先上傳證明後再申請退款': 'goals.uploadProofFirst',
  '免費用戶僅能退上個月遞延目標的款': 'goals.freeRefundLimit',
  '預授權失敗': 'goals.preAuthFailed',
  '申請失敗': 'goals.refundFailed',
};

export function mapApiErrorToMessage(msg: string, locale: Locale): string {
  const key = API_MSG_MAP[msg];
  return key ? t(key, locale) : msg;
}

export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  let str = messages[key]?.[locale] ?? messages[key]?.['zh'] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}
