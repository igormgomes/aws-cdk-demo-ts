import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AwsCdkDemoTsStackDbVpc extends Stack {

    vpc: Vpc;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'AwsCdkDemoTsStackDbVpcVpc', {
            cidr: '10.10.0.0/16',
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'app',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
                },
                {
                    cidrMask: 24,
                    name: 'db',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }
            ]
        })

        this.vpc = vpc

        new CfnOutput(this, 'AwsCdkDemoTsStackDbVpcCfn', {
            value: vpc.vpcId,
            exportName: 'customDbVpcId'
        })
    }
}