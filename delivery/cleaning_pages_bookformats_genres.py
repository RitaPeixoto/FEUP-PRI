import pandas as pd

df = pd.DataFrame({'E': [1, 2, 3], 'F': [4, 5, 6]})
df.to_csv('temp_data/cleanfile.csv')