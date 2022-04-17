import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';

export class AwsCdkDemoTsStackEcs extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'AwsCdkDemoTsStackECSVpc', {
            maxAzs: 2,
            natGateways: 1
        })

        const cluster = new Cluster(this, 'AwsCdkDemoTsStackEcsCluster', {
            vpc: vpc
        });
        cluster.addCapacity('autoscalinggroup', {
            instanceType: new InstanceType('t2.micro')
        })

        const applicationLoadBalancedEc2Service = new ApplicationLoadBalancedEc2Service(this, 'AwsCdkDemoTsStackEcsApplicationLoadBalancedEc2Service', {
            cluster: cluster,
            memoryReservationMiB: 512,
            taskImageOptions: {
                image: ContainerImage.fromRegistry('igormgomes/nginx-test')
            }
        });

        new CfnOutput(this, 'AwsCdkDemoTsStackEcsCfnOutput', {
            value: applicationLoadBalancedEc2Service.loadBalancer.loadBalancerDnsName
        })
    }
}