import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf8');

// Increment text-xs sm:text-sm -> text-sm sm:text-base
text = text.replace(/text-xs sm:text-sm/g, "text-sm sm:text-base");

// Increment text-sm sm:text-base -> text-base sm:text-lg
text = text.replace(/text-sm sm:text-base/g, "text-base sm:text-lg");

// Increment remaining text-xs to text-sm
// We have to be careful with things like text-xs-something
text = text.replace(/text-xs([ '"`])/g, "text-sm$1");

// Increment remaining text-sm to text-base
text = text.replace(/text-sm([ '"`])/g, "text-base$1");

// text-base to text-lg? No, only smaller texts.

fs.writeFileSync('src/App.tsx', text);

let radarText = fs.readFileSync('src/components/RadarChart.tsx', 'utf8');
// For radar chart, let's bump sizes too.
radarText = radarText.replace(/text-xs sm:text-sm/g, "text-sm sm:text-base");
radarText = radarText.replace(/text-xs([ '"`])/g, "text-sm$1");
radarText = radarText.replace(/text-sm([ '"`])/g, "text-base$1");
fs.writeFileSync('src/components/RadarChart.tsx', radarText);
