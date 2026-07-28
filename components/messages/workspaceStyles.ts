// 私信 workspace · 集中式内联样式 · 保持 Sugardating 米白/黑金/香槟风格
// 与项目 globals.css 变量兼容 · 不引入 Tailwind class
export const workspaceStyles = `
  :root{
    --ws-page:#F7F4EF;
    --ws-card:#fff;
    --ws-ink:#171512;
    --ws-line:#E9E3DA;
    --ws-line-soft:#F0EAE1;
    --ws-muted:#a19a91;
    --ws-muted-2:#77716A;
    --ws-gold:#B8A789;
    --ws-gold-2:#EEDDB8;
    --ws-gold-3:#D6B980;
    --ws-online:#22C55E;
  }

  /* 布局壳 · 三栏 */
  .ws{background:var(--ws-page);display:grid;grid-template-columns:88px 380px minmax(0,1fr);
      height:calc(100dvh - 120px);min-height:560px;color:var(--ws-ink);
      font-family:'Plus Jakarta Sans','Noto Sans SC',ui-sans-serif;overflow:hidden}
  .ws-main{display:flex;flex-direction:column;background:linear-gradient(180deg,#FBFAF7,var(--ws-page));min-width:0;overflow:hidden}
  .ws-chat{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
  .ws-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ws-muted-2);text-align:center;padding:40px}
  .ws-empty h3{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:28px;color:var(--ws-ink);margin:0 0 8px}
  .ws-empty p{margin:0;font-size:13.5px;color:var(--ws-muted)}

  /* 未登录 gate */
  .wgate{background:var(--ws-page);min-height:calc(100vh - 120px);display:grid;place-items:center;padding:32px;font-family:'Plus Jakarta Sans','Noto Sans SC',ui-sans-serif}
  .wgate-in{background:#fff;border:1px solid var(--ws-line);border-radius:22px;padding:52px 44px;max-width:520px;text-align:center;box-shadow:0 30px 80px -40px rgba(15,23,42,.2)}
  .wgate-eye{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--ws-gold);font-weight:800}
  .wgate-in h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:34px;font-weight:600;color:var(--ws-ink);margin:8px 0 10px;letter-spacing:-0.015em}
  .wgate-in p{margin:0 0 22px;color:var(--ws-muted-2);font-size:14px;line-height:1.6}
  .wgate-btn{display:inline-block;background:var(--ws-ink);color:#F5EEDD;padding:12px 30px;border-radius:99px;text-decoration:none;font-size:13.5px;font-weight:700}
  .wgate-btn:hover{background:#2b2822}

  /* 会话列表 */
  .cl{background:#fff;border-right:1px solid var(--ws-line);display:flex;flex-direction:column;overflow:hidden}
  .cl-head{padding:20px 20px 12px;border-bottom:1px solid var(--ws-line-soft)}
  .cl-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .cl-title{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:26px;font-weight:600;color:var(--ws-ink);margin:0;letter-spacing:-0.01em}
  .cl-icon-btn{width:34px;height:34px;background:transparent;color:var(--ws-ink);border:1px solid var(--ws-line);border-radius:50%;cursor:pointer;display:grid;place-items:center;transition:all .15s}
  .cl-icon-btn:hover{background:var(--ws-ink);color:#F5EEDD;border-color:var(--ws-ink)}
  .cl-search{display:flex;align-items:center;gap:8px;background:var(--ws-page);border:1px solid var(--ws-line);border-radius:10px;padding:8px 12px;color:var(--ws-muted)}
  .cl-search:focus-within{border-color:var(--ws-ink);color:var(--ws-ink)}
  .cl-search input{flex:1;border:0;background:transparent;font-size:13px;color:var(--ws-ink);outline:none}
  .cl-search input::placeholder{color:var(--ws-muted)}
  .cl-clear{background:transparent;border:0;color:var(--ws-muted);cursor:pointer;display:grid;place-items:center;padding:0}
  .cl-tabs{display:flex;gap:6px;margin-top:12px}
  .cl-tab{flex:1;padding:8px 10px;background:transparent;border:1px solid var(--ws-line);border-radius:99px;font-size:12px;color:var(--ws-muted-2);cursor:pointer;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
  .cl-tab:hover{border-color:var(--ws-ink);color:var(--ws-ink)}
  .cl-tab.on{background:var(--ws-ink);color:#F5EEDD;border-color:var(--ws-ink)}
  .cl-tab-n{background:rgba(255,255,255,.15);padding:1px 7px;border-radius:99px;font-size:10.5px;font-weight:800}
  .cl-tab:not(.on) .cl-tab-n{background:var(--ws-line-soft);color:var(--ws-muted-2)}

  .cl-scroll{flex:1;overflow-y:auto;padding:6px 8px 12px}
  .cl-empty{padding:36px 20px;text-align:center;font-size:12.5px;color:var(--ws-muted)}
  .cl-item{width:100%;background:transparent;border:0;border-radius:14px;padding:10px 12px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;color:inherit;transition:background .12s}
  .cl-item:hover{background:var(--ws-page)}
  .cl-item.on{background:linear-gradient(180deg,#FBF3E1,#F4EBD4);box-shadow:inset 3px 0 0 var(--ws-gold-3)}
  .cl-ava{position:relative;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--ws-gold-2),var(--ws-gold-3));display:grid;place-items:center;color:#3a2f1e;font-weight:800;font-size:16px;flex-shrink:0}
  .cl-online{position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;background:var(--ws-online);border:2px solid #fff;border-radius:50%}
  .cl-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
  .cl-row1{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .cl-name{display:inline-flex;align-items:center;gap:5px;font-size:13.5px;font-weight:700;color:var(--ws-ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cl-time{font-size:10.5px;color:var(--ws-muted);flex-shrink:0}
  .cl-row2{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .cl-preview{display:inline-flex;align-items:center;gap:5px;color:var(--ws-muted-2);font-size:12px;min-width:0;flex:1}
  .cl-preview-t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
  .cl-badge{background:var(--ws-ink);color:#F5EEDD;font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:99px;flex-shrink:0}

  /* Chat header */
  .ch-h{display:flex;align-items:center;gap:12px;padding:12px 22px;background:#fff;border-bottom:1px solid var(--ws-line-soft);min-height:64px}
  .ch-back{display:none;background:transparent;border:0;color:var(--ws-ink);cursor:pointer;padding:6px;border-radius:8px}
  .ch-ava{position:relative;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--ws-gold-2),var(--ws-gold-3));display:grid;place-items:center;color:#3a2f1e;font-weight:800;font-size:15px;flex-shrink:0}
  .ch-online{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;background:var(--ws-online);border:2px solid #fff;border-radius:50%}
  .ch-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .ch-name{display:flex;align-items:center;gap:6px}
  .ch-name b{font-size:15px;font-weight:800;color:var(--ws-ink);letter-spacing:-0.005em}
  .ch-status{font-size:11.5px;color:var(--ws-muted)}
  .ch-status.on{color:var(--ws-online);font-weight:600}
  .ch-actions{display:flex;align-items:center;gap:2px}
  .ch-btn{width:36px;height:36px;background:transparent;border:0;color:var(--ws-muted-2);border-radius:10px;cursor:pointer;display:grid;place-items:center;transition:all .15s;position:relative}
  .ch-btn:hover:not(:disabled){background:var(--ws-page);color:var(--ws-ink)}
  .ch-btn.on{color:var(--ws-ink);background:var(--ws-gold-2)}
  .ch-btn:disabled{opacity:.35;cursor:not-allowed}

  /* Search bar */
  .csb{display:flex;align-items:center;gap:8px;padding:10px 22px;background:#FDFBF7;border-bottom:1px solid var(--ws-line-soft);color:var(--ws-muted)}
  .csb input{flex:1;border:0;background:transparent;font-size:13px;color:var(--ws-ink);outline:none}
  .csb-count{font-size:11px;color:var(--ws-muted-2);white-space:nowrap}
  .csb-nav{background:transparent;border:0;color:var(--ws-ink);cursor:pointer;padding:4px;border-radius:6px;display:grid;place-items:center}
  .csb-nav:hover:not(:disabled){background:var(--ws-page)}
  .csb-nav:disabled{opacity:.3;cursor:not-allowed}
  .csb-close{background:transparent;border:0;color:var(--ws-muted-2);cursor:pointer;padding:4px}

  /* Thread */
  .ct-scroll{flex:1;overflow-y:auto;padding:18px 22px 12px;display:flex;flex-direction:column;gap:8px;background:linear-gradient(180deg,#FBFAF7,var(--ws-page))}
  .ct-empty{padding:36px 20px;text-align:center;color:var(--ws-muted);font-size:12.5px}
  .ct-day{display:flex;align-items:center;justify-content:center;gap:10px;margin:8px 0 4px;color:var(--ws-gold);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
  .ct-day::before,.ct-day::after{content:"";flex:0 1 90px;height:1px;background:linear-gradient(to right,transparent,var(--ws-line),transparent)}
  .ct-day span{padding:2px 10px;background:rgba(255,255,255,.6);border-radius:99px;color:#8f8878}
  .ct-slot{display:contents}
  .ct-slot--hit .mb-bubble{outline:2px solid var(--ws-gold-3);outline-offset:2px}

  /* Message bubble base */
  .mb{display:flex;flex-direction:column;gap:2px;max-width:66%}
  .mb.me{align-self:flex-end;align-items:flex-end}
  .mb.them{align-self:flex-start;align-items:flex-start}
  .mb-sys{align-self:center;max-width:min(70%,420px)}
  .mb-bubble{padding:9px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;color:var(--ws-ink);background:#fff;border:1px solid var(--ws-line);border-bottom-left-radius:6px;position:relative}
  .mb.me .mb-bubble{background:var(--ws-ink);color:#F5EEDD;border-color:var(--ws-ink);border-bottom-right-radius:6px;border-bottom-left-radius:16px}
  .mb-text{margin:0;word-break:break-word}
  .mb-bubble--img{padding:4px;overflow:hidden}
  .mb-bubble--img img{max-width:260px;max-height:220px;display:block;border-radius:12px;object-fit:cover}
  .mb-trans{margin-top:6px;padding-top:6px;border-top:1px dashed rgba(184,167,137,.4);display:flex;flex-direction:column;gap:2px}
  .mb.me .mb-trans{border-top-color:rgba(238,221,184,.35)}
  .mb-trans-tag{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ws-gold-3);font-weight:800}
  .mb.me .mb-trans-tag{color:var(--ws-gold-2)}
  .mb-trans p{margin:0;font-size:12.5px;opacity:.9}
  .mb-trans-btn{margin-top:6px;background:transparent;border:0;padding:0;color:var(--ws-gold-3);font-size:11px;font-weight:700;cursor:pointer;letter-spacing:.05em}
  .mb.me .mb-trans-btn{color:var(--ws-gold-2)}
  .mb-hit{background:rgba(238,221,184,.55);color:inherit;padding:0 2px;border-radius:3px}
  .mb-meta{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;color:var(--ws-muted);padding:0 6px}
  .mb-status--sending{opacity:.5}
  .mb-status--read{color:var(--ws-gold-3)}

  /* Voice bubble */
  .mb-bubble--voice{display:flex;align-items:center;gap:10px;min-width:190px;padding:8px 12px}
  .vm-play{width:30px;height:30px;background:transparent;border:1px solid rgba(0,0,0,.12);border-radius:50%;color:inherit;cursor:pointer;display:grid;place-items:center;flex-shrink:0}
  .mb.me .vm-play{border-color:rgba(238,221,184,.4);color:var(--ws-gold-2)}
  .vm-wave{flex:1;display:flex;align-items:center;gap:2px;height:26px;min-width:80px}
  .vm-bar{flex:1;background:currentColor;opacity:.32;border-radius:2px;min-height:4px}
  .vm-bar--on{opacity:.9}
  .vm-time{font-size:11px;color:inherit;opacity:.75;font-variant-numeric:tabular-nums;flex-shrink:0}

  /* Call record */
  .mb-call{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(255,255,255,.75);border:1px solid var(--ws-line);border-radius:99px;font-size:11.5px;color:var(--ws-muted-2)}
  .mb-call time{color:var(--ws-muted)}

  /* Composer */
  .mc{border-top:1px solid var(--ws-line-soft);background:#fff;padding:10px 18px 12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));position:relative}
  .mc-preview{margin-bottom:8px;display:inline-block;position:relative}
  .mc-preview img{max-height:110px;max-width:180px;border-radius:10px;border:1px solid var(--ws-line);display:block}
  .mc-preview-x{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border-radius:50%;background:var(--ws-ink);color:#fff;border:0;cursor:pointer;display:grid;place-items:center}
  .mc-row{display:flex;align-items:flex-end;gap:8px}
  .mc-tools{display:flex;align-items:center;gap:2px}
  .mc-tool{width:36px;height:36px;background:transparent;border:0;color:var(--ws-muted-2);border-radius:10px;cursor:pointer;display:grid;place-items:center;transition:all .15s}
  .mc-tool:hover{background:var(--ws-page);color:var(--ws-ink)}
  .mc-input{flex:1;min-width:0;resize:none;border:1px solid var(--ws-line);border-radius:14px;padding:10px 14px;font-size:13.5px;line-height:1.5;color:var(--ws-ink);font-family:inherit;outline:none;background:var(--ws-page);max-height:140px;overflow-y:auto}
  .mc-input:focus{border-color:var(--ws-ink);background:#fff}
  .mc-input::placeholder{color:var(--ws-muted)}
  .mc-send{width:38px;height:38px;background:var(--ws-line);color:var(--ws-muted);border:0;border-radius:12px;cursor:not-allowed;display:grid;place-items:center;transition:all .15s;flex-shrink:0}
  .mc-send.on{background:var(--ws-ink);color:#F5EEDD;cursor:pointer}
  .mc-send.on:hover{background:#2b2822}
  .mc-emoji-wrap{position:absolute;bottom:calc(100% + 6px);left:14px;z-index:20}

  /* Emoji picker */
  .ep{display:grid;grid-template-columns:repeat(8,1fr);gap:2px;padding:10px;background:#fff;border:1px solid var(--ws-line);border-radius:14px;box-shadow:0 20px 40px -20px rgba(15,23,42,.25);width:288px}
  .ep-btn{background:transparent;border:0;font-size:18px;line-height:1;padding:6px;border-radius:8px;cursor:pointer}
  .ep-btn:hover{background:var(--ws-page)}

  /* Voice recording bar */
  .mc--rec{padding:14px 18px}
  .vr{display:flex;align-items:center;gap:14px;background:var(--ws-page);border:1px solid var(--ws-line);border-radius:14px;padding:10px 14px}
  .vr-cancel{background:transparent;border:0;color:var(--ws-muted-2);cursor:pointer;display:grid;place-items:center}
  .vr-cancel:hover{color:var(--ws-ink)}
  .vr-pulse{width:10px;height:10px;background:#E5484D;border-radius:50%;box-shadow:0 0 0 0 rgba(229,72,77,.5);animation:vr-pulse 1.4s infinite}
  @keyframes vr-pulse{50%{box-shadow:0 0 0 8px rgba(229,72,77,0)}}
  .vr-label{font-size:12.5px;color:var(--ws-muted-2);flex:1}
  .vr-time{font-variant-numeric:tabular-nums;font-size:13px;color:var(--ws-ink);font-weight:700}
  .vr-send{width:38px;height:38px;background:var(--ws-ink);color:#F5EEDD;border:0;border-radius:12px;cursor:pointer;display:grid;place-items:center}
  .vr-send:hover{background:#2b2822}

  /* Modals · call & new conv */
  .modal-scrim{position:fixed;inset:0;background:rgba(23,21,18,.55);backdrop-filter:blur(8px);display:grid;place-items:center;z-index:80;padding:20px}
  .modal-scrim--dark{background:linear-gradient(180deg,#1a1917,#0a0908)}
  .modal-card{background:#fff;border-radius:22px;padding:32px 28px;max-width:420px;width:100%;box-shadow:0 40px 100px -30px rgba(0,0,0,.5)}

  /* Voice call */
  .mc-voice{text-align:center;padding:40px 28px 28px}
  .mv-ava{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--ws-gold-2),var(--ws-gold-3));margin:0 auto 20px;display:grid;place-items:center;color:#3a2f1e;font-weight:800;font-size:36px}
  .mv-name{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:28px;color:var(--ws-ink);margin:0 0 6px}
  .mv-status{font-size:13px;color:var(--ws-muted-2);margin-bottom:32px;font-variant-numeric:tabular-nums}
  .mv-actions{display:flex;justify-content:center;gap:14px}
  .mv-btn{width:52px;height:52px;background:var(--ws-page);color:var(--ws-ink);border:1px solid var(--ws-line);border-radius:50%;cursor:pointer;display:grid;place-items:center;transition:all .15s}
  .mv-btn:hover{background:var(--ws-line-soft)}
  .mv-btn.on{background:var(--ws-ink);color:#F5EEDD;border-color:var(--ws-ink)}
  .mv-hang{background:#E5484D;color:#fff;border-color:#E5484D}
  .mv-hang:hover{background:#c8383c}

  /* Video call · dark stage */
  .video-stage{position:relative;width:min(720px,90vw);height:min(80dvh,540px);border-radius:24px;overflow:hidden;background:linear-gradient(160deg,#2a2620,#12100e);display:flex}
  .video-main{flex:1;display:grid;place-items:center;position:relative}
  .video-avatar-lg{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,var(--ws-gold-2),var(--ws-gold-3));display:grid;place-items:center;color:#3a2f1e;font-weight:800;font-size:52px}
  .video-top{position:absolute;top:16px;left:16px;color:#F5EEDD;display:flex;flex-direction:column;gap:2px}
  .video-top b{font-size:15px}
  .video-top span{font-size:12px;opacity:.75;font-variant-numeric:tabular-nums}
  .video-pip{position:absolute;top:16px;right:16px;width:140px;height:100px;background:#1a1815;border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden;display:grid;place-items:center}
  .video-pip-cam{width:100%;height:100%;background:linear-gradient(160deg,#3a3428,#1a1712)}
  .video-pip-avatar{color:#F5EEDD;font-weight:800;font-size:22px;background:linear-gradient(135deg,var(--ws-gold-2),var(--ws-gold-3));width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#3a2f1e}
  .video-stage.flipped .video-pip{top:auto;bottom:16px;right:16px}
  .video-actions{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);display:flex;gap:14px;z-index:81}
  .video-actions .mv-btn{background:rgba(255,255,255,.14);color:#F5EEDD;border-color:rgba(255,255,255,.2);backdrop-filter:blur(8px)}
  .video-actions .mv-btn:hover{background:rgba(255,255,255,.22)}
  .video-actions .mv-btn.on{background:#F5EEDD;color:var(--ws-ink);border-color:#F5EEDD}
  .video-actions .mv-hang{background:#E5484D;color:#fff;border-color:#E5484D}

  /* New conversation modal */
  .nc{padding:22px 22px 18px}
  .nc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .nc-head h3{margin:0;font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;color:var(--ws-ink)}
  .nc-close{background:transparent;border:0;color:var(--ws-muted-2);cursor:pointer;padding:4px}
  .nc-search{display:flex;align-items:center;gap:8px;background:var(--ws-page);border:1px solid var(--ws-line);border-radius:10px;padding:8px 12px;color:var(--ws-muted);margin-bottom:12px}
  .nc-search input{flex:1;border:0;background:transparent;font-size:13px;color:var(--ws-ink);outline:none}
  .nc-list{max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:2px}
  .nc-empty{padding:24px;text-align:center;color:var(--ws-muted);font-size:12.5px}
  .nc-item{display:flex;align-items:center;gap:12px;background:transparent;border:0;padding:10px 12px;border-radius:12px;cursor:pointer;text-align:left}
  .nc-item:hover{background:var(--ws-page)}
  .nc-ava{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--ws-gold-2),var(--ws-gold-3));display:grid;place-items:center;color:#3a2f1e;font-weight:800;font-size:14px;flex-shrink:0}
  .nc-body{display:flex;flex-direction:column;gap:2px}
  .nc-body b{font-size:13.5px;color:var(--ws-ink);font-weight:700}
  .nc-body em{font-size:11.5px;color:var(--ws-muted-2);font-style:normal}

  /* 平板 · 会话列表变窄 */
  @media(max-width:1080px){
    .ws{grid-template-columns:88px 320px minmax(0,1fr)}
  }

  /* 平板 · 双栏 · BottomNav 已 md:hidden · 只需减去 Nav */
  @media(max-width:1080px) and (min-width:901px){
    .ws{height:calc(100dvh - 100px)}
  }
  /* 小平板 / 大手机 (768-900px) · 单列切换 · BottomNav 仍 md:hidden · 只减 Nav */
  @media(max-width:900px) and (min-width:768px){
    .ws{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);
        height:calc(100dvh - 80px);min-height:420px}
    .ws--list .cl{display:flex}
    .ws--list .ws-main{display:none}
    .ws--chat .cl{display:none}
    .ws--chat .ws-main{display:flex}
    .ch-back{display:grid;place-items:center}
    .mb{max-width:80%}
    .mc-emoji-wrap{left:8px;right:8px}
    .ep{width:auto;grid-template-columns:repeat(8,1fr)}
  }
  /* 手机 (<768px) · BottomNav 显示 · 需减 Nav + BottomNav + safe-area · 输入框固定底 */
  @media(max-width:767px){
    .ws{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);
        height:calc(100dvh - 80px - 64px - env(safe-area-inset-bottom, 0px));
        min-height:420px}
    .ws--list .cl{display:flex}
    .ws--list .ws-main{display:none}
    .ws--chat .cl{display:none}
    .ws--chat .ws-main{display:flex}
    .ch-back{display:grid;place-items:center}
    .mb{max-width:80%}
    .mc-emoji-wrap{left:8px;right:8px}
    .ep{width:auto;grid-template-columns:repeat(8,1fr)}
  }
  /* 极窄屏 · 320px · 消息气泡放大到 88% · 图标操作栏更紧凑 */
  @media(max-width:360px){
    .ch-h{padding:10px 12px;gap:8px;min-height:56px}
    .ch-actions{gap:0}
    .ch-btn{width:32px;height:32px}
    .cl-head{padding:14px 12px 10px}
    .ct-scroll{padding:14px 12px 10px}
    .mc{padding:8px 10px 10px;padding-bottom:calc(10px + env(safe-area-inset-bottom))}
    .mc-tool{width:32px;height:32px}
    .mb{max-width:88%}
    .mb-bubble--img img{max-width:200px}
  }
`;
