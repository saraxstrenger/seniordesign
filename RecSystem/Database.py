import boto3
from EmbeddingRecommender import EmbeddingRecommender

# uploads the emebddings to the database
def upload_emebddings(table):
  embed_rec = EmbeddingRecommender()

  with table.batch_writer() as batch:
    for (course_name, course_embedding) in embed_rec.courses:
      table.update_item(
        Key={
          'Course_Code': course_name[:8]
        },
        UpdateExpression='SET course_embedding = :val1',
        ExpressionAttributeValues={
          ':val1': str(course_embedding)
        }
      )
  
  
def main():
  dynamodb = boto3.resource('dynamodb')
  course_table_name = 'Course_Table'
  table = dynamodb.Table(course_table_name)
  upload_emebddings(table)
  



if __name__ == '__main__':
  main()  
