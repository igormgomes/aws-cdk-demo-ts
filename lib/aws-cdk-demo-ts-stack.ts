import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {BucketEncryption} from 'aws-cdk-lib/aws-s3';
import {Construct} from 'constructs';

export class AwsCdkDemoTsStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, 'AwsCdkDemoTsBucket', {
            bucketName: 'aws-cdk-demo-ts-bucket',
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            encryption: BucketEncryption.KMS
        });

    }
}