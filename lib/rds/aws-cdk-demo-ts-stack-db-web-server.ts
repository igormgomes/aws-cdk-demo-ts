import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AmazonLinuxEdition, AmazonLinuxGeneration, AmazonLinuxStorage, AmazonLinuxVirt, InstanceType, IVpc, Port, UserData } from 'aws-cdk-lib/aws-ec2';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { readFileSync } from 'fs';

export class AwsCdkDemoTsStackDbWebServer extends Stack {
    webServer: AutoScalingGroup;

    constructor(scope: Construct, id: string, props?: StackProps, vpc?: IVpc) {
        super(scope, id, props);

        if (typeof vpc == 'undefined') {
            throw 'Invalid vpc'
        }

        const file = readFileSync('./lib/dbdata/user_data/deploy_app.sh', 'utf-8');

        const linuxAmi = new ec2.AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
            edition: AmazonLinuxEdition.STANDARD,
            virtualization: AmazonLinuxVirt.HVM,
            storage: AmazonLinuxStorage.GENERAL_PURPOSE
        })

        const alb = new ApplicationLoadBalancer(this, "AwsCdkDemoTsStackDbWebServerApplicationLoadBalancer", {
            vpc: vpc,
            internetFacing: true,
            loadBalancerName: 'WebServerAlb'
        })
        alb.connections.allowFromAnyIpv4(Port.tcp(80), 'access on ALB Port 80')

        const listener = alb.addListener('listernerId', {
            port: 80,
            open: true
        })

        const role = new Role(this, 'AwsCdkDemoTsStackDbWebServerRole', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')
            ]
        })

        const webServer = new AutoScalingGroup(this, 'AwsCdkDemoTsStackDbWebServerAutoScalingGroup', {
            vpc: vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            instanceType: new InstanceType('t2.micro'),
            machineImage: linuxAmi,
            role: role,
            minCapacity: 2,
            maxCapacity: 2,
            userData: UserData.custom(file)
        })

        webServer.connections.allowFrom(alb, Port.tcp(80), 'Allows ASG Security Group')

        this.webServer = webServer

        listener.addTargets('AwsCdkDemoTsStackDbWebServerListener', {
            port: 80,
            targets: [webServer]
        })

        new CfnOutput(this, 'AwsCdkDemoTsStackDbWebServerCfnOutput', {
            value: 'http://' + alb.loadBalancerDnsName
        })
    }
}