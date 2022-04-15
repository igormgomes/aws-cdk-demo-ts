import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class AwsCdkDemoTsStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, 'AwsCdkDemoTsBucket', {
            bucketName: 'aws-cdk-demo-ts-bucket',
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            encryption: BucketEncryption.KMS,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        });

        new iam.Group(this, 'AwsCdkDemoTsIAMGroup');

        const bucketDemo2 = new s3.Bucket(this, 'AwsCdkDemoTsBucket2', {});
        new CfnOutput(this, 'AwsCdkDemoTsBucketoOutput', {
            value: bucketDemo2.bucketName,
            description: 'Bucket2 name',
            exportName: 'AwsCdkDemoTsBucket2Name'
        });
    }
}