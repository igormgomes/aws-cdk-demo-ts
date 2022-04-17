import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';

export class AwsCdkDemoTsStackLambda extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const file = readFileSync('./lib/serveless/lambda/lambda_function.py', 'utf-8');

        new Function(this, 'AwsCdkDemoTsStackLambdaFunction', {
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
    }
}