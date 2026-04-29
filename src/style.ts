export const css = String.raw`

/* ===== Reset & Base ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",system-ui,sans-serif;
  background:#f8f9fa;color:#1a1a1a;line-height:1.7;
  max-width:800px;margin:0 auto;padding:0 20px 60px
}

/* ===== Header ===== */
header{
  padding:48px 0 24px;border-bottom:2px solid #e0e0e0;
  display:flex;justify-content:space-between;align-items:flex-end;
  flex-wrap:wrap;gap:12px
}
header h1{font-size:1.5rem;font-weight:700;letter-spacing:-0.02em}
header h1 a{color:#1a1a1a;text-decoration:none}
header nav{display:flex;gap:20px}
header nav a{color:#666;text-decoration:none;font-size:.875rem;transition:color .15s}
header nav a:hover{color:#1a1a1a}

/* ===== Briefing Meta ===== */
.briefing-meta{
  display:flex;justify-content:space-between;align-items:center;
  margin:32px 0 12px;padding-bottom:8px;
  border-bottom:1px solid #eee;font-size:.875rem;color:#888
}
.briefing-meta .date{font-size:1.125rem;font-weight:600;color:#333}
.briefing-meta .tagline{color:#999}

/* ===== Content Sections ===== */
section{margin:24px 0}
h2{
  font-size:1.125rem;font-weight:700;margin:32px 0 16px;
  padding-bottom:6px;border-bottom:1px solid #ddd
}

/* ===== News Items ===== */
.news-item{border-bottom:1px solid #eee;padding:16px 0}
.news-item:last-child{border-bottom:none}
.news-item h3{font-size:1rem;font-weight:600;margin-bottom:6px;line-height:1.5}
.news-item h3 .emoji{margin-right:4px}
.news-item h3 a{color:#1a1a1a;text-decoration:none}
.news-item h3 a:hover{color:#2563eb}
.news-item p{font-size:.875rem;color:#555;line-height:1.7;margin-bottom:6px}
.news-source{font-size:.75rem;color:#999}
.news-source a{color:#2563eb;text-decoration:none}
.news-source a:hover{text-decoration:underline}
.news-source .sep{color:#ccc;margin:0 4px}

/* ===== Multi-perspective Box ===== */
.perspectives{
  background:#f0f4ff;border-radius:8px;padding:12px 16px;
  margin:8px 0;font-size:.8125rem;line-height:1.6
}
.perspectives strong{color:#333}
.perspectives .p-item{margin:4px 0}

/* ===== Featured Item (hero) ===== */
.news-item.featured{
  background:#fff;border:1px solid #e0e0e0;border-radius:10px;
  padding:20px;margin-bottom:8px
}
.news-item.featured h3{font-size:1.0625rem}
.news-item.featured .hot-badge{
  display:inline-block;background:#dc2626;color:#fff;
  font-size:.6875rem;font-weight:600;padding:1px 8px;
  border-radius:4px;margin-right:6px;vertical-align:middle
}

/* ===== Archive ===== */
.archive-list{list-style:none}
.archive-list li{
  padding:10px 0;border-bottom:1px solid #eee;
  display:flex;justify-content:space-between;align-items:center
}
.archive-list li a{color:#1a1a1a;text-decoration:none;font-weight:500}
.archive-list li a:hover{color:#2563eb}
.archive-list .arc-date{font-size:.8125rem;color:#999}
.archive-list .arc-count{font-size:.75rem;color:#bbb}

/* ===== Footer ===== */
footer{
  margin-top:48px;padding-top:16px;border-top:1px solid #eee;
  font-size:.75rem;color:#bbb;text-align:center
}
footer a{color:#999;text-decoration:none}
footer a:hover{color:#666}

/* ===== 404 ===== */
.not-found{text-align:center;padding:80px 0}
.not-found h2{font-size:1.5rem;border:none;margin-bottom:8px}
.not-found p{color:#999;font-size:.875rem}
.not-found a{color:#2563eb;text-decoration:none}

/* ===== Responsive ===== */
@media(max-width:600px){
  body{padding:0 16px 40px}
  header{padding:32px 0 16px;flex-direction:column;align-items:flex-start}
  .briefing-meta{flex-direction:column;align-items:flex-start;gap:4px}
  .news-item.featured{padding:16px}
}

/* ===== Dark Mode ===== */
@media(prefers-color-scheme:dark){
  body{background:#0f0f11;color:#e0e0e0}
  header{border-bottom-color:#2a2a2e}
  header h1 a{color:#e0e0e0}
  header nav a{color:#888}
  header nav a:hover{color:#e0e0e0}
  .briefing-meta{border-bottom-color:#2a2a2e}
  .briefing-meta .date{color:#ccc}
  .perspectives{background:#1a1d2e}
  .news-item{border-bottom-color:#2a2a2e}
  .news-item p{color:#999}
  .news-item.featured{background:#1a1a1e;border-color:#333}
  footer{border-top-color:#2a2a2e}
  h2{border-bottom-color:#2a2a2e}
}
`