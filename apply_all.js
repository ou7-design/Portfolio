const fs = require('fs');

// Read the pristine index.html
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix known corruption patterns (if any)
html = html.replace(/вЂ”/g, '—')
           .replace(/рџ‘‹/g, '👋')
           .replace(/в—ђ/g, '◐')
           .replace(/в—‘/g, '◑')
           .replace(/В©/g, '©')
           .replace(/вњ¦/g, '✦')
           .replace(/ВЊ;/g, '')
           .replace(/B_'/g, '')
           .replace(/В_,/g, '');

// Clean up any garbage right inside the tIcon span
html = html.replace(/<span class="t-icon" id="tIcon">[^<]*<\/span>/g, '<span class="t-icon" id="tIcon">◐</span>');

// 2. Add Unbounded font
if (!html.includes('family=Unbounded')) {
    html = html.replace('family=Syne:wght@700;800&family=Inter', 'family=Syne:wght@700;800&family=Unbounded:wght@700;800&family=Inter');
}
if (!html.includes("'Unbounded'")) {
    html = html.replace(/'Syne', sans-serif/g, "'Syne', 'Unbounded', sans-serif");
}

// 3. Inject bottom bar language segment with popup select
const logoSegTarget = `<div class="rk-bar-segment rk-logo-seg" onclick="window.scrollTo({top:0, behavior:'smooth'})">\r\n        <img src="logok.png" alt="Logo">\r\n      </div>`;
const logoSegTargetLF = `<div class="rk-bar-segment rk-logo-seg" onclick="window.scrollTo({top:0, behavior:'smooth'})">\n        <img src="logok.png" alt="Logo">\n      </div>`;

const langSegHtml = `      <div class="rk-bar-segment rk-lang-seg" id="rkLangSeg">
        <button class="rk-lang-toggle" id="rkLangToggle">
          <span id="rkLangCurrent">eng</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="rk-lang-popover" id="rkLangPopover">
          <button class="rk-popover-btn" data-lang="en">eng</button>
          <button class="rk-popover-btn" data-lang="uz">uz</button>
          <button class="rk-popover-btn" data-lang="ru">ru</button>
        </div>
      </div>`;

if (html.includes(logoSegTarget)) {
    html = html.replace(logoSegTarget, langSegHtml);
} else if (html.includes(logoSegTargetLF)) {
    html = html.replace(logoSegTargetLF, langSegHtml);
} else {
    html = html.replace(/<div class="rk-bar-segment rk-logo-seg"[^>]*>[\s\S]*?<\/div>/, langSegHtml);
}

// 4. Inject modern bottom popover language switcher CSS, old logo styles cleanup, and minimalist logo glitch CSS
const logoCssTarget = `    /* Light mode logo color flip */\r\n    [data-theme='light'] .rk-logo-seg img { filter: invert(1) brightness(0); }\r\n\r\n    .rk-logo-seg {\r\n      width: 64px;\r\n      flex-shrink: 0;\r\n    }\r\n    .rk-logo-seg img {\r\n      width: 50px; height: 50px;\r\n      object-fit: contain;\r\n    }`;

const logoCssTargetLF = `    /* Light mode logo color flip */\n    [data-theme='light'] .rk-logo-seg img { filter: invert(1) brightness(0); }\n\n    .rk-logo-seg {\n      width: 64px;\n      flex-shrink: 0;\n    }\n    .rk-logo-seg img {\n      width: 50px; height: 50px;\n      object-fit: contain;\n    }`;

const langCssHtml = `    /* ─── BOTTOM POPOVER LANGUAGE SWITCHER ─── */
    .rk-lang-seg {
      position: relative;
      width: 64px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rk-lang-toggle {
      background: none;
      border: none;
      color: var(--muted);
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      height: 100%;
      padding: 0;
      cursor: none !important;
      transition: color 0.3s ease;
    }
    .rk-lang-toggle:hover {
      color: var(--fg);
    }
    .rk-lang-toggle svg {
      width: 10px;
      height: 10px;
      stroke: currentColor;
      stroke-width: 2.5;
      transition: transform 0.3s ease;
    }
    .rk-lang-seg.open .rk-lang-toggle svg {
      transform: rotate(180deg);
    }
    .rk-lang-popover {
      position: absolute;
      bottom: 56px;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 12px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      display: flex;
      flex-direction: column;
      padding: 4px;
      gap: 2px;
      min-width: 70px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 100;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .rk-lang-seg.open .rk-lang-popover {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
    .rk-popover-btn {
      background: none;
      border: none;
      color: var(--muted);
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: none !important;
      transition: all 0.2s ease;
      text-align: center;
      width: 100%;
    }
    .rk-popover-btn:hover {
      background: rgba(255,255,255,0.06);
      color: var(--fg);
    }
    .rk-popover-btn.active {
      background: var(--fg);
      color: var(--bg);
      font-weight: 800;
    }
    
    /* ─── RESPONSIVE LAYOUT RESPONSES TO PREVENT OVERFLOW ─── */
    @media (max-width: 480px) {
      .contact-headline {
        font-size: clamp(30px, 8.8vw, 46px) !important;
        line-height: 1.05 !important;
        margin: 32px 0 40px !important;
        letter-spacing: -0.03em !important;
      }
      .s-title {
        font-size: clamp(30px, 8.8vw, 46px) !important;
        line-height: 1.05 !important;
        letter-spacing: -0.03em !important;
      }
      /* Prevent overall horizontal viewport overflow */
      html, body {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
    }
    
    /* ─── NATIVE MINIMALIST LOGO GLITCH EFFECT ─── */
    .nav-logo {
      position: relative;
      display: inline-block;
      cursor: none !important;
    }
    .nav-logo::before,
    .nav-logo::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      opacity: 0.85;
    }
    .nav-logo::before {
      left: 1.5px;
      text-shadow: -1.5px 0 var(--accent);
      clip-path: inset(100% 0 0 0);
      animation: logo-glitch-1 2.4s infinite steps(1, end);
    }
    .nav-logo::after {
      left: -1.5px;
      text-shadow: -1.5px 0 #00ffff;
      clip-path: inset(100% 0 0 0);
      animation: logo-glitch-2 2.4s infinite steps(1, end);
      animation-delay: -1.2s;
    }
    .nav-logo:hover::before {
      animation: logo-glitch-1 0.8s infinite steps(1, end);
    }
    .nav-logo:hover::after {
      animation: logo-glitch-2 0.8s infinite steps(1, end);
      animation-delay: -0.4s;
    }
    
    @keyframes logo-glitch-1 {
      0%   { clip-path: inset(8% 0 78% 0);  transform: translate(-2px, 0);   opacity: 0.9; }
      8%   { clip-path: inset(62% 0 15% 0); transform: translate(2px, -1px); opacity: 0.85; }
      16%  { clip-path: inset(30% 0 52% 0); transform: translate(-1px, 1px); opacity: 0.95; }
      25%  { clip-path: inset(5% 0 88% 0);  transform: translate(1px, 0);    opacity: 0.8; }
      33%  { clip-path: inset(78% 0 10% 0); transform: translate(-2px, 1px); opacity: 0.9; }
      41%  { clip-path: inset(45% 0 40% 0); transform: translate(2px, -1px); opacity: 0.85; }
      50%  { clip-path: inset(18% 0 65% 0); transform: translate(-1px, 0);   opacity: 0.95; }
      58%  { clip-path: inset(88% 0 3% 0);  transform: translate(1px, 1px);  opacity: 0.8; }
      66%  { clip-path: inset(38% 0 48% 0); transform: translate(-2px, -1px);opacity: 0.9; }
      75%  { clip-path: inset(55% 0 28% 0); transform: translate(2px, 0);    opacity: 0.85; }
      83%  { clip-path: inset(12% 0 72% 0); transform: translate(-1px, 1px); opacity: 0.95; }
      91%  { clip-path: inset(70% 0 18% 0); transform: translate(1px, -1px); opacity: 0.8; }
      100% { clip-path: inset(8% 0 78% 0);  transform: translate(-2px, 0);   opacity: 0.9; }
    }
    
    @keyframes logo-glitch-2 {
      0%   { clip-path: inset(55% 0 28% 0); transform: translate(2px, 1px);  opacity: 0.85; }
      8%   { clip-path: inset(20% 0 65% 0); transform: translate(-1px, 0);   opacity: 0.9; }
      16%  { clip-path: inset(80% 0 8% 0);  transform: translate(1px, -1px); opacity: 0.8; }
      25%  { clip-path: inset(40% 0 45% 0); transform: translate(-2px, 1px); opacity: 0.95; }
      33%  { clip-path: inset(10% 0 82% 0); transform: translate(2px, 0);    opacity: 0.85; }
      41%  { clip-path: inset(68% 0 22% 0); transform: translate(-1px, -1px);opacity: 0.9; }
      50%  { clip-path: inset(28% 0 58% 0); transform: translate(1px, 1px);  opacity: 0.8; }
      58%  { clip-path: inset(5% 0 90% 0);  transform: translate(-2px, 0);   opacity: 0.95; }
      66%  { clip-path: inset(75% 0 12% 0); transform: translate(2px, -1px); opacity: 0.85; }
      75%  { clip-path: inset(48% 0 35% 0); transform: translate(-1px, 1px); opacity: 0.9; }
      83%  { clip-path: inset(15% 0 75% 0); transform: translate(1px, 0);    opacity: 0.8; }
      91%  { clip-path: inset(85% 0 5% 0);  transform: translate(-2px, -1px);opacity: 0.95; }
      100% { clip-path: inset(55% 0 28% 0); transform: translate(2px, 1px);  opacity: 0.85; }
    }`;

if (html.includes(logoCssTarget)) {
    html = html.replace(logoCssTarget, langCssHtml);
} else if (html.includes(logoCssTargetLF)) {
    html = html.replace(logoCssTargetLF, langCssHtml);
} else {
    html = html.replace(/\.rk-logo-seg\s*\{[\s\S]*?\}/g, '').replace(/\[data-theme='light'\]\s*\.rk-logo-seg[\s\S]*?\}/g, '');
    html = html.replace(`.rk-bar-segment:hover { border-color: var(--border-hover); background: var(--bg); }`, `.rk-bar-segment:hover { border-color: var(--border-hover); background: var(--bg); }\n` + langCssHtml);
}

