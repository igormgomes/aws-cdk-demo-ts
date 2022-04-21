import json
import logging
import os
import random
from time import sleep

logger = logging.getLogger()
logger.setLevel(level=os.getenv('LOG_LEVEL', 'DEBUG').upper())

percentange_erros = os.getenv("PERCENTAGE_ERRORS", 75)

def _random_error_generator(n):
    response = False
    if random.randint(1, 100) < int(n):
        sleep(1)
        response = True
    return response


def lambda_handler(event, context):
    logger.info(f"received_event:{event}")

    response = {
        "third_party_api_error": False,
    }
    
    randon_error = _random_error_generator(percentange_erros)
    if randon_error:
        response["third_party_api_error"] = True
        response["remaining_time_in_millis"] = context.get_remaining_time_in_millis()

    logger.info(json.dumps(response))

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": response
        })
    }