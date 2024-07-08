#!/bin/bash

# IAM Permissions required:
#   - Cloudformation DescribeStacks
#   - ECS Full Access

usage() {
  echo "Usage: $0 -e <env>"
  echo " <env>: dev|pre|pro"
  exit 2
}

get_stack_output_value() {
  local stack_name=$1
  local output_key=$2
  aws cloudformation describe-stacks --stack-name "$stack_name" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" | jq -r '.[0]'
}

while getopts "e:" opt; do
  case "${opt}" in
  e)
    ENV=${OPTARG}
    ;;
  :)
    echo "Error: -${OPTARG} requires an argument."
    usage
    ;;
  *)
    usage
    ;;
  esac
done

case "${ENV}" in
dev | pre | pro)
  export AWS_DEFAULT_REGION=eu-west-3
  ECS_CLUSTER=$ENV
  CLOUDFORMATION_STACK=api-$ENV
  ;;
*)
  echo "Error: invalid environment $ENV"
  usage
  ;;
esac

API_SERVICE_ARN=$(get_stack_output_value "$CLOUDFORMATION_STACK" "APIECSServiceARN")
CRON_SERVICE_ARN=$(get_stack_output_value "$CLOUDFORMATION_STACK" "CronECSServiceARN")
SFTP_SERVICE_ARN=$(get_stack_output_value "$CLOUDFORMATION_STACK" "SFTPECSServiceARN")

aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $API_SERVICE_ARN \
  --force-new-deployment

aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $CRON_SERVICE_ARN \
  --force-new-deployment

aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $SFTP_SERVICE_ARN \
  --force-new-deployment

echo "Waiting for services to become stable"
aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services $API_SERVICE_ARN

aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services $CRON_SERVICE_ARN

aws ecs wait services-stable \
  --cluster $ECS_CLUSTER \
  --services $SFTP_SERVICE_ARN
