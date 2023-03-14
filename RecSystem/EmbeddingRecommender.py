import numpy as np
import heapq
from sentence_transformers import SentenceTransformer
import pandas as pd
import argparse 
"""
EmbeddingRecommender class can reccomend classes based on natural language interests and course names
Constructor takes in some iterable of course names (strings) in natural langauge 
For best results, don't include course codes (e.g. do "intro to computer architexture" not "CIS 240: Intro to Architecture")
"""
class EmbeddingRecommender():
    def __init__(self):
        # Load the embedding model
        self.model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
        # stored as (course_name, course_embedding) pairs
        self.courses = []
        seen = set()
        # eventually we'll want to load the data from the database
        courses_df = pd.read_csv('../data/test_courses.csv')
        for row in courses_df.itertuples():
            full_course_name = row[1]
            course_name= full_course_name[9:]
            if course_name in seen:
                continue
            seen.add(course_name)
            course_description = row[-1]
            course_name_embedding = self.embed(course_name)
            course_description_embedding = self.embed(course_description)
            course_embedding = (0.3*course_name_embedding)  + (0.7*course_description_embedding)
            self.courses.append((full_course_name, course_embedding))
    
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
    """
    play_course_names = [ 'Software Engineering', 'Introduction to Acting', 'Creative Writing: Extreme Noticing', 
                            'Computer Architecture', 'Data Structures and Algorithms', 'Dynamic Systems',
                            'Machine Learning', 'Deep Learning', 'Artificial Intelligence',
                            'Introduction to Drawing', 'Advanced Drawing', 'US History 1950 to Present',
                            'Programming and Problem Solving', 'Computer Graphics', 'Human Systems Engineering',
                            'Architecture 101: Building Buidlings', 'How to Make Bridges', 'Mechanics', 'Electromagnetism',
                            'Intro to Product Design', 'User Experience Research', 'Woodworking 101',
                            'How to make things']
    rec.print_rec('Software Engineer')
    rec.print_rec('Painter')
    rec.print_rec('Animator')
    rec.print_rec('Front End Developer')
    rec.print_rec('Back End Developer')
    rec.print_rec('Data Scientist')
    rec.print_rec('UX designer')
    rec.print_rec('Product Manager')
    rec.print_rec('Machine Learning Engineer')
    rec.print_rec('Natural Language Processing')
    rec.print_rec('Computer Vision')
    """
    
    rec = EmbeddingRecommender()
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--interest', type=str)
    parser.add_argument('-n', '--num_recs', type=int)
    args = parser.parse_args()
    interest = args.interest
    num_recs = args.num_recs
    
    res = rec.k_nearest_neighbors(interest, num_recs)
    print(res)
    return res
    
if __name__ == '__main__':
    main()