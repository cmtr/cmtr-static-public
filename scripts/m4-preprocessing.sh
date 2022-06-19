#!/bin/bash

echo "M4 File Pre-processing Start" 

find . -type f -name "*.m4" -print0 |
while read -r -d '' file
do
	outputFilePath=${file/.m4/}
	workingDir=$(dirname $file)
	echo "Pre-processing '$file' with working directory '$workingDir' and output to '$outputFilePath'"
	m4 -I $workingDir $file | tee $outputFilePath
done

echo "M4 File Fre-processing Finish" 
