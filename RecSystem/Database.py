import boto3
from EmbeddingRecommender import EmbeddingRecommender
import argparse
# uploads the emebddings to the database
def upload_emebddings(course_table, embed_rec):
  for (course_name, course_embedding) in embed_rec.courses:
    course_table.update_item(
      Key={
        'Course_Code': course_name[:8]
        },
      UpdateExpression='SET courseEmbedding = :val1',
      ExpressionAttributeValues={
        ':val1': str(course_embedding)
        }
      )


def update_rec(username, interest, num_recs, embed_rec, user_table):
  recs = embed_rec.k_nearest_neighbors(interest, num_recs)
  course_codes = [name[:8] for name in recs]
  
  response = user_table.get_item(
    Key={
      'username': username
    },
  )
  
  exististing_recs = {}
  if 'recs' in response['Item']:
    exististing_recs = response['Item']['recs']
  
  exististing_recs[interest] = course_codes
  
  user_table.update_item(
    Key={
      'username': username
    },
    UpdateExpression='SET recs = :val1',
    ExpressionAttributeValues={
      ':val1': exististing_recs
    }
  )
  
  
def main():
  embed_rec = EmbeddingRecommender()
  dynamodb = boto3.resource('dynamodb')
  #course_table_name = 'Course_Table'
  #course_table = dynamodb.Table(course_table_name)
  
  user_table_name = 'users'
  user_table = dynamodb.Table(user_table_name)
  parser = argparse.ArgumentParser()
  parser.add_argument('-u', '--username', type=str)
  parser.add_argument('-i', '--interest', type=str)
  parser.add_argument('-n', '--num_recs', type=int)
  
  args = parser.parse_args()
  interest = args.interest
  num_recs = args.num_recs
  username = args.username
    
  
  update_rec(username, interest, num_recs, embed_rec, user_table)
  
  
if __name__ == '__main__':
  main()  
