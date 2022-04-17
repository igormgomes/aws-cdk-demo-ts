import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';

export class AwsCdkDemoTsStackS3Events extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'AwsCdkDemoTsStackS3EventsBucket', {
            versioned: true
        });

        const table = new Table(this, 'AwsCdkDemoTsStackS3EventsTable', {
            tableName: 'store_table',
            partitionKey: {
                name: '_id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY
        });

        const lambdaFile = readFileSync('./lib/s3_events/lambda_function.py', 'utf-8');
        const functionProcess = new Function(this, 'AwsCdkDemoTsStackS3EventsFunction', {
            functionName: 'store_processor_function',
            description: 'Process store',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(lambdaFile),
            timeout: Duration.seconds(4),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'DEBUG',
                'DDB_TABLE_NAME': table.tableName
            }
        })
        const logGroup = new LogGroup(this, 'AwsCdkDemoTsStackS3EventsLG', {
            logGroupName: '/aws/lambda/'.concat(functionProcess.functionName),
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_DAY
        });

        table.grantReadWriteData(functionProcess)

        const lambdaDestination = new LambdaDestination(functionProcess)
        
        bucket.addEventNotification(EventType.OBJECT_CREATED, lambdaDestination)

    }
}