import os
import re
import time
from bs4 import BeautifulSoup, Comment
from deep_translator import GoogleTranslator

LANGUAGES = {'fr': 'french', 'es': 'spanish', 'ar': 'arabic'}

NAV_JS = """
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('select').forEach(function(select) {
    select.classList.add('notranslate');
    select.setAttribute('translate', 'no');
    select.addEventListener('change', function(e) {
      var targetLang = 'en';
      var val = e.target.value.toLowerCase();
      var txt = e.target.options[e.target.selectedIndex].text.toLowerCase();
      if (val.includes('fr') || txt.includes('fr')) targetLang = 'fr';
      else if (val.includes('es') || txt.includes('es')) targetLang = 'es';
      else if (val.includes('ar') || txt.includes('ar')) targetLang = 'ar';
      
      var path = window.location.pathname;
      var segments = path.split('/').filter(Boolean);
      var filename = 'index.html';
      if (segments.length > 0 && segments[segments.length - 1].endsWith('.html')) {
        filename = segments.pop();
      }
      if (segments.length > 0 && ['fr', 'es', 'ar'].includes(segments[segments.length - 1])) {
        segments.pop();
      }
      var basePath = '/' + segments.join('/');
      if (basePath === '/') basePath = '';
      
      var newUrl = targetLang === 'en' ? (basePath + '/' + filename) : (basePath + '/' + targetLang + '/' + filename);
      window.location.href = newUrl.replace(/\/\//g, '/');
    });
  });
});
</script>
"""

def get_all_unique_strings(html_files):
    unique_texts = set()
    for file_name in html_files:
        with open(file_name, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            for string_node in soup.find_all(string=True):
                if isinstance(string_node, Comment): continue
                parent = string_node.parent
                if not parent or parent.name in ['script', 'style', 'title', 'meta', 'head', 'noscript', 'code', 'svg', 'path']: continue
                if parent.name == 'select' or parent.find_parent('select') or parent.find_parent(class_=re.compile('notranslate')): continue
                
                text = str(string_node).strip()
                if text and len(text) > 1 and not text.isdigit() and not text.startswith('http'):
                    unique_texts.add(text)
    return list(unique_texts)

def build_translation_mapping(texts_list, lang_code):
    translator = GoogleTranslator(source='en', target=lang_code)
    mapping = {}
    chunk_size = 15 # On réduit la taille des paquets
    
    print(f"\n---> Début de la traduction vers {lang_code.upper()} ({len(texts_list)} phrases au total)")
    
    for i in range(0, len(texts_list), chunk_size):
        chunk = texts_list[i:i+chunk_size]
        print(f"   ⏳ Traduction du paquet {i//chunk_size + 1}...")
        try:
            translated_chunk = translator.translate_batch(chunk)
            for orig, trans in zip(chunk, translated_chunk): 
                mapping[orig] = trans
            print("   ✅ Paquet réussi.")
            time.sleep(2) # Pause obligatoire de 2 secondes pour calmer Google
        except Exception as e:
            print(f"   ⚠️ ALERTE GOOGLE BATCH : {e}")
            print("   🔄 Passage en mode phrase par phrase avec pause...")
            for item in chunk:
                try:
                    mapping[item] = translator.translate(item)
                    time.sleep(1.5)
                except Exception as ex:
                    print(f"   ❌ ÉCHEC TOTAL pour la phrase : '{item[:30]}...' -> Erreur: {ex}")
                    mapping[item] = item
    return mapping

def process_all():
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and os.path.isfile(f)]
    
    for file_name in html_files:
        with open(file_name, 'r', encoding='utf-8') as f:
            content = f.read()
        # Sécurité ultime contre le mot "html" en haut
        content = re.sub(r'^[\s\S]*?(?=<html|<HTML)', '<!DOCTYPE html>\n', content)
        with open(file_name, 'w', encoding='utf-8') as f:
            f.write(content)

    unique_texts = get_all_unique_strings(html_files)

    for lang_code in LANGUAGES.keys():
        os.makedirs(lang_code, exist_ok=True)
        mapping = build_translation_mapping(unique_texts, lang_code)

        for file_name in html_files:
            with open(file_name, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')

            head = soup.find('head')
            if head:
                for b in head.find_all('base'): b.decompose()
                head.insert(0, soup.new_tag('base', href='../'))

            html_tag = soup.find('html')
            if html_tag:
                html_tag['lang'] = lang_code
                html_tag['dir'] = 'rtl' if lang_code == 'ar' else 'ltr'

            for string_node in soup.find_all(string=True):
                if isinstance(string_node, Comment): continue
                parent = string_node.parent
                if not parent or parent.name in ['script', 'style', 'title', 'meta', 'head', 'noscript', 'code', 'svg', 'path']: continue
                if parent.name == 'select' or parent.find_parent('select') or parent.find_parent(class_=re.compile('notranslate')): continue

                raw_text = str(string_node)
                text = raw_text.strip()
                if text in mapping and mapping[text] != text:
                    translated_text = mapping[text]
                    leading_ws = raw_text[:len(raw_text) - len(raw_text.lstrip())]
                    trailing_ws = raw_text[len(raw_text.rstrip()):]
                    string_node.replace_with(f"{leading_ws}{translated_text}{trailing_ws}")

            for script in soup.find_all('script'):
                if script.string and ('googleTranslate' in script.string or 'lang.js' in str(script)):
                    script.decompose()
            body = soup.find('body')
            if body:
                body.append(BeautifulSoup(NAV_JS, 'html.parser'))

            output_path = os.path.join(lang_code, file_name)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            
            with open(output_path, 'r', encoding='utf-8') as f:
                content = f.read()
            content = re.sub(r'^[\s\S]*?(?=<html|<HTML)', '<!DOCTYPE html>\n', content)
            content = re.sub(r'<body>\s*html\s*', '<body>\n', content, flags=re.IGNORECASE)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)

if __name__ == '__main__':
    process_all()
    print("\n✅ Terminé !")
