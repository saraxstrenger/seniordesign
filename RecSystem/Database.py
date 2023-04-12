import boto3
from botocore.exceptions import ClientError
from EmbeddingRecommender import EmbeddingRecommender
import argparse
import time
import math
# uploads the emebddings to the database
def upload_emebddings(course_table, embed_rec):
  for (course_name, course_embedding) in embed_rec.courses:
    code = course_name.split(': ')[0]
    course_table.update_item(
      Key={
        'code': code
        },
      UpdateExpression='SET embedding = :val1',
      ExpressionAttributeValues={
        ':val1': str(course_embedding)
        }
      )


def update_rec(username, num_recs, embed_rec, user_table):
  try:
    response = user_table.get_item(
      Key={
        'username': username
      },
    )
  except ClientError as err:
    print(
        "Couldn't get user %s from user table. Here's why: %s: %s",
        username,
        err.response['Error']['Code'], 
        err.response['Error']['Message'])
    return
  
  uncomputed_interests = []
  if 'Item' not in response:
    print("Couldn't find user %s in user table", username)
    return
  
  existing_interests = response['Item']['interests']

  for interest, recommendations in existing_interests.items():
    if recommendations is None or len(recommendations) == 0:
      uncomputed_interests.append(interest)

  # terminate early if no computation should be made
  if len(uncomputed_interests)==0:
    return

  # compute new recommendations
  new_recs = {}
  for interest in uncomputed_interests:
    recs = embed_rec.k_nearest_neighbors(interest, num_recs)
    course_codes = [name[:8] for name in recs]
    new_recs[interest] = course_codes
  
  # build update expression such that we only add new interests
  update_expression =  'SET '
  attribute_names={}
  attribute_values={}
  index=0
  for interest, recs in new_recs.items():
    if index != 0:
      update_expression += ', '
    attribute = '#interest'+str(index)
    attribute_names[attribute] = interest
    value = ':val'+str(index)
    attribute_values[value] = recs

    update_expression += "interests."+attribute + ' = '+value
    index += 1

  user_table.update_item(
    Key={
      'username': username
    },
    UpdateExpression=update_expression,
    ExpressionAttributeNames=attribute_names,
    ExpressionAttributeValues=attribute_values,
  )
  
def main_embed_upload():
  dynamodb = boto3.resource('dynamodb')
  course_table_name = 'courses'
  course_table = dynamodb.Table(course_table_name)
  embed_rec = EmbeddingRecommender()
  embed_rec.upload_course_subset()
  #embed_rec.upload_courses_from_csv('../data/cis_catalog.csv')
  upload_emebddings(course_table, embed_rec)
  
def main():
  embed_rec = EmbeddingRecommender()
  dynamodb = boto3.resource('dynamodb')
  
  user_table_name = 'users'
  user_table = dynamodb.Table(user_table_name)
  parser = argparse.ArgumentParser()
  parser.add_argument('-u', '--username', type=str)
  parser.add_argument('-n', '--num_recs', type=int)
  
  args = parser.parse_args()
  num_recs = args.num_recs
  username = args.username
  update_rec(username, num_recs, embed_rec, user_table)
  
if __name__ == '__main__':
  main()
