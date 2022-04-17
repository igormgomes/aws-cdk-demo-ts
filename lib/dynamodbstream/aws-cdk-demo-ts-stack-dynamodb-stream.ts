import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { InlineCode, Runtime, Function, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AttributeType, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class AwsCdkDemoTsStackDynamoDBStream extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const table = new Table(this, 'AwsCdkDemoTsStackDynamoDBStreamTable', {
            tableName: 'stream_table',
            partitionKey: {
                name: '_id',
                type: AttributeType.STRING
            },
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
            removalPolicy: RemovalPolicy.DESTROY
        });

        const lambdaFile = readFileSync('./lib/dynamodbstream/lambda_function.py', 'utf-8');
        const streamFunction = new Function(this, 'AwsCdkDemoTsStackDynamoDBStreamFunction', {
            functionName: 'stream_processor_function',
            description: 'Process stream events',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(lambdaFile),
            timeout: Duration.seconds(4),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'DEBUG'
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackDynamoDBStreamFunctionLG', {
            logGroupName: '/aws/lambda/'.concat(streamFunction.functionName),
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_DAY
        });

        const dynamoEventSouce = new DynamoEventSource(table, {
            startingPosition: StartingPosition.TRIM_HORIZON,
            bisectBatchOnError: true,
        });
        streamFunction.addEventSource(dynamoEventSouce)
    }
}