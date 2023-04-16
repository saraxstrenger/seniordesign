import numpy as np
import heapq
from sentence_transformers import SentenceTransformer
import pandas as pd
import argparse
import pandas as pd
import boto3
from sklearn.neighbors import NearestNeighbors
"""
EmbeddingRecommender class can reccomend classes based on natural language interests and course names
Constructor takes in some iterable of course names (strings) in natural langauge 
For best results, don't include course codes (e.g. do "intro to computer architexture" not "CIS 240: Intro to Architecture")
"""

class EmbeddingRecommender():
    def __init__(self):
        # Load the embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.courses = pd.DataFrame()
        self.seen = set()
    
    def upload_courses_from_csv(self, filepath):
        courses_df = pd.read_csv(filepath)
        courses_df['embedding'] = courses_df.apply(self.emebd_row, axis=1)
        self.courses = courses_df
    
    def upload_course_subset_emebddings(self):
        courses_df = pd.read_csv('../data/small_catalog.csv')
        courses_df['embedding'] = courses_df.apply(self.emebd_row, axis=1)
        courses_df.to_csv('../data/small_catalog.csv', index=False)
        return
    
    def download_course_subset_from_local(self):
        df = pd.read_csv('../data/small_catalog.csv')
        df['embedding'] = df['embedding'].apply(lambda x: np.fromstring(x[1:-1], sep=' '))
        self.courses = df
    
    # read from S3 bucket and store in self.courses
    def download_course_subset_from_S3(self):
        self.courses = pd.DataFrame()
        s3 = boto3.client('s3')
        bucket_name = 'courseembeddings'
        file_name = 'small_catalog.csv'
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        df = pd.read_csv(obj['Body'])
        #convert str to np array
        df['embedding'] = df['embedding'].apply(lambda x: np.fromstring(x[1:-1], sep=' '))
        self.courses = df
    
    def emebd_row(self, row):
        course_name = row[1]
        course_description = row[2]
        course_embedding = self.embed_course(course_name, course_description)
        return course_embedding
    
    def embed_course(self, course_name, course_description):
        course_name_embedding = self.embed(course_name)
        course_description_embedding = self.embed(course_description)
        course_embedding = (0.3*course_name_embedding)  + (0.7*course_description_embedding)
        return course_embedding
   
    def embed(self, text):
        embedding = self.model.encode(text)
        return embedding
        
    # returns the k nearest neighbors to target from candidates, using euclidian distance 
    def k_nearest_neighbors(self, target, k):
        tgt_embedding = self.embed(target)
        
        X = np.array(self.courses.iloc[:, -1].tolist())
        nbrs = NearestNeighbors(n_neighbors=k, algorithm='auto', metric='euclidean').fit(X)
        distances, indices = nbrs.kneighbors([tgt_embedding])
        top_k = [str(self.courses.iloc[i]['code']) for i in indices[0]]
        return top_k
        
    # returns 3 reccomendations from class_titles which are semantically closest to job_title
    def emebedding_rec(self, interest):
        return self.k_nearest_neighbors(interest, 3)

    # prints reccomendations onto console (for light testing/debugging)
    def print_rec(self, interest):
        print(interest + ': ' + str(self.emebedding_rec(interest)))
    
    
def main():
    rec = EmbeddingRecommender()
    rec.download_course_subset_from_S3()
    
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--interest', type=str)
    parser.add_argument('-n', '--num_recs', type=int)
    args = parser.parse_args()
    interest = args.interest
    num_recs = args.num_recs
    
    res = rec.k_nearest_neighbors(interest, num_recs)
    resStr = "\n".join(res)
    print(resStr)
    return resStr

if __name__ == '__main__':
    main()

