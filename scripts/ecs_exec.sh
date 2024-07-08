#!/bin/bash

# IAM Permissions required:
#   - Cloudformation DescribeStacks
#   - ECS Full Access
#   - Systems Manager Full Access

usage() {
  echo "Usage: $0 -e <env> -s <service>"
  echo " <env>: dev|pre|pro"
  echo " <service>: api|cron|sftp"
  exit 2
}

get_stack_output_value() {
  local stack_name=$1
  local output_key=$2
  aws cloudformation describe-stacks --stack-name "$stack_name" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" | jq -r '.[0]'
}

while getopts "e:s:" opt; do
  case "${opt}" in
  e)
    ENV=${OPTARG}
    ;;
  s)
    ECS_SERVICE=${OPTARG}
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

case "${ECS_SERVICE}" in
api)
  CFN_OUTPUT_VALUE=APIECSServiceARN
  ECS_CONTAINER=api
  ;;
cron)
  CFN_OUTPUT_VALUE=CronECSServiceARN
  ECS_CONTAINER=cron
  ;;
sftp)
  CFN_OUTPUT_VALUE=SFTPECSServiceARN
  ECS_CONTAINER=sftpgo
  ;;
esac

SERVICE_ARN=$(get_stack_output_value "$CLOUDFORMATION_STACK" "$CFN_OUTPUT_VALUE")
ECS_TASK=$(aws ecs list-tasks --cluster $ECS_CLUSTER --service-name $SERVICE_ARN --output json | jq -r '.taskArns[0]' | cut -d/ -f3)

aws ecs execute-command \
  --cluster $ECS_CLUSTER \
  --task $ECS_TASK \
  --container $ECS_CONTAINER \
  --command "/bin/sh" \
  --interactive
