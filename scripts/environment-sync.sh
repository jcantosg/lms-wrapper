#!/bin/bash
set -e

###############################################################################
# This script synchronizes the database and media S3 bucket data
# between different AWS environments for a Backend application.
###############################################################################
export AWS_PAGER=""

SRC_ENV=pro
DST_ENV=pre

TMP_DIR=$(mktemp -d -p $HOME)

usage() {
    echo "Usage: $0 -s <source> -d <destination>"
    echo " <source>: dev|pre|pro. Defaults to pro"
    echo " <destination>: dev|pre|pro. Defaults to pre"
    exit 2
}

get_stack_output_value() {
    local stack_name=$1
    local output_key=$2
    aws cloudformation describe-stacks --stack-name "$stack_name" --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" | jq -r '.[0]'
}

while getopts "s:d:" opt; do
    case "${opt}" in
    s)
        SRC_ENV=${OPTARG}
        ;;
    d)
        DST_ENV=${OPTARG}
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

case "${SRC_ENV}" in
dev | pre | pro)
    SRC_CLOUDFORMATION_STACK=api-$SRC_ENV
    ;;
*)
    echo "Error: invalid source environment $SRC_ENV"
    usage
    ;;
esac

case "${DST_ENV}" in
dev | pre | pro)
    DST_CLOUDFORMATION_STACK=api-$DST_ENV
    ;;
*)
    echo "Error: invalid destination environment $DST_ENV"
    usage
    ;;
esac

echo
echo "[$SRC_ENV] Database backup"
./db_backup.sh -e $SRC_ENV -o $TMP_DIR

echo
echo "[$DST_ENV] Stopping containers"
API_SERVICE_ARN=$(get_stack_output_value "$DST_CLOUDFORMATION_STACK" "APIECSServiceARN")
CRON_SERVICE_ARN=$(get_stack_output_value "$DST_CLOUDFORMATION_STACK" "CronECSServiceARN")
API_DESIRED_COUNT=$(aws ecs describe-services --cluster $DST_ENV --services $API_SERVICE_ARN --query 'services[0].desiredCount')
CRON_DESIRED_COUNT=$(aws ecs describe-services --cluster $DST_ENV --services $CRON_SERVICE_ARN --query 'services[0].desiredCount')
aws ecs update-service --cluster $DST_ENV --service $API_SERVICE_ARN --desired-count 0 >/dev/null
aws ecs update-service --cluster $DST_ENV --service $CRON_SERVICE_ARN --desired-count 0 >/dev/null
aws ecs wait services-stable --cluster $DST_ENV --service $API_SERVICE_ARN
aws ecs wait services-stable --cluster $DST_ENV --service $CRON_SERVICE_ARN

echo
echo "[$DST_ENV] Database Restore"
./db_restore.sh -e $DST_ENV -d $TMP_DIR/*.dump

echo
echo "[$DST_ENV] Restarting Containers"
aws ecs update-service --cluster $DST_ENV --service $API_SERVICE_ARN --desired-count $API_DESIRED_COUNT >/dev/null
aws ecs update-service --cluster $DST_ENV --service $CRON_SERVICE_ARN --desired-count $CRON_DESIRED_COUNT >/dev/null

echo
echo "[$SRC_ENV->$DST_ENV] S3 bucket sync"
aws s3 sync s3://media-api-$SRC_ENV-eu-west-3-603941717969/ s3://media-api-$DST_ENV-eu-west-3-603941717969/ --delete --no-progress
#SRC_BUCKET=$(get_stack_output_value "$SRC_CLOUDFORMATION_STACK" "MediaBucketName")
#DST_BUCKET=$(get_stack_output_value "$DST_CLOUDFORMATION_STACK" "MediaBucketName")
#aws s3 sync s3://$SRC_BUCKET/ s3://$DST_BUCKET/ --delete --no-progress

echo
echo "[$DST_ENV] Update URLs in database for appropiate media URL."
echo "Sample SQL provided for PRO->PRE migration, please fix as required for your environment selection:"
echo "  Connect to arget DB with: ./db_connect.sh -e $DST_ENV"
echo "  UPDATE admin_users SET avatar = REPLACE(avatar, 'https://media360.universae.com', 'https://pre-media360.universae.com') WHERE avatar != '';"
echo "  UPDATE edae_users  SET avatar = REPLACE(avatar, 'https://media360.universae.com', 'https://pre-media360.universae.com') WHERE avatar != '';"
echo "  UPDATE students    SET avatar = REPLACE(avatar, 'https://media360.universae.com', 'https://pre-media360.universae.com') WHERE avatar != '';"
echo "  UPDATE subjects    SET image  = REPLACE(image,  'https://media360.universae.com', 'https://pre-media360.universae.com') WHERE image  != '';"
echo
echo "[$DST_ENV] Run additional anonymization scripits if needed."

# SRC_MEDIA_DOMAIN_NAME=$(get_stack_output_value "$SRC_CLOUDFORMATION_STACK" "MediaDomainName")
# DST_MEDIA_DOMAIN_NAME=$(get_stack_output_value "$DST_CLOUDFORMATION_STACK" "MediaDomainName")
# ./db_connect.sh -e $DST_ENV -c "UPDATE admin_users SET avatar = REPLACE(avatar, 'https://$SRC_MEDIA_DOMAIN_NAME', 'https://$DST_MEDIA_DOMAIN_NAME') WHERE avatar != '';"
# ./db_connect.sh -e $DST_ENV -c "UPDATE edae_users  SET avatar = REPLACE(avatar, 'https://$SRC_MEDIA_DOMAIN_NAME', 'https://$DST_MEDIA_DOMAIN_NAME') WHERE avatar != '';"
# ./db_connect.sh -e $DST_ENV -c "UPDATE students    SET avatar = REPLACE(avatar, 'https://$SRC_MEDIA_DOMAIN_NAME', 'https://$DST_MEDIA_DOMAIN_NAME') WHERE avatar != '';"
# ./db_connect.sh -e $DST_ENV -c "UPDATE subjects    SET avatar = REPLACE(image,  'https://$SRC_MEDIA_DOMAIN_NAME', 'https://$DST_MEDIA_DOMAIN_NAME') WHERE image  != '';"

# Cleanup
rm -rf $TMP_DIR
