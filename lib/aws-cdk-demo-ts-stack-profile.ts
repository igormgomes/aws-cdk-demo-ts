import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {BucketEncryption} from 'aws-cdk-lib/aws-s3';
import {BlockPublicAccess} from 'aws-cdk-lib/aws-s3';
import {Construct} from 'constructs';

export class AwsCdkDemoTsStackProfile extends Stack {

    constructor(scope: Construct, id: string, isProd?: Boolean, props?: StackProps) {
        super(scope, id, props);

        if(isProd) {
            new s3.Bucket(this, 'AwsCdkDemoTsStackProfileDev', {
                bucketName: 'aws-cdk-demo-ts-bucket',
                versioned: true,
                removalPolicy: RemovalPolicy.DESTROY,
                encryption: BucketEncryption.KMS,
                blockPublicAccess: BlockPublicAccess.BLOCK_ALL
            });
        } else {
            new s3.Bucket(this, 'AwsCdkDemoTsStackProfileDevProd', {
                removalPolicy: RemovalPolicy.DESTROY
            });
        }
    }
}