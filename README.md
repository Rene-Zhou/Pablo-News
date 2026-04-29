# Pablo-News · 科技早报

一份由 AI 自动生成的全球 AI 科技资讯精选，每日清晨推送。

## 内容生态

```
Hermes Agent（4AM cron 采集+生成）
        │
        ▼  git push
GitHub 仓库
        │
        ▼  Cloudflare GitHub 集成自动部署
news.renezhou.com（全球 CDN 边缘分发）
```

## 技术栈

- **信息采集** — Hacker News Algolia API + TechCrunch/The Verge 等内容抓取
- **内容生成** — Hermes Agent（AI 驱动，自动采集+撰写+排版）
- **静态站点** — [Hono](https://hono.dev/) + Cloudflare Workers
- **存储** — Cloudflare KV（简报内容与元数据）
- **Markdown 渲染** — [marked](https://marked.js.org/)
- **自动部署** — Cloudflare GitHub 集成（push → 自动构建部署）

## 站点路由

| 路由 | 说明 |
|------|------|
| `/` | 首页 — 最新一期简报 + 近期归档 |
| `/:date` | 某日简报（如 `/2026-04-29`） |
| `/archive` | 全部历史简报 |
| `/rss.xml` | RSS 订阅 |
| `/about` | 关于本站 |
| `POST /api/sync` | API 端点（供 cron 推送新简报） |

## 部署

本仓库通过 Cloudflare Dashboard → Workers & Pages → 连接 GitHub 仓库自动部署。

需要在 Cloudflare Dashboard 进行以下操作：

1. 创建 KV Namespace，名称任意（如 `BRIEFING_KV`）
2. 在 `wrangler.toml` 中将 `YOUR_KV_ID` 替换为实际的 KV Namespace ID
3. 设置环境变量 `API_KEY`（用于 API sync 端点认证）
4. 配置自定义域名 `news.renezhou.com`

## 本地开发

```bash
npm install
npm run dev     # wrangler dev
npm run deploy  # wrangler deploy
```

## License

MIT
