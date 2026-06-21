import fs from 'fs';

let content = fs.readFileSync('src/components/RadarChart.tsx', 'utf8');

content = content.replace(/fill-slate-100/g, 'fill-[#041840]');
content = content.replace(/fill-web-lime/g, 'fill-[#88A65B]');
content = content.replace(/fill-slate-400/g, 'fill-[#64748B]');
content = content.replace(/stroke="\/\* stroke-web-navy \*\//g, 'stroke="rgba(0,0,0,0.1)"');
content = content.replace(/stroke="rgba\(255, 255, 255, 0.1\)"/g, 'stroke="rgba(0, 0, 0, 0.1)"');
content = content.replace(/stroke="rgba\(255, 255, 255, 0.05\)"/g, 'stroke="rgba(0, 0, 0, 0.05)"');

fs.writeFileSync('src/components/RadarChart.tsx', content);
