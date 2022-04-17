import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { InlineCode, Runtime, Function, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { KinesisEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class AwsCdkDemoTsStackLambdaKinesis extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const streamPipeData = new Stream(this, 'AwsCdkDemoTsStackLambdaKinesisStream', {
            retentionPeriod: Duration.hours(24),
            shardCount: 1,
            streamName: 'pipe_data'
        });
        const kinesisEventSource = new KinesisEventSource(streamPipeData, {
            startingPosition: StartingPosition.LATEST,
            batchSize: 1
        });

        const bucket = new Bucket(this, 'AwsCdkDemoTsStackLambdaKinesisBucket', {
            removalPolicy: RemovalPolicy.DESTROY
        });
        const policyStatement = new PolicyStatement({
            sid: 'AllowLambdaToWriteS3',
            effect: Effect.ALLOW,
            resources: [
                bucket.bucketArn.concat('/*')
            ],
            actions: [
                's3:PutObject'
            ]
        });

        const consumerLambdaFile = readFileSync('./lib/kinesis/stream_consumer_function.py', 'utf-8');
        const consumerFunction = new Function(this, 'AwsCdkDemoTsStackLambdaKinesisConsumerFunction', {
            functionName: 'stream_consumer_functioon',
            description: 'Consumer events',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(consumerLambdaFile),
            timeout: Duration.seconds(4),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'DEBUG',
                'BUCKET_NAME': bucket.bucketName,
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackLambdaKinesisConsumerFunctionLG', {
            logGroupName: '/aws/lambda/'.concat(consumerFunction.functionName),
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_DAY
        });

        streamPipeData.grantRead(consumerFunction)        
        consumerFunction.addToRolePolicy(policyStatement)
        consumerFunction.addEventSource(kinesisEventSource)
        
        const producerLambdaFile = readFileSync('./lib/kinesis/stream_producer_function.py', 'utf-8');
        const producerFunction = new Function(this, 'AwsCdkDemoTsStackLambdaKinesisProducerFunction', {
            functionName: 'stream_producer_functioon',
            description: 'Producer events',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(producerLambdaFile),
            timeout: Duration.seconds(60),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'DEBUG',
                'STREAM_NAME': streamPipeData.streamName,
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackLambdaKinesisProducerFunctionLG', {
            logGroupName: '/aws/lambda/'.concat(producerFunction.functionName),
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_DAY
        });
        
        streamPipeData.grantReadWrite(producerFunction)
    }
}