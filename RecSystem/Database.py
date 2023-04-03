import boto3
from botocore.exceptions import ClientError
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
  
  existing_interests = []
  if "interests" in response["Item"]:
    existing_interests = response["Item"]["interests"]

  exististing_recs = {}
  if 'recs' in response['Item']:
    exististing_recs = response['Item']['recs']
  
  new_interests =[]
  for interest in existing_interests:
    if interest not in exististing_recs:
      new_interests.append(interest)

  # terminate early if no computation should be made
  if new_interests==0:
    return

  # compute new recommendations
  new_recs = {}
  for interest in new_interests:
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
    attribute = '#interst'+str(index)
    attribute_names[attribute] = interest
    value = ':val'+str(index)
    attribute_values[value] = recs

    update_expression += "recs."+attribute + ' = '+value
    index += 1

  user_table.update_item(
    Key={
      'username': username
    },
    UpdateExpression=update_expression,
    ExpressionAttributeNames=attribute_names,
    ExpressionAttributeValues=attribute_values,
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
  parser.add_argument('-n', '--num_recs', type=int)
  
  args = parser.parse_args()
  num_recs = args.num_recs
  username = args.username
  update_rec(username, num_recs, embed_rec, user_table)
  
  
if __name__ == '__main__':
  main()  
