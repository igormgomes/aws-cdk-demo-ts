import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine } from 'aws-cdk-lib/aws-rds';

export class AwsCdkDemoTsStackDbbRd extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps, vpc?: IVpc, securtyGroups?: ISecurityGroup[]) {
        super(scope, id, props);

        if (typeof vpc == 'undefined') {
            throw 'Invalid vpc'
        }

        if (typeof securtyGroups == 'undefined') {
            throw 'Invalid ISecurityGroup'
        }

        const credentials = Credentials.fromGeneratedSecret('mofizin')

        const database = new DatabaseInstance(this, 'AwsCdkDemoTsStackDbVpcRDS', {
            credentials: credentials,
            databaseName: 'konstonedb',
            engine: DatabaseInstanceEngine.MYSQL,
            vpc: vpc,
            port: 3306,
            allocatedStorage: 30,
            multiAz: false,
            cloudwatchLogsExports: ['audit', 'error', 'general', 'slowquery'],
            instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false,
            deleteAutomatedBackups: true,
            backupRetention: Duration.days(7)
        })

        for (var securtiGroup of securtyGroups) {
            database.connections.allowDefaultPortFrom(securtiGroup, 'Allow EC2 ASG')
        }

        new CfnOutput(this, 'DatabaseCommand', {
            value: 'mysql -h '.concat(database.dbInstanceEndpointAddress).concat('-P 3306 -u ').concat(credentials.username).concat('-p ') + credentials.password?.toJSON,
            description: 'connect to the database'
        })
    }
}