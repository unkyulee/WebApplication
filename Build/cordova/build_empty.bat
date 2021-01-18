REM Swap package.json with package.original.json
del package-lock.json
del google-services.json
copy /y package.original.json package.json

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
