#!/bin/bash

# IAM Permissions required:
#   - Cloudformation DescribeStacks
#   - EFS Full Access

FS_MOUNT_TARGET=/mnt/efs/api/filesystem
SFTP_CONFIG_MOUNT_TARGET=/mnt/efs/api/sftp-config
SFTP_DATA_MOUNT_TARGET=/mnt/efs/api/sftp-data

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
    CLOUDFORMATION_STACK=api-$ENV
    ;;
*)
    echo "Error: invalid environment $ENV"
    usage
    ;;
esac

mkdir -p $FS_MOUNT_TARGET
mkdir -p $SFTP_CONFIG_MOUNT_TARGET
mkdir -p $SFTP_DATA_MOUNT_TARGET
umount $SFTP_CONFIG_MOUNT_TARGET || true
umount $SFTP_DATA_MOUNT_TARGET || true

FILESYSTEM_ID=$(get_stack_output_value "$CLOUDFORMATION_STACK" "FileSystemID")
SFTP_CONFIG_EFS_ACCESSPOINT_ID=$(get_stack_output_value "$CLOUDFORMATION_STACK" "MoodleEFSAccessPointID")
SFTP_DATA_EFS_ACCESSPOINT_ID=$(get_stack_output_value "$CLOUDFORMATION_STACK" "MoodleDataEFSAccessPointID")

mount -t efs -o tls,iam $FILESYSTEM_ID $FS_MOUNT_TARGET
mount -t efs -o tls,iam,accesspoint=$SFTP_CONFIG_EFS_ACCESSPOINT_ID $FILESYSTEM_ID $SFTP_CONFIG_MOUNT_TARGET
mount -t efs -o tls,iam,accesspoint=$SFTP_DATA_EFS_ACCESSPOINT_ID $FILESYSTEM_ID $SFTP_DATA_MOUNT_TARGET
