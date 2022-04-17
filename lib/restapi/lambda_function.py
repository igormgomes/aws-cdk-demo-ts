from http import HTTPStatus
import boto3
import json
import logging
import os

_ddb = boto3.resource('dynamodb')

logger = logging.getLogger()
logger.setLevel(level=os.getenv("LOG_LEVEL", "INFO").upper())

_ddb_table = _ddb.Table(os.environ.get('TABLE_NAME'))


def lambda_handler(event, context):
    logger.info(f"received event:{event}")
    
    try:
        if event.get("pathParameters"):
            item = {
                "_id": event.get("pathParameters").get("user_name"),
                "likes": event.get("pathParameters").get("likes")
            }
            _ddb_table.put_item(Item=item)
            return {
                "statusCode": HTTPStatus.OK.value,
                "body": json.dumps({"message": f"OK updated '{item['_id']}' with '{item['likes']}' likes"})
            }
    except Exception as e:
        logger.error(f"{str(e)}")
        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR.value,
            "body": json.dumps({"message": f"ERROR:{str(e)}"})
        }