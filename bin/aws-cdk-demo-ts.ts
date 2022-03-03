#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {AwsCdkDemoTsStack} from '../lib/aws-cdk-demo-ts-stack';
import {AwsCdkDemoTsStackSns} from "../lib/aws-cdk-demo-ts-stack-sns";

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