#!/bin/bash
set -ex

# Set max concurrent requests (higher = faster for larger numbers of small files)
aws configure set default.s3.max_concurrent_requests 100

# Get the list of files to import
files=$(aws s3 ls $S3_SOURCE_PATH/ | awk '{print $4}' | grep --color=never "htmls.tar.gz")

# For each file, run the import
# Note that this is not parallelized due to PutObject rate limits on the same key prefix
for file in $files
do
  TEMP_FOLDER=$(mktemp -d)
  INPUT_FILEPATH=$TEMP_FOLDER/input.tar.gz
  OUTPUT_FOLDER=$TEMP_FOLDER/output

  # Create the output folder
  mkdir -p $OUTPUT_FOLDER

  # Download the source file from S3
  aws s3 cp --only-show-errors $S3_SOURCE_PATH/$file $INPUT_FILEPATH

  # Extract the source file using pigz/tar 
  tar -I pigz -xf $INPUT_FILEPATH --strip-components=3 -k -C $OUTPUT_FOLDER

  # Upload the extracted source file to S3
  aws s3 cp --recursive --exclude "*" --include "*.html" --only-show-errors $OUTPUT_FOLDER $S3_DESTINATION_PATH

  # Remove the temporary directory
  rm -rf $TEMP_FOLDER

  echo "Extracted $file to $S3_DESTINATION_PATH"
done
