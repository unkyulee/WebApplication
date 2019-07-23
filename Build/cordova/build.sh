#!/bin/bash
AngularPath=../../Frontend/angular

# swap index.html with index.html.prod
cp $AngularPath/src/index.mobile.html $AngularPath/src/index.html

# Swap package.json with package.original.json
rm package-lock.json
rm GoogleService-Info.plist
cp package.original.json package.json

# remove folders
rm -rf www
rm -rf plugins
rm -rf platforms

# build angular app
pushd $AngularPath
ng build --prod --aot --build-optimizer
popd
mkdir www
mkdir www/assets
cp -R $AngularPath/dist/ www
cp -R ./app/assets/* www/assets

# push notification setup
cp ./app/GoogleService-Info.plist GoogleService-Info.plist

# add ios platform
cordova platform remove ios
cordova platform add ios

# build cordova
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-camera
cordova plugin add phonegap-plugin-barcodescanner

# code push plugin
cordova plugin add cordova-plugin-code-push
cordova plugin add cordova-plugin-file
cordova plugin add phonegap-plugin-push --variable SENDER_ID=%1
cordova plugin rm cordova-plugin-splashscreen

# pod install
pushd ./platforms/ios
pod install --verbose
pod 'GoogleToolboxForMac', '~> 2.1'
popd

# build ios app
cordova run ios