REM swap index.html with index.html.prod
copy /y ..\angular\src\index.mobile.html ..\angular\src\index.html

REM build angular app
pushd ..\angular
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
xcopy /s /y ..\angular\dist .\www

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
