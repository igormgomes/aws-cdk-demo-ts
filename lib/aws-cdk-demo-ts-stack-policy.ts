import { aws_iam, CfnOutput, RemovalPolicy, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { AnyPrincipal, Effect, Group, ManagedPolicy, Policy, PolicyDocument, PolicyStatement, Role, User } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class AwsCdkDemoTsStackPolicy extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'AwsCdkDemoTsStackPolicyBucket', {
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY
        })

        bucket.addToResourcePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [
                bucket.arnForObjects('*.html')
            ],
            actions: [
                "s3:GetObject"
            ],
            principals: [
                new AnyPrincipal()
            ]
        }))

        bucket.addToResourcePolicy(new PolicyStatement({
            effect: Effect.DENY,
            resources: [
                bucket.bucketArn.concat('/*')
            ],
            actions: [
                "s3:*"
            ],
            principals: [
                new AnyPrincipal()
            ],
            conditions: {
                "Bool": {
                    "aws:SecureTransport": false,
                }
            }
        }))
    }
}