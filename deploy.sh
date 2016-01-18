#/bin/bash

repoDir=/tmp/material-android-icons-deploy
buildDir=./public
version=`grep -Po '"'"version"'"\s*:\s*"\K([^"]*)' package.json`

# pre-cleanup
rm -rf $repoDir

# clone repo
git clone -b gh-pages git@github.com:Maddoc42/MaterialIconsGenerator.git $repoDir
echo

# build project
brunch build --production
echo

# cp files
cd $repoDir
git rm -r *
cd -
cp -r $buildDir/* $repoDir
echo

# commit + push
cd $repoDir
git add --all .
git commit -m "Publish version $version"
git push
cd -
echo

# cleanup
rm -rf $repoDir
echo
