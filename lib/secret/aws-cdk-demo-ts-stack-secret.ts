import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class AwsCdkDemoTsStackSecret extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const param1 = new StringParameter(this, 'AwsCdkDemoTsStackSecretSSM1', {
            description: 'Load testing configuration',
            parameterName: 'NoOfConcurrentsUsers',
            stringValue: '100',
            tier: ParameterTier.STANDARD,
        });

        const param2 = new StringParameter(this, 'AwsCdkDemoTsStackSecretSSM2', {
            description: 'Load testing configuration',
            parameterName: '/img/configs/NoOfConcurrentsUsers',
            stringValue: '100',
            tier: ParameterTier.STANDARD,
        });

        const param3 = new StringParameter(this, 'AwsCdkDemoTsStackSecretSSM3', {
            description: 'Load testing configuration',
            parameterName: '/img/configs/DurationInSec',
            stringValue: '300',
            tier: ParameterTier.STANDARD,
        });

        const secret1 = new Secret(this, 'AwsCdkDemoTsStackSecretSecret', {
            description: 'Customer DB password',
            secretName: 'cust_db_pass'
        })

        const secret2 = new Secret(this, 'AwsCdkDemoTsStackSecretSecret2', {
            description: 'Template secret for user',
            secretName: 'user_attribbutes',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({"username": "john"}),
                generateStringKey: 'password'
            }
        })

        new CfnOutput(this, 'AwsCdkDemoTsStackSecretCFN', {
            value: param1.stringValue,
            exportName: 'customVpcId'
        })

        new CfnOutput(this, 'AwsCdkDemoTsStackSecretCFNPassword', {
            value: secret1.secretName,
            exportName: 'password'
        })
    }
}