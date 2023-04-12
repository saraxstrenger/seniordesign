import pandas as pd
import random

def noisey_copy(diff):
  noise = random.randint(-1, 1)
  diff_prime = max(diff + noise, 1)
  diff_prime = min(diff_prime, 5)
  return diff_prime
  
df = pd.read_csv('test_evaluations.csv')
df['workload1'] = df['difficulty'].apply(noisey_copy)
df['workload2'] = df['difficulty'].apply(noisey_copy)
df['workload3'] = df['difficulty'].apply(noisey_copy)
df['workload4'] = df['difficulty'].apply(noisey_copy)

#df.to_csv('test_evaluations.csv', index=False)