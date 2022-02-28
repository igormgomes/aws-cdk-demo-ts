#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {AwsCdkDemoTsStack} from '../lib/aws-cdk-demo-ts-stack';

const app = new cdk.App();
new AwsCdkDemoTsStack(app, 'AwsCdkDemoTsStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});