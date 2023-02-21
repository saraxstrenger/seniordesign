import pandas as pd
from surprise import Reader, Dataset, KNNWithMeans
class CollabFilterRecommender():
  # fit the models. Consider functionizing if we add more columns
  def __init__(self):
    eval_fn = '../data/test_evaluations.csv'
    eval_df = pd.read_csv(eval_fn)
    diff_dict = {'user': [], 'item': [], 'rating': []}
    interest_dict = {'user': [], 'item': [], 'rating': []}
    users = []
    items = []
    for row in eval_df.itertuples(index=False):
      user = row[0]
      item = row[1]
      diff = row[2]
      interest = row[3]
      
      users.append(user)
      items.append(item)
      diff_dict['rating'].append(diff)
      interest_dict['rating'].append(interest)
    
    diff_dict['user'] = users
    interest_dict['user'] = users
    diff_dict['item'] = items
    interest_dict['item'] = items
    
    diff_df = pd.DataFrame(diff_dict)
    interest_df = pd.DataFrame(interest_dict)
    
    diff_reader = Reader(rating_scale=(1, 5))
    interest_reader = Reader(rating_scale=(1, 5))
    
    diff_data = Dataset.load_from_df(diff_df, diff_reader)
    interest_data = Dataset.load_from_df(interest_df, interest_reader)
    
    sim_options = {'name': 'cosine', 'user_based': False}
    
    diff_algo = KNNWithMeans(sim_options=sim_options)
    interest_algo = KNNWithMeans(sim_options=sim_options)
    
    diff_algo.fit(diff_data.build_full_trainset())
    interest_algo.fit(interest_data.build_full_trainset())
    
    self.diff_algo = diff_algo
    self.interest_algo = interest_algo
  
  # predicts the difficulty score of student for course
  def predict_difficulty(self, student, course):
    res = self.diff_algo.predict(student, course)
    if res.details['was_impossible']:
      return None
    return res.est
  
  # predicts the interest score of student for course
  def predict_interest(self, student, course):
    res = self.interest_algo.predict(student, course)
    if res.details['was_impossible']:
      return None
    return res.est


def main():
  rec = CollabFilterRecommender()
  print(rec.predict_difficulty('s10', 'CIS 2400'))

if __name__ == '__main__':
  main()