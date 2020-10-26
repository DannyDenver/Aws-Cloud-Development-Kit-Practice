import * as cdk from '@aws-cdk/core';
import * as _ec2 from '@aws-cdk/aws-ec2';

import { Vpc, SubnetType, InstanceType, InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2';
import * as _rds from '@aws-cdk/aws-rds';
import { DatabaseCluster, DatabaseClusterEngine } from '@aws-cdk/aws-rds';
import { RemovalPolicy, Duration } from '@aws-cdk/core';

export class RdsDatabase3TierStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, vpc: Vpc, props?: cdk.StackProps) {
        super(scope, id, props);

        const db = new _rds.DatabaseInstance(this, "webAppdb", {
            engine: _rds.DatabaseInstanceEngine.MYSQL,
            
            vpc: vpc,
            vpcSubnets: { subnetType: SubnetType.ISOLATED},
            port: 3306,
            allocatedStorage: 10,
            multiAz: false,
            instanceType: _ec2.InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: true,
        })
    }
}