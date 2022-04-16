import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, S3Code } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class AwsCdkDemoTsStackLambdaBucket extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = Bucket.fromBucketAttributes(this, 'AwsCdkDemoTsStackLambdaAtt', {
            bucketName: 'kons-bkt-v2'
        })

        const funcion = new Function(this, 'AwsCdkDemoTsStackLambdaBucketFunction', {
            functionName: 'kons_function_v2',
            runtime: Runtime.PYTHON_3_7,
            handler: 'lambda_function.lambda_handler',
            code: new S3Code(bucket, 'lambda_src/lambda_function.zip'),
            timeout: Duration.seconds(5),
            reservedConcurrentExecutions: 2,
            environment: {
                'LOG_LEVEL': 'INFO'
            }
        })

        new LogGroup(this, 'AwsCdkDemoTsStackLambdaBucketLG', {
            logGroupName: '/aws/lambda/'.concat(funcion.functionName),
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.FIVE_DAYS
        })
    }
}