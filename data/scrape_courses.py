import random
import csv
from bs4 import BeautifulSoup
import requests

url = 'https://catalog.upenn.edu/courses/'
response = requests.get(url)

soup = BeautifulSoup(response.content, 'html.parser')
links = soup.find_all('a')
# course_links = links[47:-16]
course_links = links[47:49]
courses = []

diff_weights = [0.15, 0.3, 0.3, 0.2, 0.05]
intr_weights = [0.15, 0.2, 0.3, 0.2, 0.15]

base = 'https://catalog.upenn.edu'
for tag in course_links:
    link = base + str(tag['href'])
    link_response = requests.get(link)
    link_soup = BeautifulSoup(link_response.content, 'html.parser')
    
    for bruh in link_soup.find_all('div', class_ = "courseblock"):
        s = []
        for course_div in bruh.find_all('p', class_ = "courseblocktitle noindent"):
            s.append(course_div.get_text())

        s.append(bruh.find_all('p', class_ = "courseblockextra noindent")[0].get_text())
        intr = random.choices([1, 2, 3, 4, 5], weights=intr_weights, k=1)[0]
        diff = random.choices([1, 2, 3, 4, 5], weights=diff_weights, k=1)[0]
        s.append(intr)
        s.append(diff)
        courses.append(s)

filename = "course_catalog.csv"
courses_header = ["id", "courseDescription", "interest", "difficulty"]
with open(filename, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(courses_header)
    writer.writerows(courses)