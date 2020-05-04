#!/bin/bash

# swap index.html with index.html.prod
cp /y ../../Frontend/angular/src/index.prod.html ../../Frontend/angular/src/index.html

# clear wwwroot
rm -rf wwwroot
md wwwroot


# -------------------------------------------------------------
# Build angular app
# -------------------------------------------------------------
pushd ../../Frontend/angular
./build.sh
popd

cp -R ../../Frontend/angular/dist ./wwwroot

# #ove index.js
rm ./wwwroot/index.js
mv ./wwwroot/index.html angular.html


# -------------------------------------------------------------
# Build vue app
# -------------------------------------------------------------
pushd ../../Frontend/vue
./build.sh
popd

cp -R ../../Frontend/vue/dist/ ./wwwroot

# #ove index.js
rm ./wwwroot/index.js
mv ./wwwroot/index.html vue.html
