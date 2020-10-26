#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import { Vpc3TierStack } from '../lib/vpc_3tier_stack';
import { WebServer3TierStack } from '../lib/web_server_3tier_stack';
import { RdsDatabase3TierStack } from '../lib/rds_3tier_stack';

const app = new cdk.App();
const vpcStack = new Vpc3TierStack(app, 'CdkVPC3TierStack');
new WebServer3TierStack(app, "webServer3TierStack", vpcStack.vpc);
new RdsDatabase3TierStack(app, "rdsDatabase", vpcStack.vpc);
