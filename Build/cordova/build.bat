SET AngularPath=..\..\Frontend\angular

REM swap index.html with index.html.prod
copy /y %AngularPath%\src\index.mobile.html %AngularPath%\src\index.html

REM build angular app
pushd %AngularPath%
call build.bat
popd

REM remove wwwroot
RD /Q /S .\www
RD /Q /S .\res
RD /Q /S .\plugins
RD /Q /S .\platforms

REM create wwwroot
MD .\www

REM copy angular
xcopy /s /y %AngularPath%\dist .\www

call cordova platform remove android
call cordova platform add android

call cordova plugin add cordova-plugin-whitelist
call cordova plugin add cordova-plugin-device
call cordova plugin add cordova-plugin-camera
call cordova plugin add phonegap-plugin-barcodescanner
call cordova plugin add cordova-plugin-file
call cordova plugin add cordova-plugin-image-picker

REM copy keys
xcopy /s /y .\app\* .\platforms\android

call cordova build --release android
