import * as cdk from '@aws-cdk/core';
import * as _ec2 from '@aws-cdk/aws-ec2';
import * as _elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as _iam from '@aws-cdk/aws-iam';
import * as _autoscaling from '@aws-cdk/aws-autoscaling';

import { Vpc, SubnetType } from '@aws-cdk/aws-ec2';
var fs = require('fs');


export class WebServer3TierStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, vpc: Vpc, props?: cdk.StackProps) {
        super(scope, id, props);

        var fs = require('fs');

        try {
            var data = fs.readFileSync('user_data/deploy_app.sh', 'utf8');
            console.log(data);
        } catch(e) {
            console.log('Error:', e.stack);
        }

        const linux_ami = new _ec2.AmazonLinuxImage({
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
            assumedBy: new _iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                _iam.ManagedPolicy.fromManagedPolicyArn(this, 'ssmManagedInstanceCore', 'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'),
                _iam.ManagedPolicy.fromManagedPolicyArn(this, 'AmazonS3ReadOnlyAccess', 'arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess')
            ]
        });


        const webServerASG = new _autoscaling.AutoScalingGroup(this, 'webServerAsgId', {
            vpc:vpc,
            vpcSubnets: { subnetType: SubnetType.PRIVATE},
            instanceType: new _ec2.InstanceType("t2.micro"),
            machineImage: linux_ami,
            role: webServerRole,
            minCapacity: 2,
            maxCapacity: 2,
            userData: _ec2.UserData.custom(data)
        });

        webServerASG.connections.allowFrom(alb, _ec2.Port.tcp(80), "Allows ASG Security Group receive traffic from ALB.");

        listner.addTargets("listenerId", { port: 80, targets: [webServerASG]});

        const outpubAlb = new cdk.CfnOutput(this, "albDomainNAme", {value: 'http://' + alb.loadBalancerDnsName })
    }
}
