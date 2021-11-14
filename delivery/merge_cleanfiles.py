import pandas as pd
import re
from bs4 import BeautifulSoup
import requests

df1 = pd.read_csv('temp_data/cleanfile.csv')
df2 = pd.read_csv('temp_data/to_clean.csv')

df = df1.merge(df2, how='outer')
df.to_csv('clean_data/goodreads_clean.csv')