#!/bin/bash

# Paths to static and dynamic content
STATIC_CONTENT="static"
DYNAMIC_CONTENT="build"

# Build directory
BUILD_DIR="release"

# S3 Bucket
S3_BUCKET="s3://cmtr.io"

# Create or clear out the build directory
rm -rf $DYNAMIC_CONTENT
mkdir -p $DYNAMIC_CONTENT

# Run the build script
node ./builder/build.js $DYNAMIC_CONTENT

rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy static and dynamic content to the build directory
cp -r $STATIC_CONTENT/* $BUILD_DIR/
cp -r $DYNAMIC_CONTENT/* $BUILD_DIR/

# Sync the build directory with the S3 bucket
aws s3 sync $BUILD_DIR $S3_BUCKET -acl public-read --dryrun

echo "Sync completed successfully"
