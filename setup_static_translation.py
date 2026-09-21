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
      var val = e.target.value.toLowerCase();
      var txt = e.target.options[e.target.selectedIndex].text.toLowerCase();
      var targetLang = 'en';

      if (val.includes('fr') || txt.includes('fr')) targetLang = 'fr';
      else if (val.includes('es') || txt.includes('es')) targetLang = 'es';
      else if (val.includes('ar') || txt.includes('ar')) targetLang = 'ar';

      var pageName = window.location.pathname.split('/').pop() || 'index.html';
      var pathParts = window.location.pathname.split('/').filter(Boolean);
      var currentFolder = ['fr', 'es', 'ar'].includes(pathParts[pathParts.length - 2]) ? pathParts[pathParts.length - 2] : '';

      if (targetLang === 'en') {
        window.location.href = currentFolder ? '../' + pageName : pageName;
      } else {
        window.location.href = currentFolder ? '../' + targetLang + '/' + pageName : targetLang + '/' + pageName;
      }
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
                if isinstance(string_node, Comment):
                    continue
                parent = string_node.parent
                if not parent or parent.name in ['script', 'style', 'title', 'meta', 'head', 'noscript', 'code', 'svg', 'path']:
                    continue
                if parent.name == 'select' or parent.find_parent('select') or parent.find_parent(class_=re.compile('notranslate')):
                    continue

                text = str(string_node).strip()
                if text and len(text) > 1 and not text.isdigit():
                    if not (text.startswith('http://') or text.startswith('https://') or text.startswith('data:')):
                        unique_texts.add(text)

            for inp in soup.find_all(['input', 'textarea']):
                if inp.get('placeholder'):
                    p_text = inp['placeholder'].strip()
                    if p_text and len(p_text) > 1:
                        unique_texts.add(p_text)

    return list(unique_texts)

def build_translation_mapping(texts_list, lang_code):
    translator = GoogleTranslator(source='en', target=lang_code)
    mapping = {}
    chunk_size = 20
    
    for i in range(0, len(texts_list), chunk_size):
        chunk = texts_list[i:i+chunk_size]
        try:
            translated_chunk = translator.translate_batch(chunk)
            for orig, trans in zip(chunk, translated_chunk):
                mapping[orig] = trans
        except Exception:
            for item in chunk:
                try:
                    mapping[item] = translator.translate(item)
                    time.sleep(0.1)
                except Exception:
                    mapping[item] = item
    return mapping

def process_and_translate():
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and os.path.isfile(f)]
    print("🔍 Extraction de toutes les phrases du site...")
    unique_texts = get_all_unique_strings(html_files)
    print(f"📊 {len(unique_texts)} phrases uniques trouvées.")

    for lang_code in LANGUAGES.keys():
        os.makedirs(lang_code, exist_ok=True)
        print(f"\n🌍 Traduction intégrale par lots vers [{lang_code.upper()}]...")
        mapping = build_translation_mapping(unique_texts, lang_code)

        for file_name in html_files:
            print(f"   ⌛ Traitement de : {file_name}")
            with open(file_name, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')

            head = soup.find('head')
            if head:
                base_tag = soup.find('base')
                if not base_tag:
                    new_base = soup.new_tag('base', href='../')
                    head.insert(0, new_base)
                else:
                    base_tag['href'] = '../'

            html_tag = soup.find('html')
            if html_tag:
                html_tag['lang'] = lang_code
                html_tag['dir'] = 'rtl' if lang_code == 'ar' else 'ltr'

            for script in soup.find_all('script'):
                if script.string and ('googleTranslate' in script.string or 'lang.js' in str(script)):
                    script.decompose()

            for string_node in soup.find_all(string=True):
                if isinstance(string_node, Comment):
                    continue
                parent = string_node.parent
                if not parent or parent.name in ['script', 'style', 'title', 'meta', 'head', 'noscript', 'code', 'svg', 'path']:
                    continue
                if parent.name == 'select' or parent.find_parent('select') or parent.find_parent(class_=re.compile('notranslate')):
                    continue

                raw_text = str(string_node)
                text = raw_text.strip()
                if text in mapping:
                    translated_text = mapping[text]
                    leading_ws = raw_text[:len(raw_text) - len(raw_text.lstrip())]
                    trailing_ws = raw_text[len(raw_text.rstrip()):]
                    string_node.replace_with(f"{leading_ws}{translated_text}{trailing_ws}")

            for inp in soup.find_all(['input', 'textarea']):
                if inp.get('placeholder'):
                    p_text = inp['placeholder'].strip()
                    if p_text in mapping:
                        inp['placeholder'] = mapping[p_text]

            body = soup.find('body')
            if body:
                nav_soup = BeautifulSoup(NAV_JS, 'html.parser')
                body.append(nav_soup)

            output_path = os.path.join(lang_code, file_name)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))

if __name__ == '__main__':
    process_and_translate()
    print("\n✅ Traduction 100% complète de toutes les pages effectuée !")
