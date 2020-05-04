npm install
rm -rf ./dist
cp ./src/index.prod.html ./src/index.html
ng build --prod --aot --build-optimizer
