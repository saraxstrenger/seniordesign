#pip install --upgrade torch
#pip install transformers
#pip install sentence_transformers
import torch
from transformers import BertModel, BertTokenizer
import numpy as np
import heapq
from sentence_transformers import SentenceTransformer


class EmbeddingRecomender():
    # takes in an iterable course_names, where each elt is a course name (string)
    def __init__(self, course_names):
        # Load the BERT model and tokenizer
        #self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
        #stored as (course_name, course_embedding) pairs
        self.courses = []
        for course_name in course_names:
            course_embedding = self.embed(course_name)
            self.courses.append((course_name, course_embedding))
    
    def embed(self, text):
        embedding = self.model.encode(text)
        return embedding
    
    # returns the BERT emebdding of text
    # Q for future Surb: is it easy to run BERT on the cloud from say, a lambda call? 
    # is the spinup gonna be atrocious for that or is huggingface the goat?
    # in the case of the former, let's switch to word2Vec. But that might blow up the whole thing....
    # at which point we full pivot to collaborative filtering lol, which I wanted to try anyways
    # collabortive filtering to predict tabular values would be sick 
    # Imagine a system that says "I think X course will be 3.5 difficulty for you"
    # No need to adjust for things "Well I'm good at coding and bad at theroy so I should add 0.5 to this diff score..."
    
    """
    def embed_old(self, text):
        # Encode the input sentence
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.model = BertModel.from_pretrained('bert-base-uncased')
        
        input_ids = torch.tensor(self.tokenizer.encode(text, add_special_tokens=True)).unsqueeze(0)
        outputs = self.model(input_ids)
        # since we're embedding "entire sentences", just grab the contextual embedding of the CLS token
        CLS_sentence_embedding = outputs[0][0][0]
        
        return CLS_sentence_embedding.detach().numpy()
    """
    #^also oops my bad for trying to do the sentence embeddings myself instead of just using the huggingface lib for it
    #^kinda worked but not really

    # returns the k nearest neighbors to target from candidates, using euclidian distance 
    # Q for future Saurabh: Is Euclidian distance a wise distance measure here? 
    # Aren't the top few principal components wayy more important than the rest?
    # or is language complex enough as for all 300 principal components to be important (and roughly equally important)?
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
        #print(heap)
        
        top_k = []
        for (_, course_name) in heap:
            top_k.append(course_name)
        return top_k

    # returns some reccomendations from class_titles which are semantically closest to job_title
    def emebedding_rec(self, interest):
        return self.k_nearest_neighbors(interest, 3)

rec = EmbeddingRecomender([ 'Software Engineering', 'Introduction to Acting', 'Creative Writing: Extreme Noticing', 
                            'Computer Architecture', 'Data Structures and Algorithms', 'Dynamic Systems',
                            'Machine Learning', 'Deep Learning', 'Artificial Intelligence',
                            'Introduction to Drawing', 'Advanced Drawing', 'US History 1950 to Present',
                            'Programming and Problem Solving', 'Computer Graphics', 'Human Systems Engineering',
                            'Building Buidlings', 'How to Make Bridges', 'Mechanics', 'Elctromagnetism',
                            'Intro to Product Design'])


def test_rec(rec, interest):
    print(interest + ': ' + str(rec.emebedding_rec(interest)))
    
    
test_rec(rec, 'Software Engineer')
test_rec(rec, 'Painter')
test_rec(rec, 'Historian')
test_rec(rec, 'Architect')
test_rec(rec, 'Phycicist')
test_rec(rec, 'Product Manager')
test_rec(rec, 'Machine Learning Engineer')