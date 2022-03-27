#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Tags } from 'aws-cdk-lib';
import { AwsCdkDemoTsStack } from '../lib/aws-cdk-demo-ts-stack';
import { AwsCdkDemoTsStackCustomVpc } from '../lib/aws-cdk-demo-ts-stack-custom-vpc';
import { AwsCdkDemoTsStackProfile } from '../lib/aws-cdk-demo-ts-stack-profile';
import { AwsCdkDemoTsStackSecret } from '../lib/aws-cdk-demo-ts-stack-secret';
import { AwsCdkDemoTsStackSns } from "../lib/aws-cdk-demo-ts-stack-sns";

const app = new cdk.App();

new AwsCdkDemoTsStackSns(app, 'AwsCdkDemoTsStackSns', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStack(app, 'AwsCdkDemoTsStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackProfile(app, 'AwsCdkDemoTsStackProfileDev', false, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: app.node.tryGetContext('envs').dev.region
    }
});

new AwsCdkDemoTsStackProfile(app, 'AwsCdkDemoTsStackProfileProd', true, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

new AwsCdkDemoTsStackCustomVpc(app, 'AwsCdkDemoTsStackCustomVpc', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: app.node.tryGetContext('envs').prod.region
    }
});

new AwsCdkDemoTsStackSecret(app, 'AwsCdkDemoTsStackSecret', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

Tags.of(app).add('email', app.node.tryGetContext('envs').prod.email);