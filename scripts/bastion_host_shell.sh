#!/bin/bash

# IAM Permissions required:
#   - EC2 Read
#   - Systems Manager Full Access

INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=BastionHost" --query "Reservations[*].Instances[*].InstanceId" --output text)

exec aws ssm start-session --target $INSTANCE_ID
