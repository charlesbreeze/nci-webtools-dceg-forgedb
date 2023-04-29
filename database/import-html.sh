#!/bin/bash
set -ex

TEMP_FOLDER=$(mktemp -d)
INPUT_FILEPATH=$TEMP_FOLDER/input.tar.gz
OUTPUT_FOLDER=$TEMP_FOLDER/output
LOGS_FOLDER=/data/logs
S3_SOURCE_PATH=$1
S3_DESTINATION_PATH=$2

# Create the output and logs folders
mkdir -p $OUTPUT_FOLDER $LOGS_FOLDER

# Download the source file from S3
aws s3 cp $S3_SOURCE_PATH $INPUT_FILEPATH || echo "download failed for: $S3_SOURCE_PATH" >> $LOGS_FOLDER/failed.txt

# Extract the source file using pigz/tar 
tar -I pigz -xf $INPUT_FILEPATH --strip-components=3 -k -C $OUTPUT_FOLDER || echo "untar failed for: $S3_SOURCE_PATH" >> $LOGS_FOLDER/failed.txt

# Upload the extracted source file to S3
aws --quiet s3 sync $OUTPUT_FOLDER $S3_DESTINATION_PATH || echo "upload failed for: $S3_SOURCE_PATH -> $S3_DESTINATION_PATH" >> $LOGS_FOLDER/failed.txt
