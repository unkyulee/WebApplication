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

call cordova plugin add cordova-plugin-whitelist@latest
call cordova plugin add cordova-plugin-device@latest
call cordova plugin add cordova-plugin-camera@latest
call cordova plugin add phonegap-plugin-barcodescanner@latest
call cordova plugin remove cordova-plugin-file
call cordova plugin add cordova-plugin-code-push
call cordova plugin add cordova-plugin-file@latest

REM copy keys
xcopy /s /y .\app\* .\platforms\android

call cordova build --release android
