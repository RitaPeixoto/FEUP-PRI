import pandas as pd
import re

f = open("./csv/scraped_reviews.csv", encoding='utf8', mode="r")
f1 = open("./csv/reviews.csv",  encoding='utf8',mode="w")

first = True
for i in f:
    if first: 
        first = False
        f1.write('id;reviews'+'\n')
        continue 
    index = i.find(',')
    i = i.replace(';', ',').replace(',',';',1)
    f1.write(i)

df = pd.read_csv('./csv/reviews.csv', sep=';',  encoding='utf-8')

def remove_plicas(x):
    if len(x) > 0:
        if x[0] == '\'': 
            x = x.replace('\'', '',1)
        if len(x)>0:
            if x[len(x)-1] == '\'': 
                x = x[:-1]
    return x

df['reviews'] = df['reviews'].apply(lambda x: x.replace('[','').replace(']','').replace('\\','').replace('"',''))
df['reviews'] = df['reviews'].apply(remove_plicas)

regex = re.compile('[®™ÙŠØ©Ð§‡Œ¯ƒŸ]')
def regex_filter(val):
    if val:
        mo = re.search(regex, val)
        if mo:
            return True
        else:
            return False
    else:
        return False

indexes = df[df['reviews'].apply(regex_filter)].index

df.drop(indexes , inplace=True)
df.dropna(inplace=True)

df.to_csv('./csv/final_reviews.csv', index = False)