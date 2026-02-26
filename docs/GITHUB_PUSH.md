# 推送到 GitHub 步驟

## 已完成 ✓
- [x] git init
- [x] git add & commit

## 接下來請你手動操作

### 1. 在 GitHub 建立新 Repo

1. 打開 [github.com/new](https://github.com/new)
2. **Repository name**：輸入 `pk-app`（或你喜歡的名稱）
3. **Description**：選填，例如 `Procrastination Killer - 押金 + Refund + Coach`
4. 選擇 **Public**
5. **不要**勾選 "Add a README"、"Add .gitignore"（專案已有）
6. 點 **Create repository**

### 2. 連線並推送

GitHub 建立好後會顯示指令，或直接執行：

```bash
cd /Users/Metatrons/Desktop/學習/Cursor/pk-app

# 加入遠端（把 YOUR_USERNAME 換成你的 GitHub 帳號）
git remote add origin https://github.com/YOUR_USERNAME/pk-app.git

# 推送
git push -u origin main
```

若使用 SSH：
```bash
git remote add origin git@github.com:YOUR_USERNAME/pk-app.git
git push -u origin main
```

### 3. 若需要登入

- **HTTPS**：會要求 GitHub 帳密，或使用 Personal Access Token
- **SSH**：需先設定 SSH key，見 [GitHub SSH 設定](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)
