REM Swap package.json with package.original.json
del package-lock.json
del google-services.json
copy /y package.original.json package.json

REM Reset angular platform
RD /Q /S .\plugins
RD /Q /S .\platforms
call cordova platform remove android
call cordova platform add android

REM Plugin
call cordova plugin add cordova-plugin-whitelist@latest

REM apply patch
xcopy /s /y .\patch\* .\node_modules

REM copy signing keys
copy /y .\key\app.keystore .\platforms\android\app.keystore
copy /y .\key\release-signing.properties .\platforms\android\release-signing.properties
copy /y .\key\release-signing.properties .\platforms\android\debug-signing.properties

REM Start the build
call cordova build --release android %*
