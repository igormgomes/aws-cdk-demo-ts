import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { InlineCode, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class AwsCdkDemoTsStackLambdaRestApi extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const table = new Table(this, 'AwsCdkDemoTsStackLambdaRestApiTable', {
            tableName: 'db_table',
            partitionKey: {
                name: '_id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY
        });

        const lambdaFile = readFileSync('./lib/restapi/lambda_function.py', 'utf-8');
        const functionProcess = new Function(this, 'AwsCdkDemoTsStackLambdaRestApiFunction', {
            functionName: 'store_processor_function',
            description: 'Process API events',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(lambdaFile),
            timeout: Duration.seconds(4),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'DEBUG',
                'TABLE_NAME': table.tableName
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackLambdaRestApiLG', {
            logGroupName: '/aws/lambda/'.concat(functionProcess.functionName),
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_DAY
        });

        table.grantReadWriteData(functionProcess)

        const lambdaRestApi = new LambdaRestApi(this, 'AwsCdkDemoTsStackLambdaRestApiLambdaRestApi', {
            restApiName: 'Names API',
            handler: functionProcess,
            proxy: false
        });
        const userNameResource = lambdaRestApi.root.addResource('{user_name}')
        const likesResource = userNameResource.addResource('{likes}')
        likesResource.addMethod('GET')

        new CfnOutput(this, 'AwsCdkDemoTsStackLambdaRestApiCfnOutput', {
            value: lambdaRestApi.url.concat(likesResource.path)
        })
    }
}