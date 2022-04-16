
from http import HTTPStatus
import json
import logging
import os
logger = logging.getLogger()
logger.setLevel(level=os.getenv('LOG_LEVEL', 'DEBUG').upper())

def lambda_handler(event, context):
    logger.info(f"received event: {event}")

    return {
        "statusCode": HTTPStatus.OK.value,
        "body": json.dumps({
            "message": event
        })
    }
