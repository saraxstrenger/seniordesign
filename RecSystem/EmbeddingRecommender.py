import numpy as np
import heapq
from sentence_transformers import SentenceTransformer
import pandas as pd
import argparse
import pandas as pd
import boto3
"""
EmbeddingRecommender class can reccomend classes based on natural language interests and course names
Constructor takes in some iterable of course names (strings) in natural langauge 
For best results, don't include course codes (e.g. do "intro to computer architexture" not "CIS 240: Intro to Architecture")
"""

class EmbeddingRecommender():
    def __init__(self):
        # Load the embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        # stored as (course_name, course_embedding) pairs
        self.courses = []
        self.seen = set()
    
    def upload_courses_from_csv(self, filepath):
        courses_df = pd.read_csv(filepath)
        courses_df['embedding'] = courses_df.apply(self.emebd_row, axis=1)
        self.courses = courses_df
    
    def upload_course_subset(self):
        courses_df = pd.read_csv('../data/small_catalog.csv')
        courses_df['embedding'] = courses_df.apply(self.emebd_row, axis=1)
        courses_df.to_csv('../data/small_catalog.csv', index=False)
        return
    
    # read from S3 bucket and store in self.courses
    def download_course_subset(self):
        self.courses = pd.DataFrame()
        s3 = boto3.client('s3')
        bucket_name = 'courseembeddings'
        file_name = 'small_catalog.csv'
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        df = pd.read_csv(obj['Body'])
        self.courses = df
        return
    
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
    # returns the BERT emebdding of text
    # Q for future Surb: is it easy to run BERT on the cloud from say, a lambda call? 
    # is the spinup gonna be atrocious for that or is huggingface the goat?
    # in the case of the former, let's switch to word2Vec. But that might blow up the whole thing....
    def embed(self, text):
        embedding = self.model.encode(text)
        return embedding
        
    # returns the k nearest neighbors to target from candidates, using euclidian distance 
    # Q for future Saurabh: Is Euclidian distance a wise distance measure here? 
    # Aren't the top few principal components wayy more important than the rest?
    # or is natural language complex/dense enough as for all 300 principal components 
    # to be important (and roughly equally important)?
    def k_nearest_neighbors(self, target, k):
        heap = []
        tgt_embedding = self.embed(target)
        
        for (course_name, course_embedding) in self.courses:
            diff = course_embedding - tgt_embedding
            dist = np.sqrt(np.dot(diff.T, diff))
            heapq.heappush(heap, (-dist, course_name))
            
            if len(heap) > k:
                heapq.heappop(heap)
        
        heap.sort(key= lambda x: -x[0])
        
        top_k = []
        for (_, course_name) in heap:
            top_k.append(course_name)
        return top_k

    # returns 3 reccomendations from class_titles which are semantically closest to job_title
    def emebedding_rec(self, interest):
        return self.k_nearest_neighbors(interest, 3)

    # prints reccomendations onto console (for light testing/debugging)
    def print_rec(self, interest):
        print(interest + ': ' + str(self.emebedding_rec(interest)))
    
    
def main():
    rec = EmbeddingRecommender()
    rec.upload_course_subset()
    return 
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--interest', type=str)
    parser.add_argument('-n', '--num_recs', type=int)
    args = parser.parse_args()
    interest = args.interest
    num_recs = args.num_recs

    rec = EmbeddingRecommender()
    rec.upload_courses_from_csv('../data/cis_catalog.csv')
    
    res = rec.k_nearest_neighbors(interest, num_recs)
    resStr = "\n".join(res)
    print(resStr)
    return resStr

if __name__ == '__main__':
    main()

