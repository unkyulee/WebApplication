REM Parameter
SET AngularPath=..\..\Frontend\angular

REM Swap index.html with index.html.prod
del %AngularPath%\src\index.html
copy /y %AngularPath%\src\index.mobile.html %AngularPath%\src\index.html

REM Swap package.json with package.original.json
del package-lock.json
del google-services.json
copy /y package.original.json package.json

REM Remove cordova build folders
RD /Q /S .\www

REM Build Angular
ECHO build angular app
pushd %AngularPath%
call node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --aot
popd
MD .\www
xcopy /s /y %AngularPath%\dist .\www

REM replace script tag
..\script\fart.exe ".\www\index.html" "<script" "<script type='text/javascript'"

REM Reset angular platform
RD /Q /S .\plugins
RD /Q /S .\platforms
call cordova platform remove android
call cordova platform add android

REM common plugin
call cordova plugin add cordova-plugin-whitelist@latest
call cordova plugin add cordova-plugin-device@latest
call cordova plugin add cordova-plugin-camera@latest
call cordova plugin add cordova-plugin-android-permissions

REM code push plugin
call cordova plugin add cordova-plugin-code-push
call cordova plugin add cordova-plugin-file@latest

REM push notification plugin
IF EXIST ".\app\google-services.json" (
    copy /y .\app\google-services.json google-services.json
    call cordova plugin add phonegap-plugin-push --variable SENDER_ID=%1
)

REM apply patch
xcopy /s /y .\patch\* .\node_modules

REM copy signing keys
copy /y .\key\app.keystore .\platforms\android\app.keystore
copy /y .\key\release-signing.properties .\platforms\android\release-signing.properties
copy /y .\key\release-signing.properties .\platforms\android\debug-signing.properties

REM Start the build
call cordova build --release android %*
