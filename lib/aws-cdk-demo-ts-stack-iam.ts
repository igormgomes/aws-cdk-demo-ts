import { aws_iam, CfnOutput, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Effect, Group, ManagedPolicy, Policy, PolicyDocument, PolicyStatement, Role, User } from 'aws-cdk-lib/aws-iam';

export class AwsCdkDemoTsStackIAM extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const user1Pass = new Secret(this, 'AwsCdkDemoTsStackIAMSecret', {
            description: 'Password for User1',
            secretName: 'user1_pass'
        })

        const user1 = new User(this, 'AwsCdkDemoTsStackIAMUser1', {
            password: user1Pass.secretValue,
            userName: 'user1'
        })

        const user2 = new User(this, 'AwsCdkDemoTsStackIAMUser2', {
            password: SecretValue.plainText('Dont-Use-B@D-Passw0rds'),
            userName: 'user2'
        })

        const groupKon = new Group(this, 'AwsCdkDemoTsStackIAMGroup', {
            groupName: 'konstone_group'
        })
        groupKon.addUser(user1)

        groupKon.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'))

        const param1 = new StringParameter(this, 'AwsCdkDemoTsStackIAMSSM1', {
            description: 'Keys to Kon',
            parameterName: '/konstone/keys/fish',
            stringValue: '130481',
            tier: ParameterTier.STANDARD,
        });

        const param2 = new StringParameter(this, 'AwsCdkDemoTsStackIAMSSM2', {
            description: 'Keys to Kon',
            parameterName: '/konstone/keys/fish/gold',
            stringValue: '130482',
            tier: ParameterTier.STANDARD,
        });

        param1.grantRead(groupKon)

        const policyStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ["*"],
            actions: [
                "ssm:DescribeParameters"
            ]
        })
        policyStatement.sid = 'DescribeAllParametersInConsole'

        groupKon.addToPolicy(policyStatement)

        const konRole = new Role(this, 'AwsCdkDemoTsStackIAMRole', {
            assumedBy: new aws_iam.AccountPrincipal(Stack.of(this).account),
            roleName: "kon_ops_role"
        })

        new ManagedPolicy(this, 'AwsCdkDemoTsStackIAMManagedPolicy', {
            description: 'LIST EC2',
            managedPolicyName: 'list_ec2_policy',
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    resources: ["*"],
                    actions: [
                        "ec2:Describe*",
                        "cloudwatch:Describe*",
                        "cloudwatch:Get*",
                    ]
                })
            ],
            roles: [
                konRole
            ]
        })


        new CfnOutput(this, 'AwsCdkDemoTsStackIAMLogin', {
            description: 'LoginUrl for user2',
            value: 'http://'.concat(Stack.of(this).account ).concat('.signin.aws.amazon.com/console')
        })
    }
}