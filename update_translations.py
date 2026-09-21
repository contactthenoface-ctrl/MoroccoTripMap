import os
import json
import time
import re
from bs4 import BeautifulSoup, Comment
from deep_translator import GoogleTranslator

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

def build_json():
    existing_db = {}
    if os.path.exists('translations.json'):
        try:
            with open('translations.json', 'r', encoding='utf-8') as f:
                existing_db = json.load(f)
        except Exception:
            existing_db = {}

    texts = get_all_unique_strings()
    print(f"📌 {len(texts)} phrases uniques trouvées.")
    
    database = {}
    
    for lang in LANGUAGES:
        lang_dict = existing_db.get(lang, {})
        translator = GoogleTranslator(source='auto', target=lang)
        
        for t in texts:
            if t not in lang_dict or not lang_dict[t]:
                try:
                    translated = translator.translate(t)
                    lang_dict[t] = translated if translated else t
                    time.sleep(0.1)
                except Exception:
                    lang_dict[t] = t
        
        database[lang] = lang_dict

    with open('translations.json', 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=2)

    print("✅ Dictionnaire translations.json mis à jour avec succès.")

if __name__ == '__main__':
    build_json()
