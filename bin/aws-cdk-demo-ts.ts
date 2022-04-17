#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AwsCdkDemoTsStack } from '../lib/others/aws-cdk-demo-ts-stack';
import { AwsCdkDemoTsStackIAM } from '../lib/iam/aws-cdk-demo-ts-stack-iam';
import { AwsCdkDemoTsStackPolicy } from '../lib/policy/aws-cdk-demo-ts-stack-policy';
import { AwsCdkDemoTsStackProfile } from '../lib/profile/aws-cdk-demo-ts-stack-profile';
import { AwsCdkDemoTsStackSecret } from '../lib/secret/aws-cdk-demo-ts-stack-secret';
import { AwsCdkDemoTsStackSns } from "../lib/snssqs/aws-cdk-demo-ts-stack-sns";
import { AwsCdkDemoTsStackDbbRd } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-rds';
import { AwsCdkDemoTsStackDbVpc } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-vpc';
import { AwsCdkDemoTsStackDbWebServer } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-web-server';
import { AwsCdkDemoTsStackSqs } from '../lib/snssqs/aws-cdk-demo-ts-stack-sqs';
import { AwsCdkDemoTsStackLambdaLog } from '../lib/serveless/others/aws-cdk-demo-ts-stack-lambda-log';
import { AwsCdkDemoTsStackLambdaCron } from '../lib/serveless/cron/aws-cdk-demo-ts-stack-lambda-cron';
import { AwsCdkDemoTsStackLambdaDynamoDB } from '../lib/dynamodb/aws-cdk-demo-ts-stack-lambda-dynamodb';
import { AwsCdkDemoTsStackLambda } from '../lib/serveless/others/aws-cdk-demo-ts-stack-lambda';
import { AwsCdkDemoTsStackLambdaBucket } from '../lib/serveless/others/aws-cdk-demo-ts-stack-lambda-s3';
import { AwsCdkDemoTsStackLambdaGrant } from '../lib/serveless/grant/aws-cdk-demo-ts-stack-lambda-grant';
import { AwsCdkDemoTsStackLambdaApi } from '../lib/serveless/api/aws-cdk-demo-ts-stack-lambda-api';
import { AwsCdkDemoTsStackLambdaAlarm } from '../lib/serveless/alarm/aws-cdk-demo-ts-stack-lambda-alarm';
import { AwsCdkDemoTsStackLambdaMetrics } from '../lib/serveless/alarm_custom/aws-cdk-demo-ts-stack-lambda-metrics';
import { AwsCdkDemoTsStackLambdaDashboard } from '../lib/serveless/dashboard/aws-cdk-demo-ts-stack-lambda-dashboard';
import { AwsCdkDemoTsStackSite } from '../lib/site/aws-cdk-demo-ts-stack-site';
import { AwsCdkDemoTsStackCloudFront } from '../lib/site/aws-cdk-demo-ts-stack-cloudfront';
import { AwsCdkDemoTsStackS3Events } from '../lib/s3_events/aws-cdk-demo-ts-stack-s3-events';
import { AwsCdkDemoTsStackLambdaRestApi } from '../lib/restapi/aws-cdk-demo-ts-stack-lambda-rest-api';
import { AwsCdkDemoTsStackLambdaKinesis } from '../lib/kinesis/aws-cdk-demo-ts-stack-lambda-kinesis';
import { AwsCdkDemoTsStackDynamoDBStream } from '../lib/dynamodbstream/aws-cdk-demo-ts-stack-dynamodb-stream';
import { AwsCdkDemoTsStackEcs } from '../lib/ecs/aws-cdk-demo-ts-stack-ecs';
import { AwsCdkDemoTsStackEcsFargate } from '../lib/ecsfargate/aws-cdk-demo-ts-stack-ecs-fargate';
import { AwsCdkDemoTsStackEcsFargateBatch } from '../lib/ecsfargate/aws-cdk-demo-ts-stack-ecs-fargate-batch';
import { AwsCdkDemoTsStackEcsFargateChat } from '../lib/chat/aws-cdk-demo-ts-stack-ecs-fargate-chat';

const app = new cdk.App();

new AwsCdkDemoTsStack(app, 'AwsCdkDemoTsStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: app.node.tryGetContext('envs').dev.region
    }
});


new AwsCdkDemoTsStackProfile(app, 'AwsCdkDemoTsStackProfileDev', false, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: app.node.tryGetContext('envs').dev.region
    }
});

const vpc = new AwsCdkDemoTsStackDbVpc(app, 'AwsCdkDemoTsStackDbVpc', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

const webserver = new AwsCdkDemoTsStackDbWebServer(app, 'AwsCdkDemoTsStackDbWebServer', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
}, vpc.vpc);
webserver.addDependency(vpc)

const database = new AwsCdkDemoTsStackDbbRd(app, 'AwsCdkDemoTsStackDbbRd', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
}, vpc.vpc, webserver.webServer.connections.securityGroups);
database.addDependency(webserver)

new AwsCdkDemoTsStackSns(app, 'AwsCdkDemoTsStackSns', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackSqs(app, 'AwsCdkDemoTsStackSqs', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambda(app, 'AwsCdkDemoTsStackLambda', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaLog(app, 'AwsCdkDemoTsStackLambdaLog', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaBucket(app, 'AwsCdkDemoTsStackLambdaBucket', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaCron(app, 'AwsCdkDemoTsStackLambdaCron', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaDynamoDB(app, 'AwsCdkDemoTsStackLambdaDynamoDB', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaGrant(app, 'AwsCdkDemoTsStackLambdaGrant', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaApi(app, 'AwsCdkDemoTsStackLambdaApi', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaAlarm(app, 'AwsCdkDemoTsStackLambdaAlarm', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaMetrics(app, 'AwsCdkDemoTsStackLambdaMetrics', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaDashboard(app, 'AwsCdkDemoTsStackLambdaDashboard', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackSite(app, 'AwsCdkDemoTsStackSite', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackCloudFront(app, 'AwsCdkDemoTsStackCloudFront', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackS3Events(app, 'AwsCdkDemoTsStackS3Events', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaRestApi(app, 'AwsCdkDemoTsStackLambdaRestApi', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackLambdaKinesis(app, 'AwsCdkDemoTsStackLambdaKinesis', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackDynamoDBStream(app, 'AwsCdkDemoTsStackDynamoDBStream', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackEcs(app, 'AwsCdkDemoTsStackEcs', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackEcsFargate(app, 'AwsCdkDemoTsStackEcsFargate', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackEcsFargateBatch(app, 'AwsCdkDemoTsStackEcsFargateBatch', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackEcsFargateChat(app, 'AwsCdkDemoTsStackEcsFargateChat', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});


Tags.of(app).add('email', app.node.tryGetContext('envs').prod.email);