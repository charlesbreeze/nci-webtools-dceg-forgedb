#!/bin/bash
set -ex

TEMP_FOLDER=$(mktemp -d)
INPUT_FILEPATH=$TEMP_FOLDER/input.tar.gz
OUTPUT_FOLDER=$TEMP_FOLDER/output
S3_SOURCE_PATH=$1
S3_DESTINATION_PATH=$2

# Set max concurrent requests (higher = faster for larger numbers of small files)
aws configure set default.s3.max_concurrent_requests 20

# Create the output folder
mkdir -p $OUTPUT_FOLDER

# Download the source file from S3
aws s3 cp --only-show-errors $S3_SOURCE_PATH $INPUT_FILEPATH

# Extract the source file using pigz/tar 
tar -I pigz -xf $INPUT_FILEPATH --strip-components=3 -k -C $OUTPUT_FOLDER

# Upload the extracted source file to S3
aws s3 cp --recursive --exclude "*" --include "*.html" --only-show-errors $OUTPUT_FOLDER $S3_DESTINATION_PATH

echo "Done"