#!/bin/bash

# IAM Permissions required:
#   - Cloudformation DescribeStacks
#   - ECS Full Access
#   - Systems Manager Full Access

usage() {
  echo "Usage: $0 -e <env> -s <service>"
  echo " <env>: dev|pre|pro"
  echo " <service>: api|cron"
  exit 2
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
  SERVICE_ARN=$(aws cloudformation describe-stack-resources --stack-name $CLOUDFORMATION_STACK | jq -r '.StackResources[].PhysicalResourceId' | grep 'arn:aws:ecs' | grep service | grep API)
  ECS_CONTAINER=api
  ;;
cron)
  SERVICE_ARN=$(aws cloudformation describe-stack-resources --stack-name $CLOUDFORMATION_STACK | jq -r '.StackResources[].PhysicalResourceId' | grep 'arn:aws:ecs' | grep service | grep Cron)
  ECS_CONTAINER=cron
  ;;
esac

ECS_TASK=$(aws ecs list-tasks --cluster $ECS_CLUSTER --service-name $SERVICE_ARN --output json | jq -r '.taskArns[0]' | cut -d/ -f3)

aws ecs execute-command \
  --cluster $ECS_CLUSTER \
  --task $ECS_TASK \
  --container $ECS_CONTAINER \
  --command "/bin/sh" \
  --interactive
