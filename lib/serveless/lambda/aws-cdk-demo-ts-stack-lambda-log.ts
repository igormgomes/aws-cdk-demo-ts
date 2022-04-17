import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';

export class AwsCdkDemoTsStackLambdaLog extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const file = readFileSync('./lib/serveless/lambda/lambda_function.py', 'utf-8');

        const functionKons = new Function(this, 'AwsCdkDemoTsStackLambdaLogFunction', {
            functionName: 'kons_function',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(file),
            timeout: Duration.seconds(5),
            reservedConcurrentExecutions: 2,
            environment: {
                'LOG_LEVEL': 'INFO'
            }
        })

        new LogGroup(this, 'AwsCdkDemoTsStackLambdaLogLogGroup', {
            logGroupName: '/aws/lambda/'.concat(functionKons.functionName),
            removalPolicy: RemovalPolicy.DESTROY
        })
    }
}