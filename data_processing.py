import pandas as pd

df = pd.read_csv('raw_data/GoodReads_100k_books.csv').dropna()
df.to_csv('clean_data/goodreads.csv')