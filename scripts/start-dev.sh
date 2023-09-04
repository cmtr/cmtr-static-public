#!/bin/bash

# Go to the root directory
echo "The script you are running has:"
echo "basename: [$(basename "$0")]"
echo "dirname : [$(dirname "$0")]"
echo "pwd     : [$(pwd)]"


# If present, delete the output / build folder
# Create output / build folder
# Copy static assets to build folder

# Run Builder (to output / script folder)

# Deploy output to AWS S3 Bucket