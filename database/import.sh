#!/bin/bash
set -ex

INPUT_PATH=$1
OUTPUT_PATH=$2
RSIDS_FILEPATH=$3

# Determine free memory in kB
FREE_MEMORY=$(cat /proc/meminfo | grep MemFree | tr -s ' ' | cut -d ' ' -f 2)

# The upper limit for memory usage per import.js process is 400000 kB
MEMORY_USAGE_PER_PROCESS=400000

# Determine the number of parallel processes to run
# CPU usage is not a limiting factor (it's mostly I/O bound)
NUM_PROCESSES=$(($FREE_MEMORY / $MEMORY_USAGE_PER_PROCESS))

# Split the rsids file into chunks for parallel processing
split -d -n l/$NUM_PROCESSES $RSIDS_FILEPATH /tmp/rsids.txt.

# Run the import script in parallel for each chunk
parallel node import.js \
  --sources ./sources.json \
  --input $INPUT_PATH \
  --output $OUTPUT_PATH \
  --rsids {} ::: /tmp/rsids.txt.*