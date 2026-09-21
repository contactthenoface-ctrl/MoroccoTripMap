import os
import json
import time
import re
from bs4 import BeautifulSoup, Comment
from deep_translator import GoogleTranslator, MyMemoryTranslator

LANGUAGES = ['fr', 'es', 'ar']

def get_all_unique_strings():
    html_files = [f for f in os.listdir('.') if f.endswith('.html') and os.path.isfile(f)]
    unique_texts = set()
    
    for file_name in html_files:
        with open(file_name, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

        title = soup.find('title')
        if title and title.string:
            t = title.string.strip()
            if t: unique_texts.add(t)

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
        res = GoogleTranslator(source='auto', target=lang_code).translate(text)
        if res and res != text: return res
    except Exception: pass

    time.sleep(0.5)
    try:
        res = MyMemoryTranslator(source='en', target=lang_code).translate(text)
        if res: return res
    except Exception: pass

    return text

def build_json():
    texts = get_all_unique_strings()
    print(f"📌 {len(texts)} phrases uniques trouvées.")
    
    database = {}
    
    for lang in LANGUAGES:
        print(f"\n🌍 Traduction vers [{lang.upper()}]...")
        lang_dict = {}
        for idx, t in enumerate(texts):
            translated = translate_single_text(t, lang)
            lang_dict[t] = translated
            print(f"  [{idx+1}/{len(texts)}] {t[:25]} ➔ {translated[:25]}")
            time.sleep(0.2)
        database[lang] = lang_dict

    with open('translations.json', 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=2)

    print("\n✅ Fichier 'translations.json' créé avec succès !")

if __name__ == '__main__':
    build_json()