// 5. Inject Localization JS
const jsCode = `
  /* ---- LOCALIZATION ---- */
  const rkLangSeg = document.getElementById('rkLangSeg');
  const rkLangToggle = document.getElementById('rkLangToggle');
  const rkLangCurrent = document.getElementById('rkLangCurrent');
  const rkPopoverBtns = document.querySelectorAll('.rk-popover-btn');

  // Declare global currentLang
  window.currentLang = localStorage.getItem('lang') || 'en';

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    window.currentLang = lang;
    
    if (rkLangCurrent) {
      rkLangCurrent.textContent = lang;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    const cursorLabelText = document.getElementById('cursorLabelText');
    if (cursorLabelText && cursorLabelText.textContent !== 'Say hi! 👋' && cursorLabelText.textContent !== 'Salom! 👋' && cursorLabelText.textContent !== 'Привет! 👋') {
      const texts = { en: 'Guest', ru: 'Гость', uz: 'Mehmon' };
      cursorLabelText.textContent = texts[lang] || 'Guest';
    }

    rkPopoverBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Load translations.js dynamically with cache-buster timestamp
  const script = document.createElement('script');
  script.src = 'translations.js?v=' + Date.now();
  script.onload = () => {
    if (typeof translations !== 'undefined' && !translations[window.currentLang]) window.currentLang = 'en';
    applyLanguage(window.currentLang);

    if (rkLangToggle) {
      rkLangToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        rkLangSeg.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!rkLangSeg.contains(e.target)) {
          rkLangSeg.classList.remove('open');
        }
      });

      rkPopoverBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const lang = e.currentTarget.getAttribute('data-lang');
          window.currentLang = lang;
          localStorage.setItem('lang', window.currentLang);
          applyLanguage(window.currentLang);
          rkLangSeg.classList.remove('open');
        });
      });
    }
  };
  document.body.appendChild(script);
`;

