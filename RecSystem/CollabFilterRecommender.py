import pandas as pd
from surprise import Reader, Dataset, KNNWithMeans
import argparse
import sqlite3
import json
import time
class CollabFilterRecommender():
  # fit the models. Consider functionizing if we add more columns
  def __init__(self, database_path):
    #NEED TO REPLACE THIS WITH THE PATH TO THE DATABASE, run .databases in sqlite3 to find the path on whichever computer is the 'server'
    conn = sqlite3.connect(database_path)
    eval_df = pd.read_sql_query('SELECT * FROM evaluations', conn)
    conn.close()
    diff_dict = {'user': [], 'item': [], 'rating': []}
    interest_dict = {'user': [], 'item': [], 'rating': []}
    workload1_dict = {'user': [], 'item': [], 'rating': []}
    workload2_dict = {'user': [], 'item': [], 'rating': []}
    workload3_dict = {'user': [], 'item': [], 'rating': []}
    workload4_dict = {'user': [], 'item': [], 'rating': []}
    users = []
    courses = []
    for row in eval_df.itertuples(index=False):
      user = row[4]
      if user == 'user':
        continue
      course = row[7] + ' ' + str(row[1])
      diff = row[5]
      interest = row[6]
      workload1 = row[8]
      workload2 = row[9]
      workload3 = row[10]
      workload4 = row[11]
      
      users.append(user)
      courses.append(course)
      diff_dict['rating'].append(diff)
      interest_dict['rating'].append(interest)
      workload1_dict['rating'].append(workload1)
      workload2_dict['rating'].append(workload2)
      workload3_dict['rating'].append(workload3)
      workload4_dict['rating'].append(workload4)
    
    diff_dict['user'] = users
    diff_dict['item'] = courses

    interest_dict['user'] = users
    interest_dict['item'] = courses

    workload1_dict['user'] = users
    workload1_dict['item'] = courses

    workload2_dict['user'] = users
    workload2_dict['item'] = courses

    workload3_dict['user'] = users
    workload3_dict['item'] = courses

    workload4_dict['user'] = users
    workload4_dict['item'] = courses
    
    
    diff_df = pd.DataFrame(diff_dict)
    interest_df = pd.DataFrame(interest_dict)
    workload1_dict = pd.DataFrame(workload1_dict)
    workload2_dict = pd.DataFrame(workload2_dict)
    workload3_dict = pd.DataFrame(workload3_dict)
    workload4_dict = pd.DataFrame(workload4_dict)
    
    diff_reader = Reader(rating_scale=(1, 5))
    interest_reader = Reader(rating_scale=(1, 5))
    workload1_reader = Reader(rating_scale=(1, 5))
    workload2_reader = Reader(rating_scale=(1, 5))
    workload3_reader = Reader(rating_scale=(1, 5))
    workload4_reader = Reader(rating_scale=(1, 5))

    diff_data = Dataset.load_from_df(diff_df, diff_reader)
    interest_data = Dataset.load_from_df(interest_df, interest_reader)
    workload1_data = Dataset.load_from_df(workload1_dict, workload1_reader)
    workload2_data = Dataset.load_from_df(workload2_dict, workload2_reader)
    workload3_data = Dataset.load_from_df(workload3_dict, workload3_reader)
    workload4_data = Dataset.load_from_df(workload4_dict, workload4_reader)
    
    sim_options = {'name': 'cosine', 'user_based': False}
    
    diff_algo = KNNWithMeans(sim_options=sim_options, verbose=False)
    interest_algo = KNNWithMeans(sim_options=sim_options, verbose=False)
    workload1_algo = KNNWithMeans(sim_options=sim_options, verbose=False)
    workload2_algo = KNNWithMeans(sim_options=sim_options, verbose=False)
    workload3_algo = KNNWithMeans(sim_options=sim_options, verbose=False)
    workload4_algo = KNNWithMeans(sim_options=sim_options, verbose=False)
    
    diff_algo.fit(diff_data.build_full_trainset())
    interest_algo.fit(interest_data.build_full_trainset())
    workload1_algo.fit(workload1_data.build_full_trainset())
    workload2_algo.fit(workload2_data.build_full_trainset())
    workload3_algo.fit(workload3_data.build_full_trainset())
    workload4_algo.fit(workload4_data.build_full_trainset())
    
    self.algos = {
      'difficulty': diff_algo,
      'interest': interest_algo,
      'workload1': workload1_algo,
      'workload2': workload2_algo,
      'workload3': workload3_algo,
      'workload4': workload4_algo
    }
    
    
    
  def predict(self, student, course, prediction_type):
    algo = self.algos[prediction_type]
    res = algo.predict(student, course)
    if res.details['was_impossible']:
      return None
    return res.est


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('-p', '--path', type=str, required=True)
  parser.add_argument('-s', '--student', type=str)
  parser.add_argument('-c', '--course', type=str)
  parser.add_argument('-t', '--type', type=str, required=False)
  parser.add_argument('-a', '--all_predictions', required=False, action='store_true')
  args = parser.parse_args()

  if args.path is None:
    raise ValueError('You must specify the path to database file using -p (ex: -p database.db)')
  
  rec = CollabFilterRecommender(args.path)

  student = args.student
  course = args.course
  predict = args.type
  all_predictions = args.all_predictions

  prediction_types = ['difficulty', 'interest', 'workload1', 'workload2', 'workload3', 'workload4']

  if all_predictions is None:
    # give single prediction
    if predict is None:
      raise ValueError('You must either specify prediction type using -t (ex: -t difficulty) or use -a to get all predictions (ex: -a)')
    if predict not in prediction_types:
      raise ValueError('prediction arg needs to be "difficulty", "interest" or "workload1", "workload2", "workload3", "workload4"')
    res = rec.predict(student, course, predict)
      
    if res is None:
      raise ValueError('Error in getting prediction')
    
    print(res)
  else:
    # give all predictions
    results ={}
    for  prediction_type in prediction_types:
      rating = rec.predict(student, course, prediction_type)
      results[prediction_type] = rating
    
    json_results = json.dumps(results, separators=(',', ':'))
    print(json_results)
    time.sleep(1)


  return 0

if __name__ == '__main__':
  main()