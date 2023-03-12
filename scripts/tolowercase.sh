#!/bin/bash

path=''
if [[ -z "$1" ]]; then
	echo "No path provided, using current working directory '$(pwd)'"
	path="$(pwd)"
elif [[ -n "$1" ]]; then
	echo "Path is not empty"
	path="$1"
	echo "The path is '$path'" 
fi

echo "The path is '$path'"

skip=0;
modify=0;
for org in $(ls $path)
do
	new=$(echo $org | awk '{print tolower($0)}')
	if [ "$org" = "$new" ]; then
		echo "'$org' - SKIP - Filename already lower case"
		skip=$((skip+1))
	else
		mv $org $new
		echo "'$org' - MODIFY - To '$new' - Filename modified to lower case"
		modify=$((modify+1));
	fi
done

echo "Files skipped: $skip"
echo "Files changed: $modify"
echo "Job Finished"
exit