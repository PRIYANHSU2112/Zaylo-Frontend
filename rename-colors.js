const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\HP\\Downloads\\Zaylo\\Frontend\\src';

const replacements = {
  'brand-green': 'brand-primary',
  'bg-white': 'bg-surface',
  'text-surface-dark': 'text-main',
  'text-slate-600': 'text-body',
  'text-slate-500': 'text-muted',
  'text-slate-400': 'text-muted',
  'border-grey-soft': 'border-border-subtle',
  'bg-grey-soft': 'bg-border-subtle',
  'shadow-green': 'shadow-primary'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [key, value] of Object.entries(replacements)) {
        if (content.includes(key)) {
          // ensure we don't accidentally replace partial words if it causes issues, but these are mostly tailwind classes
          content = content.split(key).join(value);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directory);
