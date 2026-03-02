# PK yourself — Procrastination Killer MVP

不夠痛你就不會用。押金 + Refund + AI Coach。

## 功能摘要

- **目標設定**：每月 1～3 個目標，主題、描述、截止時間、處罰金額（USD $5～$100）
- **完成證明**：上傳連結或圖片/影片/檔案，MVP 上傳即視為通過
- **處罰與退款**：逾期未上傳即「處罰」（模擬扣款寫入 balance）；完成可 100% Refund
- **Coach**：規則型對話、依形象問候，積分與好感度（之後可接 OpenAI）

## 技術棧

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite（開發），可換 PostgreSQL
- 認證：MVP 使用固定 mock 用戶（`mock-user-1`），正式版可接 NextAuth / Clerk

## 快速開始

```bash
cd pk-app
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

**登入需要 NextAuth 設定**：在專案根目錄建立 `.env`，加入：

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=任意至少32字元的隨機字串
```

（開發時若未設定，會使用預設 dev secret；正式環境務必自訂 NEXTAUTH_SECRET）

瀏覽 [http://localhost:3000](http://localhost:3000)，可先註冊帳號，再登入進入 Dashboard。

## Stripe 金流（可選）

1. 到 [Stripe Dashboard](https://dashboard.stripe.com) 註冊，切換到 **測試模式**
2. 複製 `.env.example` 為 `.env`，填入：

   | 變數 | 說明 |
   |------|------|
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_ 開頭，[API Keys](https://dashboard.stripe.com/test/apikeys) |
   | `STRIPE_SECRET_KEY` | sk_test_ 開頭，[API Keys](https://dashboard.stripe.com/test/apikeys) |
   | `STRIPE_PRICE_ID` | 訂閱用，見下方 |

3. **訂閱價格**：Stripe Dashboard → Products → Add product → 名稱「PK Pro」→ Add price → $10 USD、Monthly → 複製 Price ID（price_xxx）到 `STRIPE_PRICE_ID`
4. 重啟 `npm run dev`
5. 到「付款方式」綁定信用卡（測試卡號：`4242 4242 4242 4242`）
6. 到「訂閱方案」可升級 $10/月
7. 設定目標時會預授權；逾期未完成會實際扣款；補完成可申請退款

**注意**：測試模式不會扣真實金額，請用 Stripe 提供的測試卡號。

## 逾期處罰（on-demand）

逾期未上傳證明的目標會在使用者「進入任一頁面」或「上傳證明」時，於背景執行 penalize，標記為 FAILED 並扣款。不需定時 cron。

手動觸發（可選）：`POST /api/cron/penalize`。若有設定 `CRON_SECRET`，需帶 `Authorization: Bearer CRON_SECRET`。

## Coach 提醒

若目標將在「一週後」「三天後」或「當日」截止，上方導覽列 Coach 連結會顯示 **!** 徽章，提示使用者點擊查看 Coach 的提醒訊息。

## 專案結構

- `docs/`：PRD、技術架構（上一層 `../docs`）
- `src/app/`：首頁、Dashboard、目標 CRUD、證明上傳、Coach
- `src/app/api/`：goals、proofs、refund、coach/talk、cron/penalize
- `prisma/`：Schema、seed

## 後續擴充

- 真實金流（Stripe 預授權 + Capture）
- 證明審核（人工或 AI）
- AI Coach（OpenAI API）
- 訂閱與免費/付費 Refund 規則完整實作

