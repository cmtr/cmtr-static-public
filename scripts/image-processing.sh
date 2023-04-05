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

for file in $(ls $path)
do
	echo "Adding entry for '$file'"
	# source=""

	if [[ "$file" =~ .*"unsplash".* ]]; then
		source="Unsplash"
	elif [[ "$file" =~ .*"pexels".* ]]; then
		source="Pexels"
	else
		source="Unkown"
	fi

	echo "The image source is '$source'"

	filename=${file%.*}
	path=".$filename" \
	id="$filename" \
	file="$file" \
	small="/image/stock/small-200w-$file" \
	source="$source" \
	yq -i 'eval(strenv(path)) += { 
		"id": strenv(id),
		"src": "/image/stock/" + strenv(file),
		"alt": "Me alternative",
		"hover": "I, hover",
		"urls": {
			"original": "/image/stock/" + strenv(file),
			"thumbnail": "/image/stock-optimized/tumbnail-150w-" + strenv(file),
			"small": "/image/stock-optimized/small-480w-" + strenv(file),
			"medium": "/image/stock-optimized/medium-720w-" + strenv(file),
			"large": "/image/stock-optimized/large-1080w-" + strenv(file),
			"extra": "/image/stock-optimized/extra-2160w-" + strenv(file)
		},
		"paragraph": "Placeholder Image Text",
		"source": strenv(source),
		"tags": []
	}' yaml-test.yml
done