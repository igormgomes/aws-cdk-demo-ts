from http import HTTPStatus
import boto3
import json
import logging
import os

logger = logging.getLogger()
logger.setLevel(level=os.getenv("LOG_LEVEL", "INFO").upper())

_ddb = boto3.resource('dynamodb')
_s3_table = _ddb.Table(os.environ.get('DDB_TABLE_NAME'))

def lambda_handler(event, context):
    logger.info(f"received event:{event}")

    try:
        if "Records" in event:
            item = {}
            item["_id"] = event["Records"][0]["s3"]["object"]["key"]
            item["_size"] = event["Records"][0]["s3"]["object"]["size"]
            item["_bucket"] = event["Records"][0]["s3"]["bucket"]["name"]
            item["_bucket_owner"] = event["Records"][0]["s3"]["bucket"]["ownerIdentity"]["principalId"]
            _put_resp = _s3_table.put_item(Item=item)
            return {
                "statusCode": HTTPStatus.CREATED.value,
                "body": json.dumps({"message": _put_resp})
            }
    except Exception as e:
        logger.error(f"{str(e)}")

        return {
            "statusCode": HTTPStatus.BAD_REQUEST.value,
            "body": json.dumps({"message": f"ERROR:{str(e)}"})
        }
