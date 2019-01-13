REM swap index.html with index.html.prod
copy /y ..\angular\src\index.mobile.html ..\angular\src\index.html

REM build angular app
pushd ..\angular
call ng build
REM call build.bat
popd

REM copy angular
RD /Q /S .\www
MD .\www
xcopy /s /y ..\angular\dist .\www

call cordova platform remove android
call cordova platform add android
call cordova run android
