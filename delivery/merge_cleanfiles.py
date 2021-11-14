import pandas as pd
import re
from bs4 import BeautifulSoup
import requests

df_init = pd.read_csv('cleanfile.csv')
df_desc = pd.read_csv('to_clean.csv')

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

df_init[df_init['desc'].apply(regex_filter)]

def updateDescriptions(url):
    new_desc =  df_desc.loc[df_desc.link == url, 'new_desc'].values[0]
    df_init.loc[df_init.link == url, 'desc'] = new_desc

df_desc['link'].apply(updateDescriptions)

regex = re.compile('[ÙŠØÐ§‡Œœ¼Å¢¯ƒŸ呉ž¥の愛人й±]')
df = df_init[df_init["desc"].apply(lambda x: regex_filter(x) == False)]

regex = re.compile('[¨©Ð‰¶§¤¡æ£®]')

def regex_filter(val):
    if val != None:
        mo = re.search(regex, str(val))
        if mo != None:
            return True
        else:
            return False
    else:
        return False

to_clean = df[df["author"].apply(regex_filter)]

counter = 0
def getAuthors(url):
    try: 
        ourUrl = requests.get(url)
        soup = BeautifulSoup(ourUrl.text, 'html.parser')
        names = [span.string for span in soup.find_all('span', itemprop="name")]
        if names != []:
            names = ','.join(names)
            names = " ".join(names.split())
            df.loc[df.link == url, 'author'] = names
    except Exception as e:
        print("something went wrong: " + url)
        print(e)

    global counter
    if counter % 50 == 0:
        df.to_csv('cleanfile_authors.csv', encoding='utf-8', index=False)

    print(counter)
    counter = counter + 1
    return True

to_clean['link'].apply(getAuthors)

regex = re.compile('[¢¶±©§ØëŒ£€]')
to_clean = df[df["title"].apply(regex_filter)]

counter = 0
def getTitle(url):
    try:
        ourUrl = requests.get(url)
        soup = BeautifulSoup(ourUrl.text, 'html.parser')
        title = soup.find("h1", {"id": "bookTitle"})
        title = re.sub(r'<.*?>', '', str(title))
        title = " ".join(title.split())
        if title != "":
            df.loc[df.link == url, 'title'] = title

    except Exception as e:
        print("something went wrong: " + url)
        print(e)

    global counter
    if counter % 50 == 0:
        df.to_csv('goodreads_clean.csv', encoding='utf-8', index=False)

    print(counter)
    counter = counter + 1

    return True

to_clean['link'].apply(getTitle)

def remove_extra_whitespaces(url):
    try:
        title = df.loc[df.link == url, 'title'].values[0]
        df.loc[df.link == url, 'title'] = " ".join(title.split())
        desc = df.loc[df.link == url, 'desc'].values[0]
        df.loc[df.link == url, 'desc'] = " ".join(desc.split())
        author = df.loc[df.link == url, 'author'].values[0]
        df.loc[df.link == url, 'author'] = " ".join(author.split())
    except:
        print(url)

df['link'].apply(remove_extra_whitespaces)
df.to_csv('goodreads_clean.csv', encoding='utf-8', index=False)