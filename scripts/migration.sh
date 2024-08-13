#!/bin/bash

#####################
# From Bastion host #
#####################

WORK_DIR=/mnt/tmp/api

SOURCE_ENVIRONMENT=pre
TARGET_ENVIRONMENT=pro

rm -rf $WORK_DIR
mkdir -p $WORK_DIR

./db_backup.sh -e $SOURCE_ENVIRONMENT -o $WORK_DIR
./db_restore.sh -e $TARGET_ENVIRONMENT -d $(ls -tr $WORK_DIR/*.dump | tail -n1)

# Sync bucket data
aws s3 sync s3://media-api-$SOURCE_ENVIRONMENT-eu-west-3-603941717969/ s3://media-api-$TARGET_ENVIRONMENT-eu-west-3-603941717969/

# Update URLs
./db_connect.sh -e $TARGET_ENVIRONMENT
#   universae360=>UPDATE admin_users SET avatar = REPLACE(avatar, 'https://pre-media360.universae.com', 'https://media360.universae.com') WHERE avatar != '';
#   universae360=>UPDATE edae_users  SET avatar = REPLACE(avatar, 'https://pre-media360.universae.com', 'https://media360.universae.com') WHERE avatar != '';
#   universae360=>UPDATE students    SET avatar = REPLACE(avatar, 'https://pre-media360.universae.com', 'https://media360.universae.com') WHERE avatar != '';
#   universae360=>UPDATE subjects    SET image  = REPLACE(image,  'https://pre-media360.universae.com', 'https://media360.universae.com') WHERE image  != '';
