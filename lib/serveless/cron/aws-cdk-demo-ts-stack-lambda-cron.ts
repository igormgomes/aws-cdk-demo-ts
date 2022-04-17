import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { readFileSync } from 'fs';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class AwsCdkDemoTsStackLambdaCron extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const file = readFileSync('./lib/serveless/lambda/lambda_function.py', 'utf-8');

        const functionKons = new Function(this, 'AwsCdkDemoTsStackLambdaCronFunction', {
            functionName: 'kons_function',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(file),
            timeout: Duration.seconds(3),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'INFO',
                'AUTOMATION': 'SKON'
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackLambdaCronLogGroup', {
            logGroupName: '/aws/lambda/'.concat(functionKons.functionName),
            removalPolicy: RemovalPolicy.DESTROY
        })

        const rule = new Rule(this, 'AwsCdkDemoTsStackLambdaCronRule', {
            schedule: Schedule.cron({
                minute: '0',
                hour: '18',
                month: '*',
                weekDay: 'MON-FRI',
                year: '*'
            })
        })
        const ruleRate = new Rule(this, 'AwsCdkDemoTsStackLambdaCronRuleRate', {
            schedule: Schedule.rate(Duration.minutes(3))
        })

        rule.addTarget(new LambdaFunction(functionKons))
        ruleRate.addTarget(new LambdaFunction(functionKons))
    }
}