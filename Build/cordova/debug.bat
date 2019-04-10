SET AngularPath=..\..\Frontend\angular

REM swap index.html with index.html.prod
copy /y %AngularPath%\src\index.mobile.html %AngularPath%\src\index.html

REM build angular app
pushd %AngularPath%
call ng build
REM call build.bat
popd

REM copy angular
RD /Q /S .\www
MD .\www
xcopy /s /y %AngularPath%\dist .\www

call cordova platform remove android
call cordova platform add android
call cordova run android
