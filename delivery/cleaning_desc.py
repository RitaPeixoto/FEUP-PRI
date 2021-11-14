import pandas as pd
import re
from bs4 import BeautifulSoup
import requests

df = pd.read_csv('GoodReads_100k_books.csv').dropna()

regex = re.compile('[Ä®™ÙŠØ©Ð§‡Œ¯ƒŸ]')

def regex_filter(val):
    if val != None:
        mo = re.search(regex, str(val))
        if mo != None:
            return True
        else:
            return False
    else:
        return False

to_clean = df[df['desc'].apply(regex_filter)]
to_clean["new_desc"] = ""

counter = 0 
def getNewDesc(url):
    global counter
    counter = counter + 1
    try:
        ourUrl = requests.get(str(url))
        soup = BeautifulSoup(ourUrl.text, 'html.parser')
        description = soup.findAll("div", {"id": "description"})

        if len(description) == 1:
            desc = description[0]
        else: 
            desc = description[1]

        spans = []
        for span in desc.select('span'):
            s = re.sub(r'<.*?>', '', str(span))
            spans.append(s)

        desc = ""
        if len(spans) == 1:
            desc = spans[0]
        elif len(spans) > 1:
            desc = spans[1]

        desc = " ".join(desc.split())
        to_clean.loc[to_clean.link == url, 'new_desc'] = desc

    except Exception as e:
        print(str(e) + " -> " + url)

    if counter % 50 == 0:
        to_clean.to_csv('to_clean.csv', encoding='utf-8', index=False)

    return True

to_clean_aux = to_clean.loc[to_clean.new_desc.isna()]
to_clean_aux['link'].apply(getNewDesc)

regex = re.compile('[ÙŠØÐ§‡Œœ¼Å¢¯ƒŸ할수]')
to_clean = to_clean[to_clean["new_desc"].apply(lambda x: regex_filter(x) == False)]
to_clean.to_csv('cleanfile_desc.csv', encoding='utf-8', index=False)