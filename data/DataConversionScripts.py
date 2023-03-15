import pandas as pd

fns = ['test_evaluations.csv', 'test_courses.csv', 'test_students.csv', 'test_course_stats.csv']


for fn in fns:
  df = pd.read_csv(fn)
  fn2 = fn[:-4] + '.json'
  
  df.to_json(fn2, orient='records', lines=True)