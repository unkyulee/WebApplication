REM Parameter
SET AngularPath=..\..\Frontend\angular

REM Swap index.html with index.html.prod
copy /y %AngularPath%\src\index.mobile.html %AngularPath%\src\index.html

REM Swap package.json with package.original.json
del package-lock.json
del google-services.json
copy /y package.original.json package.json

REM Remove cordova build folders
RD /Q /S .\www
RD /Q /S .\plugins
RD /Q /S .\platforms

REM Build Angular
ECHO build angular app
pushd %AngularPath%
call build.bat
popd
MD .\www
xcopy /s /y %AngularPath%\dist .\www

REM Reset angular platform
call cordova platform remove android
call cordova platform add android

REM common plugin
call cordova plugin add cordova-plugin-whitelist@latest
call cordova plugin add cordova-plugin-device@latest
call cordova plugin add cordova-plugin-camera@latest
call cordova plugin add phonegap-plugin-barcodescanner@latest

REM code push plugin
call cordova plugin add cordova-plugin-code-push
call cordova plugin add cordova-plugin-file@latest

REM push notification plugin
xcopy /s /y /i .\app\* .\platforms\android\
copy /y .\app\google-services.json google-services.json
call cordova plugin add phonegap-plugin-push --variable SENDER_ID=%1

REM apply patch
xcopy /s /y .\patch\* .\node_modules

REM Start the build
call cordova build --release android

REM remove trash files
del 1