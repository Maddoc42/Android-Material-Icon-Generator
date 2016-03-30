#/bin/bash

githubRepo=https://github.com/google/material-design-icons
repoDir=./tmp/material-android-icons-google
assetsDir=./app/assets/img/material-icons
jadeDataFile=./app/templates/input-material-icons-data.static.jade

# pre-cleanup
rm -rf $repoDir
rm -rf $assetsDir
rm -f $jadeDataFile

# clone repo
git clone $githubRepo $repoDir
echo


# create assets dir
mkdir -p $assetsDir

# iter over all icon folders
jsonOutput="[ "
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
			jsonOutput="$jsonOutput "
		fi

		# save category name
		jsonOutput="$jsonOutput { "
		jsonOutput="$jsonOutput category: '$category', "

		# save file names
		jsonOutput="$jsonOutput fileNames: [ "
		firstFileIter=true
		for file in $dir/svg/production/*_48px.svg
		do
			if [ $firstFileIter = true ]; then
				firstFileIter=false
			else
				jsonOutput="$jsonOutput,"
				jsonOutput="$jsonOutput "
			fi

			filename=$(basename $file)
			jsonOutput="$jsonOutput '$filename'"
		done
		jsonOutput="$jsonOutput ] "
		jsonOutput="$jsonOutput }"
	fi
done

# write json to js file
jsonOutput="$jsonOutput ]"
jsonOutput="- var icons = $jsonOutput"
echo -e $jsonOutput > $jadeDataFile

# cleanup tmp repo
rm -rf $repoDir
echo

echo 'Done'
