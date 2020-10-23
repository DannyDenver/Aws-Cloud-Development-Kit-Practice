import * as cdk from '@aws-cdk/core';
import * as _ec2 from '@aws-cdk/aws-ec2';
import { Vpc } from '@aws-cdk/aws-ec2';

export class Vpc3TierStack extends cdk.Stack {
    vpc: Vpc
    
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.vpc = new _ec2.Vpc(
            this,
            "websiteVpc",
            {
                cidr: '10.10.0.0/16',
                maxAzs: 2,
                natGateways: 1,
                subnetConfiguration: [
                   {
                       name: 'public',
                       cidrMask: 24,
                       subnetType: _ec2.SubnetType.PUBLIC
                   },
                   {
                       name: "app",
                       cidrMask: 24,
                       subnetType: _ec2.SubnetType.PRIVATE
                   },
                   {
                       name: "db",
                       cidrMask: 24,
                       subnetType: _ec2.SubnetType.ISOLATED
                   }
                ]
            }
        )

        new cdk.CfnOutput(this, 
            "webAppVpc",
            {
                value: this.vpc.vpcId,
                exportName: "VpcID"
            }
            )
        }
}
