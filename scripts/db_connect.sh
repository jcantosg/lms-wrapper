#!/usr/bin/env bash

# IAM Permissions required:
#   - Cloudformation DescribeStacks
#   - SecretsManager GetSecretValue

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

while getopts "e:d:" opt; do
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
  CLOUDFORMATION_STACK=api-${ENV}
  ;;
*)
  echo "Error: invalid environment $ENV"
  usage
  ;;
esac

DB_SECRET=$(get_stack_output_value "$CLOUDFORMATION_STACK" "DatabaseSecretName")
db_secret_value=$(aws secretsmanager get-secret-value --secret-id "$DB_SECRET" | jq -r .SecretString)

DB_INSTANCE_ID=$(jq -r .dbInstanceIdentifier <<<"$db_secret_value")
DB_HOST=$(jq -r .host <<<"$db_secret_value")
DB_NAME=$(jq -r .dbname <<<"$db_secret_value")
DB_USERNAME=$(jq -r .username <<<"$db_secret_value")
export PGPASSWORD=$(jq -r .password <<<"$db_secret_value")
ENGINE_VERSION=$(aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --query "DBInstances[0]" | jq -r .EngineVersion)

exec docker run --rm -ti -e PGPASSWORD=$PGPASSWORD postgres:$ENGINE_VERSION psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME
