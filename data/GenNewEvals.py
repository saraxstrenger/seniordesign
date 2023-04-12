import pandas as pd
import random


def gen_random(x):
  return random.randint(1, 5)


def noisey_copy(diff):
  noise = random.randint(-1, 1)
  diff_prime = max(diff + noise, 1)
  diff_prime = min(diff_prime, 5)
  return diff_prime


students  = ['s' + str(i) for i in range(500)]
columns = ['id', 'department', 'number', 'difficulty', 'interest', 'semester', 'user', 'workload1', 'workload2', 'workload3', 'workload4', 'year']
courses_df = pd.read_csv('cis_catalog.csv')

eval_df = pd.DataFrame()

ids = []
numbers = []
semesters = []
years = []
users = []

for student in students:
  for _ in range(5):
    course_idx = random.randint(0, len(courses_df.index)- 1)
    course = courses_df.iloc[course_idx]
    number = course['id'][-5:-1]
    year = random.choice(['2020', '2021', '2022'])
    semester = random.choice(['Spring', 'Fall'])
    
    id = student + '_CIS_' + number + '_' + year + '_' + semester
    ids.append(id)
    numbers.append(number)
    semesters.append(semester)
    years.append(year)
    users.append(student)


eval_df['id'] = ids
eval_df['number'] = numbers
eval_df['semester'] = semesters
eval_df['year'] = years
eval_df['user'] = users

eval_df['difficulty'] = eval_df['id'].apply(gen_random)
eval_df['interest'] = eval_df['id'].apply(gen_random)
eval_df['department'] = eval_df['id'].apply(lambda x: 'CIS')

eval_df['workload1'] = eval_df['difficulty'].apply(noisey_copy)
eval_df['workload2'] = eval_df['difficulty'].apply(noisey_copy)
eval_df['workload3'] = eval_df['difficulty'].apply(noisey_copy)
eval_df['workload4'] = eval_df['difficulty'].apply(noisey_copy)

print(eval_df.head())

eval_df.to_csv('new_course_evals.csv', index=False)