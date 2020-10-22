import * as cdk from '@aws-cdk/core';
import * as _ec2 from '@aws-cdk/aws-ec2';
import * as _elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as _iam from '@aws-cdk/aws-iam';

import { Vpc } from '@aws-cdk/aws-ec2';


export class WebServer3TierStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, vpc: Vpc, props?: cdk.StackProps) {
        super(scope, id, props);

        const linux = new _ec2.AmazonLinuxImage({
            generation: _ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            edition: _ec2.AmazonLinuxEdition.STANDARD,
            virtualization: _ec2.AmazonLinuxVirt.HVM,
            storage: _ec2.AmazonLinuxStorage.GENERAL_PURPOSE
        })

        const alb = new _elb.ApplicationLoadBalancer(this, 'web-alb', {
            vpc: vpc,
            internetFacing: true,
            loadBalancerName: "WebServerAlb"
        })

        const listner = alb.addListener("listnerId", { port: 80, open: true });

        const webServerRole = new _iam.Role(this, "webServerRoleId", {
            assumedBy: new _iam.ServicePrincipal('ec2.amazon.com'),
            managedPolicies: [
                _iam.ManagedPolicy.fromManagedPolicyName(this, 'ssmManagedInstanceCore', 'AmazonSSMManagedInstanceCore')
            ]
        })
    }
}
