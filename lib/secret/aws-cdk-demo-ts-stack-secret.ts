import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class AwsCdkDemoTsStackSecret extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const ofConcurrentsUsersParameter = new StringParameter(this, 'AwsCdkDemoTsStackSecretStringParameterNoOfConcurrentsUsers', {
            description: 'Load testing configuration',
            parameterName: 'NoOfConcurrentsUsers',
            stringValue: '100',
            tier: ParameterTier.STANDARD,
        });

        const configOfConcurrentsUsersParameter = new StringParameter(this, 'AwsCdkDemoTsStackSecretStringParameterConfigNoOfConcurrentsUsers', {
            description: 'Load testing configuration',
            parameterName: '/img/configs/NoOfConcurrentsUsers',
            stringValue: '100',
            tier: ParameterTier.STANDARD,
        });

        const durationParameter = new StringParameter(this, 'AwsCdkDemoTsStackSecretStringParameterDuration', {
            description: 'Load testing configuration',
            parameterName: '/img/configs/DurationInSec',
            stringValue: '300',
            tier: ParameterTier.STANDARD,
        });

        const customerdbSecret = new Secret(this, 'AwsCdkDemoTsStackSecretCustomerDB', {
            description: 'Customer DB password',
            secretName: 'cust_db_pass'
        })

        const userSecret = new Secret(this, 'AwsCdkDemoTsStackSecretUser', {
            description: 'Template secret for user',
            secretName: 'user_attribbutes',
            generateSecretString: {
                secretStringTemplate: JSON.stringify({"username": "john"}),
                generateStringKey: 'password'
            }
        })

        new CfnOutput(this, 'AwsCdkDemoTsStackSecretCfnOutputParam', {
            value: ofConcurrentsUsersParameter.stringValue,
            exportName: 'customVpcId'
        })

        new CfnOutput(this, 'AwsCdkDemoTsStackSecretCfnOutputPassword', {
            value: customerdbSecret.secretName,
            exportName: 'password'
        })
    }
}