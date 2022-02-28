import {Duration, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';

export class AwsCdkDemoTsStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, 'AwsCdkDemoTsQueue', {
            visibilityTimeout: Duration.seconds(300),
            queueName: `test`
        });

        const topic = new sns.Topic(this, 'AwsCdkDemoTsTopic', {
            topicName: 'test-topic'
        });

        const bucket = new s3.Bucket(this, 'AwsCdkDemoTsBucket', {
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY
        });

        const defaultVpc = ec2.Vpc.fromLookup(this, 'vpc', {
            isDefault: true
        })

        const lookupMachineImage = new ec2.LookupMachineImage({
            name: 'ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-20170307',
            owners: ['099720109477']
        });

        const instance = new ec2.Instance(this, 'AwsCdkDemoTsEc2', {
            machineImage: lookupMachineImage,
            vpc: defaultVpc,
            instanceType: new ec2.InstanceType('t2.micro')
        })

        topic.addSubscription(new subs.SqsSubscription(queue));
    }
}