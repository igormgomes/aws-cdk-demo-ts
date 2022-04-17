import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { FilterPattern, LogGroup, MetricFilter } from 'aws-cdk-lib/aws-logs';
import { Alarm, ComparisonOperator, Dashboard, GraphWidget, Metric, Row, SingleValueWidget, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';

export class AwsCdkDemoTsStackLambdaDashboard extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const lambdaFile = readFileSync('./lib/serveless/dashboard/lambda_function.py', 'utf-8');
        const functionKons = new Function(this, 'AwsCdkDemoTsStackLambdaDashboardFunction', {
            functionName: 'kons_function',
            runtime: Runtime.PYTHON_3_7,
            handler: 'index.lambda_handler',
            code: new InlineCode(lambdaFile),
            timeout: Duration.seconds(3),
            reservedConcurrentExecutions: 1,
            environment: {
                'LOG_LEVEL': 'INFO',
                'PERCENTAGE_ERRORS': '75'
            }
        })

        const logGroup = new LogGroup(this, 'AwsCdkDemoTsStackLambdaDashboardLG', {
            logGroupName: '/aws/lambda/'.concat(functionKons.functionName),
            removalPolicy: RemovalPolicy.DESTROY
        });

        const metric = new Metric({
            namespace: 'third-error-metric',
            metricName: 'third_error_metric',
            label: 'total no. Of third party',
            period: Duration.minutes(1),
            statistic: 'Sum'
        });

        new MetricFilter(this, 'AwsCdkDemoTsStackLambdaDashboardMetricFilter', {
            filterPattern: FilterPattern.booleanValue('$.third_party_api_error', true),
            logGroup: logGroup,
            metricNamespace: metric.namespace,
            metricName: metric.metricName,
            defaultValue: 0,
            metricValue: '1'
        })

        new Alarm(this, 'AwsCdkDemoTsStackLambdaDashboardAlarm', {
            alarmDescription: 'Alert if 3rd party api ..',
            alarmName: 'third-party-api',
            metric: metric,
            comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            threshold: 2,
            evaluationPeriods: 2,
            datapointsToAlarm: 1,
            treatMissingData: TreatMissingData.NOT_BREACHING
        })

        const dashbooard = new Dashboard(this, 'AwsCdkDemoTsStackLambdaDashboardDashboard', {
            dashboardName: 'kons-dashboard'
        });

        dashbooard.addWidgets(
            new Row(
                new GraphWidget(
                    {
                        title: 'invocations',
                        left: [
                            functionKons.metricInvocations({
                                statistic: 'Sum',
                                period: Duration.minutes(1)
                            })
                        ]
                    }
                ),
                new GraphWidget(
                    {
                        title: 'erros',
                        left: [
                            functionKons.metricErrors({
                                statistic: 'Sum',
                                period: Duration.minutes(1)
                            })
                        ]
                    }
                )
            )
        )

        dashbooard.addWidgets(
            new Row(
                new SingleValueWidget(
                    {
                        title: 'third party errros',
                        metrics: [metric]
                    }
                )
            )
        )
    }
}