<br/>
<p align="center">
  <img src="https://raw.githubusercontent.com/donnemartin/data-science-ipython-notebooks/master/images/aws.png">
</p>
<br/>

# Examples for provisioner aws services using CDK.
The AWS CDK Toolkit is a command line tool for interacting with CDK apps. It enables developers to synthesize artifacts such as AWS CloudFormation templates, deploy stacks to development AWS accounts, and diff against a deployed stack to understand the impact of a code change.


* [AWS Services](#open-source-repos)
    * [API Gateway](#api-gateway)
    * [CloudFront](#cloudfront)
    * [CloudWatch](#cloudwatch)
    * [DynamoDB](#dynamodb)
    * [Elastic Container Service](#elastic-container-service)
    * [EC2](#ec2)
    * [Fargate](#fargate)
    * [IAM](#iam)
    * [Kinesis](#kinesis)
    * [Lambda](#lambda)
    * [RDS](#rds)
    * [S3](#s3)
    * [SNS](#sns)
    * [SQS](#sqs)
    * [SSM](#ssm)
    * [Secret Manager](#secret-manager)


# Running the example

1. Clone the [repo](https://github.com/igormgomes/aws-cdk-demo-ts) to your local environment.

2. Install the [AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [CDK](https://docs.aws.amazon.com/cdk/v2/guide/cli.html).

3. Configure the ```.aws/credentials``` with the administrator user.

4. Use the commands bellow to manage CDK. 
## Useful commands

* `npm run build`       compile typescript to js
* `npm run watch`       watch for changes and compile
* `npm run test`        perform the jest unit tests
* `cdk list`            List all stacks
* `cdk deploy {stackName}`    deploy only this stack to your default AWS account/region
* `cdk deploy --all`    deploy this stack to your default AWS account/region
* `cdk destroy`         destroy this stack to your default AWS account/region
* `cdk diff`            compare deployed stack with current state
* `cdk synth`           emits the synthesized CloudFormation template

* `cdk deploy yourstack --profile dev `   deploy this stack to your default AWS account/region