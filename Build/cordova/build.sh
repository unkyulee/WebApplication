#!/bin/bash
AngularPath=../../Frontend/angular

# swap index.html with index.html.prod
cp $AngularPath/src/index.mobile.html $AngularPath/src/index.html

# build angular app
pushd $AngularPath
ng build --prod --aot --build-optimizer
popd

# remove folders
rm -R www
rm -R res
rm -R plugins
rm -R platforms

# create wwwroot
mkdir www

# copy angular build
cp -r $AngularPath/dist/ www

# add ios platform
cordova platform remove ios
cordova platform add ios

# build cordova
cordova plugin add cordova-plugin-whitelist@latest
cordova plugin add cordova-plugin-device@latest
cordova plugin add cordova-plugin-camera@latest
cordova plugin add phonegap-plugin-barcodescanner@latest
cordova plugin add cordova-plugin-file@latest

# build ios app
cordova run ios