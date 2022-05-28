#!/bin/bash

bucket="cmtr.io"
changed=0

echo `date +"%Y-%m-%d-%T"` - Check for update to public site

## got to project root folder
cd ..



# check for updates on cms
echo `date +"%Y-%m-%d-%T"` - Check for updates on content
cd cms-public
hostChanged=0;
git remote update > /dev/null 2>&1
git status -uno | grep -q 'Your branch is behind' && hostChanged=$((hostChanged+1))
changed=$(($changed+$hostChanged))

if [ "$hostChanged" -gt "0" ]; then
	echo `date +"%Y-%m-%d %T"` - Something changed on content
	
	echo `date +"%Y-%m-%d-%T"` - Updating repository
	git pull

else
	echo `date +"%Y-%m-%d %T"` - Nothing changed on content
fi

cd ..



# check for updates on host
echo `date +"%Y-%m-%d-%T"` - Check for updates on host
cd public
hostChanged=0;
git remote update > /dev/null 2>&1
git status -uno | grep -q 'Your branch is behind' && hostChanged=$((hostChanged+1))
changed=$(($changed+$hostChanged))

if [ "$hostChanged" -gt "0" ]; then
	echo `date +"%Y-%m-%d %T"` - Something changed on host site

	echo `date +"%Y-%m-%d-%T"` - Start Docker Container cmtr-public
	npm run stop-docker

	echo `date +"%Y-%m-%d-%T"` - Updating repository
	git pull
	
	echo `date +"%Y-%m-%d-%T"` - Building Docker Image cmtr-public
	npm run build
	
	echo `date +"%Y-%m-%d-%T"` - Start Docker Container cmtr-public
	npm run start-docker
else
	echo `date +"%Y-%m-%d %T"` - Nothing changed on host site
fi

cd ..



# check for updates on page-crawler
echo `date +"%Y-%m-%d-%T"` - Check for updates on scraper
cd page-crawler


hostChanged=0;
git remote update > /dev/null 2>&1
git status -uno | grep -q 'Your branch is behind' && hostChanged=$((hostChanged+1))
changed=$(($changed+$hostChanged))


if [ "$hostChanged" -gt "0" ]; then
	echo `date +"%Y-%m-%d %T"` - Something changed on host site

	echo `date +"%Y-%m-%d-%T"` - Updating repository
	git pull

	echo `date +"%Y-%m-%d-%T"` - Update dependencies
	npm install

	echo `date +"%Y-%m-%d-%T"` - Scraping Content
	npm run start-prod

else
	echo `date +"%Y-%m-%d %T"` - Nothing changed on scraper
fi

cd ..



if [ "$changed" -gt "0" ]; then

	# Update static file host
	echo `date +"%Y-%m-%d %T"` - Start update to public site required

	# start host
	echo `date +"%Y-%m-%d %T"` - Start host
	cd public
	hostLogFileName="../logs/`date +"%Y-%m-%d-%T"`-host-log.txt"
	echo $hostLogFileName > $hostLogFileName

	cd ..

	# start scraper
	echo `date +"%Y-%m-%d %T"` - Scrape content
	cd page-crawler
	scraperLogFileName="../logs/`date +"%Y-%m-%d-%T"`-scrape-log.txt"
	echo $scraperLogFileName > $scraperLogFileName
	cd ..

	# stop host
	echo `date +"%Y-%m-%d %T"` - Stop host

	# map scraped content
	fileListFileName="../../logs/`date +"%Y-%m-%d-%T"`-file-list.txt"
	# touch $fileListFileName
	echo `date +"%Y-%m-%d %T"` - Upload content
	cd page-crawler/output
	for file in $(find $(pwd) -type f -not -path '*/\.*' | sort)
	do
		echo $file ${file#"$(pwd)"} >> $fileListFileName
	done
	cd ../..
	
	# map public content folder on host
	echo `date +"%Y-%m-%d %T"` - Upload host public content
	cd public/public
	for file in $(find $(pwd) -type f -not -path '*/\.*' | sort)
	do
		echo $file ${file#"$(pwd)"} >> $fileListFileName
	done

	# evalute to just copy files to same folder and use "aws s3 sync" instead

	# Sync with S3
	while read file; do
		path=$(echo $file | head -n1 | awk '{print $1;}')
		key=$(echo $file | head -n1 | awk '{print $2;}')
		echo "`date +"%Y-%m-%d %T"` - $(aws s3 cp $path s3://$bucket$key --acl public-read)"
	done < $fileListFileName

	cd ../..

	echo `date +"%Y-%m-%d %T"` - End update to public site required


	# delete scraped content
	echo `date +"%Y-%m-%d %T"` - Delete local content
	# rm -r page-crawler/copy


else
	echo `date +"%Y-%m-%d %T"` - Nothing changed on public site
fi

echo `date +"%Y-%m-%d-%T"` - Finish update to public site