# swap index.html with index.html.prod
cp ../angular/src/index.electron.html ../angular/src/index.html
cp ./src/index.js ../angular/src/index.js

# clear wwwroot
rm -rf ./wwwroot

# -------------------------------------------------------------
# Build angular app
# -------------------------------------------------------------
pushd ../angular
npm install
ng build --prod --aot --build-optimizer
#call ng build
popd

mkdir ./wwwroot
cp -R ../angular/dist/* ./wwwroot/

npm install
npm run-script build-mac