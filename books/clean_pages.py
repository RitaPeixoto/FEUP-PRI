import pandas as pd
import time
import re
from bs4 import BeautifulSoup
import requests

df = pd.read_csv('raw_data/GoodReads_100k_books.csv').dropna()

to_clean = df.loc[df['pages'] == 0]
to_clean = to_clean[['link']][:5]

def getProperties(url):
    try:
        ourUrl = requests.get(url)
        soup = BeautifulSoup(ourUrl.text, 'html.parser')
        pages = soup.find("meta", property="books:page_count")

        if pages:
            if(int(pages["content"]) != 0):
                df.loc[df.link == url, 'pages'] = int(pages["content"])
    except:
        return False

    return True

to_clean[to_clean['link'].apply(getProperties)]

df.to_csv('clean_data/goodreads_clean_pages.csv', encoding='utf-8')