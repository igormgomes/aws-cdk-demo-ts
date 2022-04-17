from http import HTTPStatus
import json
import logging
import os
import random
import uuid
import boto3

logger = logging.getLogger()
logger.setLevel(level=os.getenv("LOG_LEVEL", "INFO").upper())

STREAM_NAME = os.getenv("STREAM_NAME", "data_pipe")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

kinesisClient = boto3.client("kinesis", region_name=AWS_REGION)


def send_data(data, key):
    logger.info(f"Data:{json.dumps(data)} and key:{key}")

    response = kinesisClient.put_records(
        Records=[
            {
                "Data": json.dumps(data),
                "PartitionKey": key
            }
        ],
        StreamName=STREAM_NAME

    )
    logger.info(f"Response:{response}")


def lambda_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")

    _random_user_name = ["Abagael", "Abagail", "Abana", "Abate",
                         "Abba", "Abbate", "Abbe", "Abbey""Abbi", "Abbie", "Abbot"]

    try:
        record_count = 0
        for i in range(random.randint(1, 3)):
            send_data(
                {
                    "name": random.choice(_random_user_name),
                    "age": random.randint(1, 500),
                    "location": "SP"
                },
                str(uuid.uuid4()))
            record_count += 1
        return {
            "statusCode": HTTPStatus.CREATED.value,
            "record_count": record_count
        }
    except Exception as e:
        logger.error(f"ERROR:{str(e)}")
        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR.value,
            "body": json.dumps({"message": f"ERROR:{str(e)}"})
        }


