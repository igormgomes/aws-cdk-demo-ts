import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class AwsCdkDemoTsStackLambdaDynamoDB extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new Table(this, 'AwsCdkDemoTsStackLambdaDynamoDBTable', {
            tableName: 'kons',
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY
        })
    }
}