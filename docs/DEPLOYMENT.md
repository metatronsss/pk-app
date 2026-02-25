# PK App 部署與 Capacitor 上架指南

## 平台建議：Vercel

| 平台 | 優點 | 適合情境 |
|------|------|----------|
| **Vercel** ⭐ | Next.js 原生、零設定、免費額度大 | **首選** |
| Railway | 全端一鍵、內建 DB | 想少管設定 |
| AWS / GCP | 企業級 | 已有雲端經驗 |

---

# 第一步：部署到 Vercel

## 1.1 建立 Neon 資料庫（免費）

1. 到 [neon.tech](https://neon.tech) 註冊
2. **New Project** → 取名 `pk-app`
3. 複製 **Connection string**（格式：`postgresql://user:pass@host/db?sslmode=require`）

## 1.2 設定環境變數

在專案根目錄建立 `.env`（或複製 `.env.example`），填入：

```
DATABASE_URL=postgresql://...（Neon 的連線字串）
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的隨機32字元以上字串
```

## 1.3 初始化資料庫（本地執行一次）

```bash
cd pk-app
npm install --legacy-peer-deps
npx prisma db push
npx prisma db seed
```

## 1.4 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# 在 github.com 建立新 repo，然後：
git remote add origin https://github.com/你的帳號/pk-app.git
git push -u origin main
```

## 1.5 部署到 Vercel

1. 到 [vercel.com](https://vercel.com) 登入（可用 GitHub 登入）
2. **Add New** → **Project** → 選擇你的 `pk-app` repo
3. **Environment Variables** 加入：

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Neon 的 connection string |
   | `NEXTAUTH_URL` | `https://pk-app-xxx.vercel.app`（先留空，部署後回來填） |
   | `NEXTAUTH_SECRET` | 隨機 32 字元以上 |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_xxx 或 pk_live_xxx |
   | `STRIPE_SECRET_KEY` | sk_test_xxx 或 sk_live_xxx |
   | `STRIPE_PRICE_ID` | price_xxx（選填） |

4. 點 **Deploy**
5. 部署完成後，複製網址（如 `https://pk-app-abc123.vercel.app`）
6. 回 Vercel → **Settings** → **Environment Variables** → 把 `NEXTAUTH_URL` 改成你的網址

## 1.6 首次部署後：初始化遠端資料庫

```bash
# 確保 DATABASE_URL 指向 Neon（與 Vercel 相同）
npx prisma db push
npx prisma db seed
```

---

# 第二步：安裝 Capacitor

## 2.1 安裝套件

```bash
cd pk-app
npm install @capacitor/core @capacitor/cli @capacitor/ios --legacy-peer-deps
```

## 2.2 設定 Web App URL

編輯 `capacitor.config.json`，把 `server.url` 改成你的 Vercel 網址：

```json
"server": {
  "url": "https://pk-app-abc123.vercel.app",
  "cleartext": true
}
```

## 2.3 加入 iOS 平台

```bash
npx cap add ios
```

## 2.4 在 Xcode 開啟

```bash
npm run cap:ios
# 或
npx cap open ios
```

在 Xcode 中：
- 選 **Signing & Capabilities** → 選你的 Apple ID
- 用模擬器或實機執行測試

---

# 第三步：App Store 上架（之後）

1. 加入 [Apple Developer Program](https://developer.apple.com/programs/)（$99/年）
2. [App Store Connect](https://appstoreconnect.apple.com) 建立新 App
3. 填寫說明、截圖、隱私政策
4. Xcode → Product → Archive → Distribute App
5. 提交審核

---

# 常見問題

**Q: 本地開發時 DATABASE_URL 怎麼設？**  
A: 用同一個 Neon 專案，或再建一個 Neon 專案給 dev 用。

**Q: 想用 SQLite 本地開發？**  
A: 已改為 PostgreSQL。若需要 SQLite，可參考 `prisma/schema.sqlite.prisma.backup` 還原。

**Q: Capacitor 要打包靜態檔嗎？**  
A: 不用。`server.url` 會讓 App 直接載入你的 Vercel 網址，等同 WebView 包裝。
