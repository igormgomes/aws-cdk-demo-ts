import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class AwsCdkDemoTsStackSite extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'AwsCdkDemoTsStackSiteBucket', {
            versioned: true,
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: '404.html',
            removalPolicy: RemovalPolicy.DESTROY
        });

        new BucketDeployment(this, 'AwsCdkDemoTsStackSiteBucketDeployment', {
            sources: [
                Source.asset('lib/site/static_assets')
            ],
            destinationBucket: bucket
        })
    }
}