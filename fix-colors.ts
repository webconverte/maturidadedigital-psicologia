import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Colors
content = content.replace(/bg-web-dark/g, 'bg-white');
content = content.replace(/bg-web-navy/g, 'bg-slate-50');
content = content.replace(/text-white/g, 'text-web-dark');
content = content.replace(/text-web-light/g, 'text-slate-700');
content = content.replace(/text-slate-300/g, 'text-slate-600');
content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/text-slate-200/g, 'text-slate-700');
content = content.replace(/text-slate-100/g, 'text-web-navy');
content = content.replace(/border-web-navy/g, 'border-slate-200');
content = content.replace(/border-slate-800/g, 'border-slate-300');
content = content.replace(/bg-slate-900/g, 'bg-slate-100');
content = content.replace(/bg-slate-950/g, 'bg-slate-50');
content = content.replace(/text-web-lime/g, 'text-web-green');
content = content.replace(/text-amber-300/g, 'text-amber-700');
content = content.replace(/text-amber-400/g, 'text-amber-600');
content = content.replace(/bg-\[\#432f10\]/g, 'bg-amber-100');
content = content.replace(/bg-\[\#412e14\]/g, 'bg-amber-50');
content = content.replace(/text-red-405/g, 'text-red-600');
content = content.replace(/fill-slate-100/g, 'fill-web-dark');
content = content.replace(/fill-web-lime/g, 'fill-web-green');

fs.writeFileSync('src/App.tsx', content);
