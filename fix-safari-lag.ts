import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace large blurs with radial gradients
content = content.replace(
  /className="absolute top-\[-10%\] left-\[-20%\] w-\[600px\] h-\[600px\] rounded-full bg-web-lime\/5 blur-\[130px\] pointer-events-none z-0"/g,
  'className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(202,246,132,0.1)_0%,transparent_70%)] pointer-events-none z-0"'
);

content = content.replace(
  /className="absolute top-\[35%\] right-\[-15%\] w-\[500px\] h-\[500px\] rounded-full bg-web-green\/5 blur-\[120px\] pointer-events-none z-0"/g,
  'className="absolute top-[35%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(31,70,52,0.08)_0%,transparent_70%)] pointer-events-none z-0"'
);

content = content.replace(
  /className="absolute bottom-\[-10%\] left-\[10%\] w-\[600px\] h-\[600px\] rounded-full bg-web-lime\/5 blur-\[130px\] pointer-events-none z-0"/g,
  'className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(202,246,132,0.1)_0%,transparent_70%)] pointer-events-none z-0"'
);

// Remove backdrop blur classes
content = content.replace(/backdrop-blur-sm/g, '');
content = content.replace(/backdrop-blur-md/g, '');

// Smaller blurs in specific cards
content = content.replace(/bg-web-lime\/5 rounded-full blur-2xl/g, 'bg-[radial-gradient(circle,rgba(202,246,132,0.15)_0%,transparent_70%)] rounded-full');
content = content.replace(/bg-web-lime\/5 rounded-full blur-3xl/g, 'bg-[radial-gradient(circle,rgba(202,246,132,0.15)_0%,transparent_70%)] rounded-full');
content = content.replace(/bg-web-green\/5 rounded-full blur-3xl/g, 'bg-[radial-gradient(circle,rgba(31,70,52,0.1)_0%,transparent_70%)] rounded-full');

fs.writeFileSync('src/App.tsx', content);