// Inject before the closing script tag at the end of the file, checking if it is already present
if (!html.includes('/* ---- LOCALIZATION ---- */')) {
    const lastScriptIndex = html.lastIndexOf('</script>');
    if (lastScriptIndex !== -1) {
        html = html.substring(0, lastScriptIndex) + jsCode + html.substring(lastScriptIndex);
    }
}

// 6. Ensure no static translations.js script tag remains to prevent double loading or caching bugs!
html = html.replace(/<script src="translations.js"><\/script>\r?\n\s*/g, '');

// 7. Apply data-i18n tags safely to ILKHOM's info and name (excluding navigation UI, sound, theme labels, etc.)
const replacements = [
  ['<a href="#hero" class="nav-logo">mirabadskiy</a>', '<a href="#hero" class="nav-logo" data-text="mirabadskiy">mirabadskiy</a>'],
  ['<div class="pl-name"><span>Ilkhom Shakirov</span></div>', '<div class="pl-name"><span data-i18n="pl_name">Ilkhom Shakirov</span></div>'],
  ['<p class="hero-eyebrow"><span>AI Specialist · Marketing Manager</span></p>', '<p class="hero-eyebrow"><span data-i18n="hero_eyebrow">AI Specialist · Marketing Manager</span></p>'],
  ['<span class="tl"><span>Ilkhom</span></span>', '<span class="tl"><span data-i18n="hero_t1">Ilkhom</span></span>'],
  ['<span class="tl"><span>Shaki&shy;rov</span></span>', '<span class="tl"><span data-i18n="hero_t2">Shaki&shy;rov</span></span>'],
  ['<span>Tashkent based. Building experience in Artificial Intelligence and Marketing through real projects in social media, content creation, and brand growth.</span>', '<span data-i18n="hero_desc">Tashkent based. Building experience in Artificial Intelligence and Marketing through real projects in social media, content creation, and brand growth.</span>'],
  ['<div class="pill available"><span class="pill-dot"></span>Available for work</div>', '<div class="pill available"><span class="pill-dot"></span><span data-i18n="hero_pill1">Available for work</span></div>'],
  ['<div class="pill">Tashkent, Uzbekistan</div>', '<div class="pill" data-i18n="hero_pill2">Tashkent, Uzbekistan</div>'],
  ['<span>Scroll</span>', '<span data-i18n="scroll_hint">Scroll</span>'],
  
  ['<span class="mq-item">Artificial Intelligence</span>', '<span class="mq-item" data-i18n="mq_ai">Artificial Intelligence</span>'],
  ['<span class="mq-item">Marketing Strategy</span>', '<span class="mq-item" data-i18n="mq_marketing">Marketing Strategy</span>'],
  ['<span class="mq-item">Social Media Management</span>', '<span class="mq-item" data-i18n="mq_social">Social Media Management</span>'],
  ['<span class="mq-item">Content Creation</span>', '<span class="mq-item" data-i18n="mq_content">Content Creation</span>'],
  ['<span class="mq-item">Brand Growth</span>', '<span class="mq-item" data-i18n="mq_brand">Brand Growth</span>'],
  ['<span class="mq-item">Audience Engagement</span>', '<span class="mq-item" data-i18n="mq_audience">Audience Engagement</span>'],
  ['<span class="mq-item">Digital Marketing</span>', '<span class="mq-item" data-i18n="mq_digital">Digital Marketing</span>'],
  ['<span class="mq-item">AI Tools</span>', '<span class="mq-item" data-i18n="mq_tools">AI Tools</span>'],
  ['<span class="mq-item">Automation</span>', '<span class="mq-item" data-i18n="mq_automation">Automation</span>'],
  ['<span class="mq-item">Creative Thinking</span>', '<span class="mq-item" data-i18n="mq_creative">Creative Thinking</span>'],
  ['<span class="mq-item">Team Collaboration</span>', '<span class="mq-item" data-i18n="mq_team">Team Collaboration</span>'],
  ['<span class="mq-item">Communication</span>', '<span class="mq-item" data-i18n="mq_communication">Communication</span>'],
  ['<span class="mq-item">Market Research</span>', '<span class="mq-item" data-i18n="mq_research">Market Research</span>'],
  
  ['<p class="s-label">Selected Projects</p>', '<p class="s-label" data-i18n="work_label">Selected Projects</p>'],
  ['<h2 class="s-title"><span class="tl"><span>Work</span></span></h2>', '<h2 class="s-title"><span class="tl"><span data-i18n="work_title">Work</span></span></h2>'],
  ['<p class="pyear">Osnova | 08.2025 – 09.2025</p>', '<p class="pyear" data-i18n="p1_year">Osnova | 08.2025 – 09.2025</p>'],
  ['<h3 class="pname">Building brand awareness <br> through marketing & <br>social growth</h3>', '<h3 class="pname" data-i18n="p1_name">Building brand awareness <br> through marketing & <br>social growth</h3>'],
  ['<span class="wip-badge"><span class="wip-badge-dot"></span>Work in progress</span>', '<span class="wip-badge"><span class="wip-badge-dot"></span><span data-i18n="wip">Work in progress</span></span>'],
  ['<p class="pyear">Shakirov Studio | 08.2025 – Present</p>', '<p class="pyear" data-i18n="p2_year">Shakirov Studio | 08.2025 – Present</p>'],
  ['<h3 class="pname">Managing content to <br> boost digital engagement</h3>', '<h3 class="pname" data-i18n="p2_name">Managing content to <br> boost digital engagement</h3>'],
  
  ['<p class="s-label">My story</p>', '<p class="s-label" data-i18n="about_label">My story</p>'],
  ['<h2 class="s-title"><span class="tl"><span>About</span></span></h2>', '<h2 class="s-title"><span class="tl"><span data-i18n="about_title">About</span></span></h2>'],
  ['<p><strong>Motivated first-year Business student at Inha University</strong> with a strong interest in Artificial Intelligence and Marketing. Focused on building brand awareness and creating effective strategies to engage target audiences.</p>', '<p data-i18n="bio_p1"><strong>Motivated first-year Business student at Inha University</strong> with a strong interest in Artificial Intelligence and Marketing. Focused on building brand awareness and creating effective strategies to engage target audiences.</p>'],
  ['<p><strong>I have experience in</strong> social media management, content creation, and marketing strategy, contributing ideas and analyzing audience feedback to improve results.</p>', '<p data-i18n="bio_p2"><strong>I have experience in</strong> social media management, content creation, and marketing strategy, contributing ideas and analyzing audience feedback to improve results.</p>'],
  ['<p>I am currently working as a <strong>Director at Shakirov Studio</strong>, where I develop marketing strategies to increase brand awareness. Previously, I worked as a <strong>Marketing Assistant at Osnova</strong> and as an <strong>Assistant Social Media Manager at Chotqol Sanatorium</strong>.</p>', '<p data-i18n="bio_p3">I am currently working as a <strong>Director at Shakirov Studio</strong>, where I develop marketing strategies to increase brand awareness. Previously, I worked as a <strong>Marketing Assistant at Osnova</strong> and as an <strong>Assistant Social Media Manager at Chotqol Sanatorium</strong>.</p>'],
  ['View CV', '<span data-i18n="view_cv">View CV</span>'],
  
  ['<h3 class="detail-h">Experience</h3>', '<h3 class="detail-h" data-i18n="exp_title">Experience</h3>'],
  ['<span class="ei-co">Shakirov Studio</span>', '<span class="ei-co" data-i18n="exp1_co">Shakirov Studio</span>'],
  ['<span class="ei-role">Director</span>', '<span class="ei-role" data-i18n="exp1_role">Director</span>'],
  ['<span class="ei-yr">09.2025 - Now</span>', '<span class="ei-yr" data-i18n="exp1_yr">09.2025 - Now</span>'],
  ['<span class="ei-co">Osnova</span>', '<span class="ei-co" data-i18n="exp2_co">Osnova</span>'],
  ['<span class="ei-role">Marketing Assistant</span>', '<span class="ei-role" data-i18n="exp2_role">Marketing Assistant</span>'],
  ['<span class="ei-yr">08.2025 - 09.2025</span>', '<span class="ei-yr" data-i18n="exp2_yr">08.2025 - 09.2025</span>'],
  ['<span class="ei-co">Chotqol Sanatorium</span>', '<span class="ei-co" data-i18n="exp3_co">Chotqol Sanatorium</span>'],
  ['<span class="ei-role">Assistant Marketing Manager</span>', '<span class="ei-role" data-i18n="exp3_role">Assistant Marketing Manager</span>'],
  ['<span class="ei-yr">01.2024 - 05.2025</span>', '<span class="ei-yr" data-i18n="exp3_yr">01.2024 - 05.2025</span>'],
  
  ['<h3 class="detail-h">Skills</h3>', '<h3 class="detail-h" data-i18n="skills_title">Skills</h3>'],
  ['<span class="skill-pill">Artificial Intelligence</span>', '<span class="skill-pill" data-i18n="mq_ai">Artificial Intelligence</span>'],
  ['<span class="skill-pill">Marketing Strategy</span>', '<span class="skill-pill" data-i18n="mq_marketing">Marketing Strategy</span>'],
  ['<span class="skill-pill">Social Media Management</span>', '<span class="skill-pill" data-i18n="mq_social">Social Media Management</span>'],
  ['<span class="skill-pill">Content Creation</span>', '<span class="skill-pill" data-i18n="mq_content">Content Creation</span>'],
  ['<span class="skill-pill">Brand Growth</span>', '<span class="skill-pill" data-i18n="mq_brand">Brand Growth</span>'],
  ['<span class="skill-pill">Audience Engagement</span>', '<span class="skill-pill" data-i18n="mq_audience">Audience Engagement</span>'],
  ['<span class="skill-pill">Digital Marketing</span>', '<span class="skill-pill" data-i18n="mq_digital">Digital Marketing</span>'],
  ['<span class="skill-pill">AI Tools</span>', '<span class="skill-pill" data-i18n="mq_tools">AI Tools</span>'],
  ['<span class="skill-pill">Automation</span>', '<span class="skill-pill" data-i18n="mq_automation">Automation</span>'],
  ['<span class="skill-pill">Creative Thinking</span>', '<span class="skill-pill" data-i18n="mq_creative">Creative Thinking</span>'],
  ['<span class="skill-pill">Team Collaboration</span>', '<span class="skill-pill" data-i18n="mq_team">Team Collaboration</span>'],
  ['<span class="skill-pill">Communication</span>', '<span class="skill-pill" data-i18n="mq_communication">Communication</span>'],
  ['<span class="skill-pill">Market Research</span>', '<span class="skill-pill" data-i18n="mq_research">Market Research</span>'],
  
  ['<p class="s-label">Get in touch</p>', '<p class="s-label" data-i18n="contact_label">Get in touch</p>'],
  ['<span class="tl"><span>Say hi!</span></span>', '<span class="tl"><span data-i18n="contact_hi">Say hi!</span></span>'],
  ['<p>Tashkent, Uzbekistan</p>', '<p data-i18n="contact_location">Tashkent, Uzbekistan</p>'],
  ['<a href="mailto:ilhomjonshakirov7@gmail.com" data-cursor="hi">Email</a>', '<a href="mailto:ilhomjonshakirov7@gmail.com" data-cursor="hi" data-i18n="footer_email">Email</a>'],
  ['<p class="copy">© 2026 Ilkhom Shakirov · AI Specialist · Marketing Manager</p>', '<p class="copy" data-i18n="footer_copy">© 2026 Ilkhom Shakirov · AI Specialist · Marketing Manager</p>']
];

