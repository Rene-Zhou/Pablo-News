export const css = String.raw`
/* ===== Reset & Base ===== */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",system-ui,sans-serif;
  background:#f8f9fa;color:#1a1a1a;line-height:1.8;
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
  margin:40px 0 16px;padding-bottom:10px;
  border-bottom:1px solid #eee;font-size:.9375rem;color:#555
}
.briefing-meta .date{font-size:1.125rem;font-weight:600;color:#333}

/* ===== Markdown Rendered Content ===== */
.content h1{font-size:1.375rem;font-weight:700;margin:0 0 24px 0;line-height:1.4}

/* Section headings */
.content h2{
  font-size:1.125rem;font-weight:700;margin:40px 0 20px;
  padding-bottom:8px;border-bottom:1px solid #ddd
}

/* News item headings (h3) */
.content h3{
  font-size:1rem;font-weight:600;margin:28px 0 10px;line-height:1.5
}
.content h3:first-of-type{margin-top:0}

.content p{
  font-size:.9375rem;color:#444;line-height:1.9;margin-bottom:8px
}

/* Source line (the — 来源: links line) */
.content p:last-of-type{
  font-size:.8125rem;color:#999
}
.content p:last-of-type a{color:#2563eb;text-decoration:none}
.content p:last-of-type a:hover{text-decoration:underline}

/* hr separators between top news items */
.content hr{
  border:none;border-top:1px solid #ddd;margin:32px 0
}

/* Strong text */
.content strong{color:#1a1a1a}

/* Blockquote for source references */
.content blockquote{
  border-left:3px solid #ddd;padding:4px 0 4px 16px;
  margin:8px 0;color:#666;font-size:.875rem;line-height:1.7
}
.content blockquote p{color:#666;font-size:.875rem;margin:0}

/* Links in content */
.content a{color:#2563eb;text-decoration:none}
.content a:hover{text-decoration:underline}

/* Lists (e.g. bullet points in perspectives) */
.content ul{margin:8px 0 12px 20px;font-size:.875rem;color:#555;line-height:1.8}

/* ===== Archive ===== */
.archive-list{list-style:none}
.archive-list li{
  padding:12px 0;border-bottom:1px solid #eee;
  display:flex;justify-content:space-between;align-items:center
}
.archive-list li a{color:#1a1a1a;text-decoration:none;font-weight:500}
.archive-list li a:hover{color:#2563eb}
.archive-list .arc-date{font-size:.8125rem;color:#999}

/* ===== Footer ===== */
footer{
  margin-top:60px;padding-top:20px;border-top:1px solid #eee;
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
  .content h2{margin:32px 0 16px}
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
  .content h2{border-bottom-color:#2a2a2e}
  .content p{color:#999}
  .content strong{color:#e0e0e0}
  .content hr{border-top-color:#2a2a2e}
  .content blockquote{border-left-color:#333;color:#888}
  .content blockquote p{color:#888}
  .content ul{color:#888}
  .content p:last-of-type{color:#666}
  footer{border-top-color:#2a2a2e}
}
`
