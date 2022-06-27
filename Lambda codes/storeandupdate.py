import os
import boto3
import requests
from requests_aws4auth import AWS4Auth
es_host = " " # enter you open search domain name with https://
es_index = "shop"
es_type = "product"
url = es_host + '/' + es_index + '/' + es_type + '/'
region = '' #enter your region e.g., us-west-2
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
def lambda_handler(event, context):
    print(event)
    for record in event['Records']:
        id = str(record['dynamodb']['Keys']['ID']['S'])
        if record['eventName'] == 'REMOVE':
            res = requests.delete(url + id, auth=awsauth)
        else:
            document = record['dynamodb']['NewImage']
            res = requests.put(url + id, auth=awsauth, json=document, headers={"Content-Type": "application/json"})
            print("Successfully executed")
            