for (let i = 0; i < replacements.length; i++) {
    const search = replacements[i][0];
    const replace = replacements[i][1];
    html = html.split(search).join(replace);
}

const target = ">Let" + "'" + "s talk <svg";
const replaceStr = '><span data-i18n="contact_talk">Let' + "'" + 's talk</span> <svg';
html = html.replace(target, replaceStr);

// 8. Replace hardcoded cursor hover scripts with dynamic translated ones
const cursorHoverReplacement = `    // Hover states - interactive targets
    document.querySelectorAll('a, button, .pcard:not(.pcard--wip)').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('is-hovering');
        const t = document.getElementById('cursorLabelText');
        if (t && el.dataset.cursor === 'hi') {
          t.style.opacity = '0';
          const hiText = (typeof translations !== 'undefined' && translations[window.currentLang] && translations[window.currentLang]['contact_hi']) 
            ? translations[window.currentLang]['contact_hi'] 
            : 'Say hi!';
          setTimeout(() => { t.textContent = hiText + ' 👋'; t.style.opacity = '1'; }, 120);
        }
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('is-hovering');
        const t = document.getElementById('cursorLabelText');
        if (t) {
          const guestText = { en: 'Guest', ru: 'Гость', uz: 'Mehmon' }[window.currentLang] || 'Guest';
          if (t.textContent !== guestText) {
            t.style.opacity = '0';
            setTimeout(() => { t.textContent = guestText; t.style.opacity = '1'; }, 120);
          }
        }
      });
    });`;

// Use regular expression to match either LF or CRLF safely
const hoverRegex = /    \/\/ Hover states - interactive targets[\s\S]*?\}\);\r?\n\s*\}\);/;
html = html.replace(hoverRegex, cursorHoverReplacement);

fs.writeFileSync('index.html', html, 'utf8');
fs.copyFileSync('translations.js', 'public/translations.js');
console.log('Successfully compiled premium updates into index.html and synced translations.js!');
