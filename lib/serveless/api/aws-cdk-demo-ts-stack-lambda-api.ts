import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { InlineCode, Runtime, Function} from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class AwsCdkDemoTsStackLambdaApi extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const file = readFileSync('./lib/serveless/api/lambda_function.py', 'utf-8');
        const functionKons = new Function(this, 'AwsCdkDemoTsStackLambdaApiFunction', {
            functionName: 'kons_function',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(file),
            timeout: Duration.seconds(3),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'INFO'
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackLambdaApiLogGroup', {
            logGroupName: '/aws/lambda/'.concat(functionKons.functionName),
            removalPolicy: RemovalPolicy.DESTROY
        })

        const lambdaRestApi = new LambdaRestApi(this, 'AwsCdkDemoTsStackLambdaApiLambdaRestApi', {
            handler: functionKons
        });

        new CfnOutput(this, 'AwsCdkDemoTsStackLambdaApiCfnOutput', {
            value: lambdaRestApi.url
        })
    }
}