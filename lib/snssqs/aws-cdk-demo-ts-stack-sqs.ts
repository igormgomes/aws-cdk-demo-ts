import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from "aws-cdk-lib/aws-sqs";
import { QueueEncryption } from 'aws-cdk-lib/aws-sqs';

export class AwsCdkDemoTsStackSqs extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, 'AwsCdkDemoTsStackSqsQueue', {
            queueName: `const-queue.fifo`,
            fifo: true,
            encryption: QueueEncryption.KMS_MANAGED,
            retentionPeriod: Duration.days(4),
            visibilityTimeout: Duration.seconds(300),
        });
   
    }
}