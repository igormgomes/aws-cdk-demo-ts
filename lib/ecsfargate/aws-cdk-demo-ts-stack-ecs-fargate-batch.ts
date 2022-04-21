import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';
import { Schedule } from 'aws-cdk-lib/aws-applicationautoscaling';

export class AwsCdkDemoTsStackEcsFargateBatch extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'AwsCdkDemoTsStackEcsFargateBatchVpc', {
            maxAzs: 2,
            natGateways: 1
        })

        const cluster = new Cluster(this, 'AwsCdkDemoTsStackEcsFargateBatchCluster', {
            vpc: vpc
        });

        new ScheduledFargateTask(this, 'AwsCdkDemoTsStackEcsFargateBatchScheduledFargateTask', {
            cluster: cluster,
            scheduledFargateTaskImageOptions: {
                image: ContainerImage.fromRegistry('igormgomes/nginx-test'),
                memoryLimitMiB: 1024,
                cpu: 512,
                environment: {
                    'REDIS_HOST': 'redis.aws.com',
                    'REDIS_PORT': '6379'
                }
            },
            schedule: Schedule.expression('rate(15 minutes)')
        })
    }
}