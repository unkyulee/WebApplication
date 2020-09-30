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

REM replace script tag
..\script\fart.exe ".\www\index.html" "<script" "<script type='text/javascript'"

REM call cordova platform remove android
REM call cordova platform add android
call cordova run android
