import pandas as pd

# fns = ['test_evaluations.csv', 'test_courses.csv', 'test_students.csv', 'test_course_stats.csv']

fns = ["test_courses.json"]
for fn in fns:
  df = pd.read_json(fn)
  fn2 = fn[:-5] + '_reformatted.json'
  df["course_id"] = " ".join(df["course_id"].split(" ")[0:1])
  df.to_json(fn2, orient='records', lines=True)