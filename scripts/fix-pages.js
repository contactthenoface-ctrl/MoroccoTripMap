const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Supprime les anciens scripts cassés (lang.js)
  content = content.replace(/<script src="\.\/lang\.js"><\/script>\s*/g, '');

  // Supprime l'ancien bloc inline de redirection par langue
  content = content.replace(
    /<script>\s*document\.addEventListener\('DOMContentLoaded', function\(\) \{\s*document\.querySelectorAll\('select'\)[\s\S]*?window\.location\.href = newUrl\.replace[\s\S]*?<\/script>\s*/g,
    ''
  );

  // Supprime les anciens includes i18n.js
  content = content.replace(/<script src="i18n\.js"><\/script>\s*/g, '');
  content = content.replace(/<script src="js\/i18n\.js"><\/script>\s*/g, '');

  // Empêche le bandeau natif de traduction de Chrome
  if (!content.includes('name="google" content="notranslate"')) {
    content = content.replace('<head>', '<head>\n<meta name="google" content="notranslate">');
  }

 // Ajoute translate.js s'il n'est pas déjà présent
  if (!content.includes('js/translate.js')) {
    content = content.replace('</body>', '  <script src="js/translate.js"></script>\n</body>');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`✔ Corrigé : ${file}`);
  }
});
