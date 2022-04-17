from http import HTTPStatus
import json
import base64
import logging
import time
import os
import boto3

logger = logging.getLogger()
logger.setLevel(level=os.getenv("LOG_LEVEL", "INFO").upper())

s3_cliente = boto3.resource("s3")

bucket_name = os.getenv("BUCKET_NAME")

def write_data_to_s3(data):
    bucket = s3_cliente.Object(bucket_name, f"{int(time.time()*2000)}.json")
    response = bucket.put(Body=data)
    
    logger.info(json.dumps(response))


def lambda_handler(event, context):
    logger.info(f"Event: {json.dumps(event)}")
    
    try:
        if event.get("Records"):
            for record in event["Records"]:
                payload = base64.b64decode(record["kinesis"]["data"])
                write_data_to_s3(payload)
                logger.info(f"Converted payload: {str(payload)}")
        return {
            "statusCode": HTTPStatus.CREATED.value,
        }
    except Exception as e:
        logger.error(f"ERROR:{str(e)}")

        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR.value,
            "body": json.dumps({"message": f"ERROR:{str(e)}"})
        }


