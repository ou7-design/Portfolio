const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix known corruption patterns
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

// 3. Fix nav spacing & inject dropdown if missing
if (!html.includes('langDropdown')) {
    // Add gap to nav-right
    html = html.replace('<div class="nav-right">', '<div class="nav-right" style="gap: 20px;">');
    
    const themeBtnTarget = '<button class="theme-btn" id="themeBtn" aria-label="Toggle colour scheme">';
    const dropdownHtml = `
      <div style="display: flex; gap: 10px; align-items: center;">
        <div class="lang-dropdown" id="langDropdown">
          <button class="theme-btn" id="langToggle">
            <span id="langCurrent">EN</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top:1px"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="lang-menu" id="langMenu">
            <button data-lang="en">EN</button>
            <button data-lang="ru">RU</button>
            <button data-lang="uz">UZ</button>
          </div>
        </div>
        `;
    
    if (html.includes(themeBtnTarget) && !html.includes('id="langDropdown"')) {
        html = html.replace(themeBtnTarget, dropdownHtml + themeBtnTarget);
        // Add the closing div for the flex container
        const closingTarget = `</button>\n    </div>\n  </nav>`;
        const closingReplacement = `</button>\n      </div>\n    </div>\n  </nav>`;
        html = html.replace(closingTarget, closingReplacement);
    }
}

// 4. Add dropdown CSS
if (!html.includes('.lang-dropdown { position: relative; }')) {
    const cssTarget = `.theme-btn .t-icon { font-size: 13px; }`;
    const cssReplacement = cssTarget + `

    .lang-dropdown { position: relative; }
    .lang-menu {
      position: absolute;
      top: 100%; right: 0;
      margin-top: 8px;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      min-width: 70px;
    }
    .lang-dropdown.open .lang-menu {
      opacity: 1; visibility: visible; transform: translateY(0);
    }
    .lang-menu button {
      background: none; border: none;
      color: var(--muted);
      padding: 10px 15px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      cursor: none;
      transition: background 0.2s, color 0.2s;
      text-align: center;
      letter-spacing: 0.08em;
    }
    .lang-menu button:hover { background: var(--bg); color: var(--fg); }`;
    html = html.replace(cssTarget, cssReplacement);
}

// 5. Add Localization JS
if (!html.includes('const langDropdown = document.getElementById')) {
    const jsTarget = `  </script>\n  \n</body>\n</html>`;
    const jsReplacement = `
  /* ---- LOCALIZATION ---- */
  const langDropdown = document.getElementById('langDropdown');
  const langToggle = document.getElementById('langToggle');
  const langCurrent = document.getElementById('langCurrent');
  const langMenuBtns = document.querySelectorAll('#langMenu button');

  let currentLang = localStorage.getItem('lang') || 'en';
  if (typeof translations !== 'undefined' && !translations[currentLang]) currentLang = 'en';
  
  if (langCurrent) langCurrent.textContent = currentLang.toUpperCase();
  
  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    const cursorLabelText = document.getElementById('cursorLabelText');
    if (cursorLabelText && cursorLabelText.textContent !== 'Say hi! 👋') {
      const texts = { en: 'Guest', ru: 'Гость', uz: 'Mehmon' };
      cursorLabelText.textContent = texts[lang] || 'Guest';
    }
  }

  applyLanguage(currentLang);

  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      if (langDropdown) langDropdown.classList.remove('open');
    });
    langMenuBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        currentLang = lang;
        langCurrent.textContent = lang.toUpperCase();
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
      });
    });
  }
` + jsTarget;
    const idx = html.lastIndexOf('  </script>\n  \n</body>\n</html>');
    if (idx !== -1) {
        html = html.substring(0, idx) + jsReplacement;
    }
}

// Save the fixed HTML
fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html successfully!');
