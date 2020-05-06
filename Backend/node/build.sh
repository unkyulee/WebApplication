#!/bin/bash

# swap index.html with index.html.prod
cp ../../Frontend/angular/src/index.prod.html ../../Frontend/angular/src/index.html

# clear wwwroot
rm -rf wwwroot
mkdir wwwroot


# -------------------------------------------------------------
# Build angular app
# -------------------------------------------------------------
pushd ../../Frontend/angular
./build.sh
popd

cp -R ../../Frontend/angular/dist/ ./wwwroot

# #ove index.js
rm ./wwwroot/index.js
mv ./wwwroot/index.html ./wwwroot/angular.html


# -------------------------------------------------------------
# Build vue app
# -------------------------------------------------------------
pushd ../../Frontend/vue
./build.sh
popd

cp -R ../../Frontend/vue/dist/ ./wwwroot

# #ove index.js
rm ./wwwroot/index.js
mv ./wwwroot/index.html ./wwwroot/vue.html
