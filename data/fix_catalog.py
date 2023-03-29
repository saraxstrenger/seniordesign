import random
import csv
from bs4 import BeautifulSoup
import requests

import pandas as pd
courses = pd.read_csv('course_catalog.csv')

courses[['dept', 'courseNumber', 'courseTitle']] = courses['id'].str.split(' ', 2, expand=True)
courses["courseCode"] = courses['dept'].astype(str) +" "+ courses["courseNumber"]
courses['id'] = courses['courseCode']
courses = courses.drop(columns=['dept', 'courseNumber', 'courseCode'])
courses = courses.iloc[:, [0,4,1,2,3]]

courses.to_csv("course_catalog2.csv")