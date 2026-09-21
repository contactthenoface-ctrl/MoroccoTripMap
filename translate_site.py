import os
import re
import time
from bs4 import BeautifulSoup, Comment
from deep_translator import GoogleTranslator, MyMemoryTranslator

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

def clean_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'^[\s\S]*?(?=<html|<HTML)', '<!DOCTYPE html>\n', content)
    content = re.sub(r'<body>\s*html\s*', '<body>\n', content, flags=re.IGNORECASE)
    content = re.sub(r'</head>\s*html\s*<body', '</head>\n<body', content, flags=re.IGNORECASE)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def get_all_unique_strings(html_files):
    unique_texts = set()
    for file_name in html_files:
        with open(file_name, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

        title = soup.find('title')
        if title and title.string:
            t = title.string.strip()
            if t: unique_texts.add(t)

        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            d = meta_desc['content'].strip()
            if d: unique_texts.add(d)

        for string_node in soup.find_all(string=True):
            if isinstance(string_node, Comment): continue
            parent = string_node.parent
            if not parent or parent.name in ['script', 'style', 'title', 'meta', 'head', 'noscript', 'code', 'svg', 'path']: continue
            if parent.name == 'select' or parent.find_parent('select') or parent.find_parent(class_=re.compile('notranslate')): continue

            text = str(string_node).strip()
            if text and len(text) > 1 and not text.isdigit() and not text.startswith('http') and not text.startswith('data:'):
                unique_texts.add(text)

        for inp in soup.find_all(['input', 'textarea']):
            if inp.get('placeholder'):
                p_text = inp['placeholder'].strip()
                if p_text and len(p_text) > 1 and not p_text.isdigit():
                    unique_texts.add(p_text)

    return list(unique_texts)

def translate_single_text(text, lang_code):
    try:
        translator = GoogleTranslator(source='auto', target=lang_code)
        res = translator.translate(text)
        if res and res != text:
            return res
    except Exception:
        pass

    time.sleep(1)
    try:
        translator = GoogleTranslator(source='auto', target=lang_code)
        res = translator.translate(text)
        if res: return res
    except Exception:
        pass

    try:
        translator = MyMemoryTranslator(source='en', target=lang_code)
        res = translator.translate(text)
        if res: return res
    except Exception:
        pass

    return text

def build_translation_mapping(texts_list, lang_code):
    mapping = {}
    total = len(texts_list)
    print(f"\n🌍 [ {lang_code.upper()} ] Traduction de {total} phrases uniques...")

    for idx, item in enumerate(texts_list):
        translated = translate_single_text(item, lang_code)
        mapping[item] = translated

        display_orig = (item[:25] + '..') if len(item) > 25 else item
        display_trans = (translated[:25] + '..') if len(translated) > 25 else translated
        print(f"   [{idx+1}/{total}] {display_orig} ➔ {display_trans}")

        time.sleep(0.3)

    return mapping

def process_all():
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and os.path.isfile(f)]

    for f in html_files:
        clean_html_file(f)

    unique_texts = get_all_unique_strings(html_files)
    print(f"📌 {len(unique_texts)} phrases trouvées à traduire dans vos pages.")

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

            title = soup.find('title')
            if title and title.string and title.string.strip() in mapping:
                title.string.replace_with(mapping[title.string.strip()])

            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc and meta_desc.get('content') and meta_desc['content'].strip() in mapping:
                meta_desc['content'] = mapping[meta_desc['content'].strip()]

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

            for inp in soup.find_all(['input', 'textarea']):
                if inp.get('placeholder'):
                    p_text = inp['placeholder'].strip()
                    if p_text in mapping and mapping[p_text] != p_text:
                        inp['placeholder'] = mapping[p_text]

            for script in soup.find_all('script'):
                if script.string and ('googleTranslate' in script.string or 'lang.js' in str(script)):
                    script.decompose()

            body = soup.find('body')
            if body:
                body.append(BeautifulSoup(NAV_JS, 'html.parser'))

            output_path = os.path.join(lang_code, file_name)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write("<!DOCTYPE html>\n" + str(soup).strip())

            clean_html_file(output_path)

    print("\n🎉 Traduction terminée avec succès pour toutes les langues !")

if __name__ == '__main__':
    process_all()
