#!/bin/bash
# KEEP TRAILING SLASHES ON S3 PATHS
# ./launch-html-import.sh S3://path/to/dump/ S3://path/to/html/ 10

set -ex

NUM_TASKS=$3

# Get the list of files to import
S3_FILES=$(aws s3 ls $1 | awk '{print $4}' | grep --color=never "htmls.tar.gz$")

# Split the list of files into NUM_TASKS chunks
S3_FILES_PATH=$(mktemp)
S3_FILES_SPLIT_PATH=$(mktemp -d)

aws s3 ls $1 | awk '{print $4}' | grep --color=never "htmls.tar.gz$" > $S3_FILES_PATH
split -d -n l/$NUM_TASKS $S3_FILES_PATH $S3_FILES_SPLIT_PATH/

# For each file, run the import script
for i in $(ls $S3_FILES_SPLIT_PATH)
do
  S3_SOURCE_FILES=$(cat $S3_FILES_SPLIT_PATH/$i | tr '\n' ' ')
  aws ecs run-task \
    --count 1 \
    --launch-type FARGATE \
    --cluster $ECS_CLUSTER \
    --task-definition $ECS_TASK_DEFINITION \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SECURITY_GROUP_IDS]}" \
    --overrides "{\"containerOverrides\": [{\"name\": \"data-import\", \"environment\": [{\"name\": \"S3_FILES\", \"value\": \"$S3_SOURCE_FILES\"}]\"}]}"
done
