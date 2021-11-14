import pandas as pd

df = pd.read_csv('temp_data/reviews.csv')
df['A'].apply(lambda x: 2*x)
df.to_csv('clean_data/final_reviews.csv')