import pandas as pd
from sqlalchemy import create_engine

engine = create_engine('sqlite://', echo=False)

df = pd.read_csv('clean_data/goodreads_clean.csv')
df.to_sql('clean_data/schema', con=engine)