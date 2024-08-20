#!/bin/bash

#######################
# From preprod server #
#######################

POSTGRES_VERSION=16.2

DB_HOST=universae_db
DB_NAME=universae
DB_USERNAME=universae
PGPASSWORD=easrevinu

DUMP_NAME=${DB_NAME}.$(date +"%Y%m%d").dump

docker run \
    --rm \
    -e PGPASSWORD=$PGPASSWORD \
    -v $(pwd):/backups \
    --network=universae-network \
    postgres:$POSTGRES_VERSION \
    pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_USERNAME -Fc -f /backups/$DUMP_NAME

export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=

aws s3 cp $DUMP_NAME s3://universae360-migration-eu-west-3-603941717969/api/

#####################
# From Bastion host #
#####################

TARGET_ENVIRONMENT=dev

aws s3 cp s3://universae360-migration-eu-west-3-603941717969/api/$DUMP_NAME .

# TODO: shutdown all API containers to close existing connections

./db_restore.sh -e $TARGET_ENVIRONMENT -d ./$DUMP_NAME

# Sync bucket data
aws s3 sync s3://sga-media/ s3://media-api-$TARGET_ENVIRONMENT-eu-west-3-603941717969/

# Update URLs
./db_connect.sh -e $TARGET_ENVIRONMENT
#   universae360=>UPDATE admin_users SET avatar = REPLACE(avatar, 'https://sga-media.s3.eu-west-3.amazonaws.com', 'https://media-api-dev-eu-west-3-603941717969.universae.com') WHERE avatar != '';
#   universae360=>UPDATE edae_users  SET avatar = REPLACE(avatar, 'https://sga-media.s3.eu-west-3.amazonaws.com', 'https://media-api-dev-eu-west-3-603941717969.universae.com') WHERE avatar != '';
#   universae360=>UPDATE students    SET avatar = REPLACE(avatar, 'https://sga-media.s3.eu-west-3.amazonaws.com', 'https://media-api-dev-eu-west-3-603941717969.universae.com') WHERE avatar != '';
#   universae360=>UPDATE subjects    SET image  = REPLACE(image,  'https://sga-media.s3.eu-west-3.amazonaws.com', 'https://media-api-dev-eu-west-3-603941717969.universae.com') WHERE image  != '';
