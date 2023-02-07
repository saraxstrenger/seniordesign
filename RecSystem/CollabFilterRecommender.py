from scipy import spatial
import pandas as pd
class CollabFilterRecommender():
  def __init__(self):
    eval_fn = '../data/test_evaluations.csv'
    eval_df = pd.read_csv(eval_fn)
    for row in eval_df.itertuples():
      #e_id, code, difficulty, interest
      pass
    pass
  
  # predicts the column score of student for course
  def predict(self, student, course, column):
    pass


def main():
  pass

if __name__ == '__main__':
  rec = CollabFilterRecommender()
  main()