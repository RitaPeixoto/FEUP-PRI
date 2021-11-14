import pandas as pd
from bs4 import BeautifulSoup
import requests

df = pd.read_csv('GoodReads_100k_books.csv').dropna()

to_clean = df.loc[df['pages'] == 0]
to_clean = to_clean[['link']]

def getProperties(url):
    try:
        ourUrl = requests.get(url)
        soup = BeautifulSoup(ourUrl.text, 'html.parser')
        pages = soup.find("meta", property="books:page_count")

        if pages:
            if(int(pages["content"]) != 0):
                df.loc[df.link == url, 'pages'] = int(pages["content"])
    except:
        print("something went wrong: " + url)

    return True

to_clean[to_clean['link'].apply(getProperties)]

df['bookformat'] = df['bookformat'].str.title()

def translateBookFormats(bf):
    if bf == 'Pasta Blanda' or bf == '120 X 190 Mm' or bf == 'Capa Comum' or bf == 'Sewn Paperback With Dust Jacket' or bf == 'Perfect' or bf == 'Perfect Paperback':
        return 'Paperback'
    elif bf == 'Hardback' or bf == 'Inbunden' or bf == 'Pasta Dura' or bf == 'Capa Dura' or bf == 'Relié' or bf == 'Over-Sized 12"W X 16"H Hardcover' or bf == 'Gebundene Ausgabe':
        return 'Hardcover'
    elif bf == 'Nook':
        return 'Ebook'
    elif bf == 'Paperback W/ Cd' or bf == 'Paperback With Cd Rom':
        return 'Paperback with Cd'
    elif bf == 'Audio Cassette' or bf == 'Audible Audio' or bf == 'Mp3 Cd' or bf == 'Audio Cd' or bf == 'Cd-Rom' or bf == 'Audio' or bf == 'Audio Play' or bf == 'Mp3 Book':
        return 'Audiobook'
    elif bf == 'Cloth':
        return 'Cloth Hardcover'
    elif bf == 'Board Books':
        return 'Board Book'
    elif bf == 'Misc. Supplies':
        return 'Miscellaneous Supplies'
    elif bf == 'Pocket' or bf == 'Taschenbuch':
        return 'Pocketbook'
    elif bf == 'Tarot Deck & Booklet':
        return 'Tarot Deck And Booklet'
    elif bf == 'Deck Of 78 Tarot Cards' or bf == '78 Card Tarot Deck':
        return 'Tarot Deck'
    elif bf == 'Tarot Cards & Book' or bf == 'Tarot Deck & Book':
        return 'Tarot Deck And Book'
    elif bf == 'Dvd (Ntsc)':
        return 'Dvd'
    elif bf == 'Comic':
        return 'Comics'
    elif bf == 'Board':
        return 'Board Book'
    elif bf == 'Textbook Binding':
        return 'Textbook'
    elif bf == 'Ã‚³Ãƒÿãƒƒã‚¯':
        return 'Brochure'
    elif bf == 'Boxed Collection' or bf == 'Boxed Set - Hardcover':
        return 'Boxed Set'
    else:
        return bf

df['bookformat'] = df['bookformat'].apply(translateBookFormats)
df = df.drop('isbn13', 1)

def removeDuplicates(genre):
    genre_list = genre.split(',')
    genre_list = list(dict.fromkeys(genre_list))
    return ','.join(genre_list)

df['genre'] = df['genre'].apply(removeDuplicates)
df.to_csv('cleanfile.csv', encoding='utf-8', index=False)