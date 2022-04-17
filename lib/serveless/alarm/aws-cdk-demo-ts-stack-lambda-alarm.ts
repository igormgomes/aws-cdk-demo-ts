import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { AmazonLinuxEdition, AmazonLinuxGeneration, AmazonLinuxImage, AmazonLinuxStorage, AmazonLinuxVirt, Instance, InstanceType, Port, SubnetType, UserData, Vpc } from 'aws-cdk-lib/aws-ec2';
import { readFileSync } from 'fs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Alarm, ComparisonOperator, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';

export class AwsCdkDemoTsStackLambdaAlarm extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const topic = new Topic(this, 'AwsCdkDemoTsStackLambdaAlarmTopic', {
            topicName: 'kon-topic',
            displayName: 'Support for problems'
        });

        const emailSubscription = new EmailSubscription('email@gmail.com')
        topic.addSubscription(emailSubscription)

        const vpc = new Vpc(this, 'AwsCdkDemoTsStackLambdaAlarmVpc', {
            cidr: '10.0.0.0/24',
            maxAzs: 2,
            natGateways: 0,
            subnetConfiguration: [
                {
                    name: 'public',
                    subnetType: SubnetType.PUBLIC,
                }
            ]
        })

        const linuxAmi = new AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
            edition: AmazonLinuxEdition.STANDARD,
            virtualization: AmazonLinuxVirt.HVM,
            storage: AmazonLinuxStorage.EBS
        })

        const file = readFileSync('./lib/serveless/alarm/http.sh', 'utf-8');
        const instance = new Instance(this, 'AwsCdkDemoTsStackLambdaAlarmInstance', {
            instanceType: new InstanceType('t2.micro'),
            instanceName: 'web',
            machineImage: linuxAmi,
            vpc: vpc,
            vpcSubnets: { subnetType: SubnetType.PUBLIC },
            userData: UserData.custom(file)
        })
        instance.connections.allowFromAnyIpv4(Port.tcp(80), 'allow web')
        instance.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'))

        const lambdaFile = readFileSync('./lib/serveless/alarm/lambda_function.py', 'utf-8');
        const functionKons = new Function(this, 'AwsCdkDemoTsStackLambdaAlarmFunction', {
            functionName: 'kons_function',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(lambdaFile),
            timeout: Duration.seconds(3),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'INFO',
                'AUTOMATION': 'SKON'
            }
        })

        const ec2Metric = new Metric({
            namespace: 'AWS/EC2',
            metricName: 'CPUUtilization',
            dimensionsMap: {
                "InstanceId": instance.instanceId
            },
            period: Duration.minutes(5)
        });

        const cpuAlarm = new Alarm(this, 'AwsCdkDemoTsStackLambdaAlarmCPU', {
            alarmDescription: 'Alert if CPU is ..',
            alarmName: 'low-cpu-alarm',
            actionsEnabled: true,
            metric: ec2Metric,
            threshold: 10,
            comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
            evaluationPeriods: 1,
            datapointsToAlarm: 1,
            treatMissingData: TreatMissingData.NOT_BREACHING
        });
        cpuAlarm.addAlarmAction(new SnsAction(topic))

        const lambbdAlarm = new Alarm(this, 'AwsCdkDemoTsStackLambdaAlarmMetricLambda', {
            alarmDescription: 'Alert if Lambda ..',
            alarmName: 'lambda-alarm',
            metric: functionKons.metricErrors(),
            threshold: 2,
            evaluationPeriods: 1,
            datapointsToAlarm: 1
        });
        lambbdAlarm.addAlarmAction(new SnsAction(topic))
    }
}