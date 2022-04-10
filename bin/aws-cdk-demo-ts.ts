#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AwsCdkDemoTsStack } from '../lib/aws-cdk-demo-ts-stack';
import { AwsCdkDemoTsStackCustomVpc } from '../lib/aws-cdk-demo-ts-stack-custom-vpc';
import { AwsCdkDemoTsStackIAM } from '../lib/aws-cdk-demo-ts-stack-iam';
import { AwsCdkDemoTsStackPolicy } from '../lib/aws-cdk-demo-ts-stack-policy';
import { AwsCdkDemoTsStackProfile } from '../lib/aws-cdk-demo-ts-stack-profile';
import { AwsCdkDemoTsStackSecret } from '../lib/aws-cdk-demo-ts-stack-secret';
import { AwsCdkDemoTsStackSns } from "../lib/aws-cdk-demo-ts-stack-sns";
import { AwsCdkDemoTsStackDbbRd } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-rds';
import { AwsCdkDemoTsStackDbVpc } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-vpc';
import { AwsCdkDemoTsStackDbWebServer } from '../lib/dbdata/aws-cdk-demo-ts-stack-db-web-server';

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

Tags.of(app).add('email', app.node.tryGetContext('envs').prod.email);