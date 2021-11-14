import pandas as pd

df = pd.DataFrame(data={'C': [1, 2, 3], 'D': [4, 5, 6]}, columns=['C', 'D'])
df.to_csv('temp_data/to_clean.csv')