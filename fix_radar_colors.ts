import fs from 'fs';

let content = fs.readFileSync('src/components/RadarChart.tsx', 'utf8');

content = content.replace(/bg-web-dark\/45/g, 'bg-slate-50');
content = content.replace(/border-web-dark\/85/g, 'border-slate-200');
content = content.replace(/bg-web-lime/g, 'bg-[#88A65B]');
content = content.replace(/text-slate-300/g, 'text-slate-700');
content = content.replace(/text-web-lime/g, 'text-[#88A65B]');

fs.writeFileSync('src/components/RadarChart.tsx', content);
