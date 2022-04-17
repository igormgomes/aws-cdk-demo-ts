import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class AwsCdkDemoTsStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, 'AwsCdkDemoTsStackBucket', {
            bucketName: 'aws-cdk-demo-ts-bucket',
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            encryption: BucketEncryption.KMS,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        });

        new iam.Group(this, 'AwsCdkDemoTsIAMGroup');

        const bucket = new s3.Bucket(this, 'AwsCdkDemoTsStackBucket2');
        new CfnOutput(this, 'AwsCdkDemoTsStackBucketCfnOutput', {
            value: bucket.bucketName,
            description: 'Bucket2 name',
            exportName: 'AwsCdkDemoTsBucket2Name'
        });
    }
}