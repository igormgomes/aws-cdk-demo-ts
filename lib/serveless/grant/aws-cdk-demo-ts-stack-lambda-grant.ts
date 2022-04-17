import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { readFileSync } from 'fs';
import { InlineCode, Runtime, Function} from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

export class AwsCdkDemoTsStackLambdaGrant extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const table = new Table(this, 'AwsCdkDemoTsStackLambdaGrantTable', {
            tableName: 'kons',
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY
        })

        const file = readFileSync('./lib/serveless/grant/lambda_function.py', 'utf-8');
        const functionKons = new Function(this, 'AwsCdkDemoTsStackLambdaGrantFunction', {
            functionName: 'kons_function',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(file),
            timeout: Duration.seconds(3),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'INFO',
                'TABLE_NAME': table.tableName
            }
        })
        new LogGroup(this, 'AwsCdkDemoTsStackLambdaGrantLogGroup', {
            logGroupName: '/aws/lambda/'.concat(functionKons.functionName),
            removalPolicy: RemovalPolicy.DESTROY
        })

        functionKons.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'))
        table.grantWriteData(functionKons)
    }
}