const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(/вЂ”/g, '—')
     .replace(/рџ‘‹/g, '👋')
     .replace(/в—ђ/g, '◐')
     .replace(/в—‘/g, '◑')
     .replace(/В©/g, '©')
     .replace(/вњ¦/g, '✦');
fs.writeFileSync('index.html', c, 'utf8');
