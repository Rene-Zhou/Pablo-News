# Pablo-News · 科技早报

一份由 AI 自动生成的全球 AI 科技资讯精选，每日清晨推送。

## 内容生态

```
Hermes Agent（4AM cron 采集+生成）
        │
        ▼  git push
GitHub 仓库（简报 .md 文件随代码提交）
        │
        ▼  Cloudflare GitHub 集成自动部署
news.renezhou.com（全球 CDN 边缘分发）
```

## 技术栈

- **信息采集** — Hacker News Algolia API + TechCrunch/The Verge 等内容抓取
- **内容生成** — Hermes Agent（AI 驱动，自动采集+撰写+排版）
- **静态站点** — [Hono](https://hono.dev/) + Cloudflare Workers
- **简报存储** — Wrangler Assets（简报 .md 直接作为 Worker 静态资源部署）
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

## 部署

本仓库通过 Cloudflare Dashboard → Workers & Pages → 连接 GitHub 仓库自动部署。

不需要 KV Namespace、不需要 API Key——简报文件位于 `briefings/` 目录下，以 Wrangler Assets 方式发布。

## 本地开发

```bash
npm install
npm run dev     # wrangler dev
npm run deploy  # wrangler deploy
```

## License

MIT
