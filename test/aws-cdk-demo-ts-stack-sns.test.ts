import * as cdk from 'aws-cdk-lib';
import { Template} from 'aws-cdk-lib/assertions';
import {AwsCdkDemoTsStackSns} from "../lib/aws-cdk-demo-ts-stack-sns";

test('SQS Queue and SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new AwsCdkDemoTsStackSns(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
  template.resourceCountIs('AWS::SNS::Topic', 1);
});
