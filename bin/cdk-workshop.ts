#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import { Vpc3TierStack } from '../lib/vpc_3tier_stack';

const app = new cdk.App();
new Vpc3TierStack(app, 'CdkVPC3TierStack');
