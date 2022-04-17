import { CfnOutput, RemovalPolicy, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class AwsCdkDemoTsStackCustomVpc extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const configs = scope.node.tryGetContext('envs').prod;
        const vpc = new Vpc(this, 'AwsCdkDemoTsStackCustomVpcVpc', {
            cidr: configs.vpc_configs.vpc_cidr,
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: configs.vpc_configs.cidr_mask,
                    name: 'publicSubnet',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: configs.vpc_configs.cidr_mask,
                    name: 'privateSubnet',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
                },
                {
                    cidrMask: configs.vpc_configs.cidr_mask,
                    name: 'dbSubnet',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }
            ]
        })

        const bucket = new Bucket(this, 'AwsCdkDemoTsStackCustomVpcBucket', {
            removalPolicy: RemovalPolicy.DESTROY
        });

        Tags.of(bucket).add('owner', 'igor', {
        });

        Tags.of(vpc).add('owner', 'igor', {
        });

        new CfnOutput(this, 'AwsCdkDemoTsStackCustomVpcCfnOutput', {
            value: vpc.vpcId,
            exportName: 'customVpcId'
        })
    }
}