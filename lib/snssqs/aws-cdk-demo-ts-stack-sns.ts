import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";

export class AwsCdkDemoTsStackSns extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, 'AwsCdkDemoTsQueue', {
            visibilityTimeout: Duration.seconds(300),
            queueName: `test-queue`
        });

        const topic = new sns.Topic(this, 'AwsCdkDemoTsTopic', {
            topicName: 'test-topic'
        });
        topic.addSubscription(new subs.SqsSubscription(queue));
    }
}