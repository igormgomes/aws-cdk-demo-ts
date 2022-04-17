import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontAllowedCachedMethods, CloudFrontAllowedMethods, CloudFrontWebDistribution, OriginAccessIdentity, PriceClass, SourceConfiguration} from 'aws-cdk-lib/aws-cloudfront';

export class AwsCdkDemoTsStackCloudFront extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'AwsCdkDemoTsStackCloudFrontBucket', {
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY
        });

        new BucketDeployment(this, 'AwsCdkDemoTsStackCloudFrontBucketDeployment', {
            sources: [
                Source.asset('lib/site/static_assets')
            ],
            destinationBucket: bucket
        })

        const origiinAccessIdentity = new OriginAccessIdentity(this, 'AwsCdkDemoTsStackCloudFrontOriginAccessIdentity', {
            comment: 'OAI for statics'
        });

        const sourceConfiguration: SourceConfiguration = {
            s3OriginSource: {
                s3BucketSource: bucket,
                originAccessIdentity: origiinAccessIdentity
            },
            behaviors: [{
                isDefaultBehavior: true,
                compress: true,
                allowedMethods: CloudFrontAllowedMethods.ALL,
                cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD
            }]
        }

        const cloudFrontWebDestribution = new CloudFrontWebDistribution(this, 'AwsCdkDemoTsStackCloudFrontCloudFrontWebDistribution', {
            comment: 'CDN',
            originConfigs: [sourceConfiguration],
            priceClass: PriceClass.PRICE_CLASS_100
        });

        new CfnOutput(this, 'AwsCdkDemoTsStackCloudFrontCfnOutput', {
            value: cloudFrontWebDestribution.distributionDomainName
        })

    }
}