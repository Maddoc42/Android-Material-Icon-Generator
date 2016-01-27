#/bin/bash

githubRepo=https://github.com/google/material-design-icons
repoDir=./tmp/material-android-icons-google
assetsDir=./app/assets/material-icons
jsDataFile=./app/js/iconPicker/materialIcons.js

# pre-cleanup
rm -rf $repoDir
rm -rf $assetsDir
rm -f $jsDataFile

# clone repo
git clone $githubRepo $repoDir
echo

# create assets dir
mkdir -p $assetsDir

# iter over all icon folders
jsonOutput="[\n"
firstIter=true
for dir in $repoDir/*
do
	if [ -d "$dir/svg" ]; then
		category=$(basename $dir)
		echo Copying $category ...

		# copy icons
		mkdir $assetsDir/$category
		cp $dir/svg/production/*_48px.svg $assetsDir/$category

		# add ',' between category json objects
		if [ $firstIter = true ]; then
			firstIter=false
		else
			jsonOutput="$jsonOutput,"
			jsonOutput="$jsonOutput\n"
		fi

		# save category name
		jsonOutput="$jsonOutput\t{\n"
		jsonOutput="$jsonOutput\t\tcategory: '$category',\n"

		# save file names
		jsonOutput="$jsonOutput\t\tfileNames: [\n"
		firstFileIter=true
		for file in $dir/svg/production/*_48px.svg
		do
			if [ $firstFileIter = true ]; then
				firstFileIter=false
			else
				jsonOutput="$jsonOutput,"
				jsonOutput="$jsonOutput\n"
			fi

			filename=$(basename $file)
			jsonOutput="$jsonOutput\t\t\t'$filename'"
		done
		jsonOutput="$jsonOutput\n\t\t]\n"
		jsonOutput="$jsonOutput\t}"
	fi
done

# write json to js file
jsonOutput="$jsonOutput\n]"
jsonOutput="'use strict';\n\nmodule.exports = \n$jsonOutput;"
echo -e $jsonOutput > $jsDataFile

# cleanup tmp repo
rm -rf $repoDir
echo

echo 'Done'
