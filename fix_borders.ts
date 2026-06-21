import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/border-web-dark\/80/g, 'border-slate-200');

fs.writeFileSync('src/App.tsx', content);
