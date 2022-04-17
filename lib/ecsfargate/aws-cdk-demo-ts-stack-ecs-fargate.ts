import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

export class AwsCdkDemoTsStackEcsFargate extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'AwsCdkDemoTsStackEcsFargateVpc', {
            maxAzs: 2,
            natGateways: 1
        })

        const cluster = new Cluster(this, 'AwsCdkDemoTsStackEcsFargateCluster', {
            vpc: vpc
        });

        const applicationLoadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, 'AwsCdkDemoTsStackEcsFargateApplicationLoadBalancedFargateService', {
            cluster: cluster,
            memoryLimitMiB: 1024,
            cpu: 512,
            taskImageOptions: {
                image: ContainerImage.fromRegistry('igormgomes/nginx-test'),
                environment: {
                    'REDIS_HOST': 'redis.aws.com',
                    'REDIS_PORT': '6379'
                }
            },
            desiredCount: 2
        });
        applicationLoadBalancedFargateService.targetGroup.configureHealthCheck({
            path: '/'
        })

        new CfnOutput(this, 'AwsCdkDemoTsStackEcsFargateCfnOutput', {
            value: applicationLoadBalancedFargateService.loadBalancer.loadBalancerDnsName
        })
    }
}