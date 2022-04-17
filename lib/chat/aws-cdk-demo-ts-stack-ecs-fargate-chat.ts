import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition, Protocol } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

export class AwsCdkDemoTsStackEcsFargateChat extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'AwsCdkDemoTsStackEcsFargateChatVpc', {
            maxAzs: 2,
            natGateways: 1
        })

        const cluster = new Cluster(this, 'AwsCdkDemoTsStackEcsFargateChatCluster', {
            vpc: vpc
        });

        const fargateTaskDefinition = new FargateTaskDefinition(this, 'AwsCdkDemoTsStackEcsFargateChatFargateTaskDefinition')
        const container = fargateTaskDefinition.addContainer('AwsCdkDemoTsStackEcsFargateChatFargateTaskDefinitionContainer', {
            image: ContainerImage.fromRegistry('igormgomes/chat-app:latest'),
            environment: {
                'github': 'https://github.com/igormgomes'
            }
        })
        container.addPortMappings({
            containerPort: 3000,
            protocol: Protocol.TCP,
        });

        const applicationLoadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, 'AwsCdkDemoTsStackEcsFargateChatApplicationLoadBalancedFargateService', {
            cluster: cluster,
            taskDefinition: fargateTaskDefinition,
            assignPublicIp: false,
            publicLoadBalancer: true,
            listenerPort: 80,
            desiredCount: 1,
            serviceName: 'chat-app'
        });

        new CfnOutput(this, 'AwsCdkDemoTsStackEcsFargateChatCfnOutput', {
            value: applicationLoadBalancedFargateService.loadBalancer.loadBalancerDnsName
        })
    }
}