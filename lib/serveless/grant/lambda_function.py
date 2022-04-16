# -*- coding: utf-8 -*-

from http import HTTPStatus
import boto3
import json
import logging
import os

_s3_client = boto3.client('s3')
_dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger()
logger.setLevel(level=os.getenv('LOG_LEVEL', 'DEBUG').upper())

_table = _dynamodb.Table(os.environ.get('TABLE_NAME'))

def lambda_handler(event, context):
    logger.info(f"received_event:{event}")

    try:
        buckets = get_buckets()
        put_items(buckets)
        return  {
            "statusCode": HTTPStatus.CREATED.value,
            "body": json.dumps({"message": buckets})
        }
    except Exception as e:
        return  {
            "statusCode": HTTPStatus.BAD_REQUEST.value,
            "body": json.dumps({"message": f"ERROR:{str(e)}"})
        }


def get_buckets():
    try:
        buckets = _s3_client.list_buckets()
        buckets_inventor = {"buckets": []}
        for bucket in buckets['Buckets']:
            buckets_inventor["buckets"].append(bucket["Name"])

        logger.info(f"Buckets: {buckets_inventor}")
        return buckets_inventor
    except Exception as e:
        raise


def put_items(items):
    logger.info(f"Buckets for insert:{items}")
    
    try:
        with _table.batch_writer() as batch:
            for item in items["buckets"]:
                logger.info(f"Item for insert:{item}")

                batch.put_item(Item={"id": item})
    except Exception as e:
        raise                

