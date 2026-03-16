const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = walk(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const pagesDir = 'd:\\hspm-flask-mysql react\\src\\pages';
const files = walk(pagesDir);
const results = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.match(/navigate\(|Navigate to=|<Link to|Navigate\s+to/)) {
      results.push(`${file.replace(pagesDir, '')}:${i + 1}: ${line.trim()}`);
    }
  });
}
fs.writeFileSync('d:\\hspm-flask-mysql react\\nav_flow.txt', results.join('\n'));
console.log('Saved ' + results.length + ' matches');
