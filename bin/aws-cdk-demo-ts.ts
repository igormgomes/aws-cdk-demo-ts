#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AwsCdkDemoTsStack } from '../lib/others/aws-cdk-demo-ts-stack';
import { AwsCdkDemoTsStackCustomVpc } from '../lib/others/aws-cdk-demo-ts-stack-custom-vpc';
import { AwsCdkDemoTsStackIAM } from '../lib/iam/aws-cdk-demo-ts-stack-iam';
import { AwsCdkDemoTsStackPolicy } from '../lib/policy/aws-cdk-demo-ts-stack-policy';
import { AwsCdkDemoTsStackProfile } from '../lib/profile/aws-cdk-demo-ts-stack-profile';
import { AwsCdkDemoTsStackSecret } from '../lib/secret/aws-cdk-demo-ts-stack-secret';
import { AwsCdkDemoTsStackSns } from "../lib/snssqs/aws-cdk-demo-ts-stack-sns";
import { AwsCdkDemoTsStackDbbRd } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-rds';
import { AwsCdkDemoTsStackDbVpc } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-vpc';
import { AwsCdkDemoTsStackDbWebServer } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-web-server';
import { AwsCdkDemoTsStackSqs } from '../lib/snssqs/aws-cdk-demo-ts-stack-sqs';
import { AwsCdkDemoTsStackLambda } from '../lib/serveless/aws-cdk-demo-ts-stack-lambda';
import { AwsCdkDemoTsStackLambdaLog } from '../lib/serveless/aws-cdk-demo-ts-stack-lambda-log';
import { AwsCdkDemoTsStackLambdaBucket } from '../lib/serveless/aws-cdk-demo-ts-stack-lambda-s3';

const app = new cdk.App();

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

Tags.of(app).add('email', app.node.tryGetContext('envs').prod.email);