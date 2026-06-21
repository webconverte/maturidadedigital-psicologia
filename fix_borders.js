const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/border-web-dark\/80/g, 'border-slate-200');
fs.writeFileSync('src/App.tsx', code);
