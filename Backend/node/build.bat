REM swap index.html with index.html.prod
copy /y ..\..\Frontend\angular\src\index.prod.html ..\..\Frontend\angular\src\index.html

REM clear wwwroot
RD /Q /S .\wwwroot
MD .\wwwroot


REM -------------------------------------------------------------
REM Build angular app
REM -------------------------------------------------------------
pushd ..\..\Frontend\angular
call build.bat
popd

xcopy /s /y ..\..\Frontend\angular\dist .\wwwroot

REM remove index.js
del .\wwwroot\index.js
ren .\wwwroot\index.html angular.html


REM -------------------------------------------------------------
REM Build vue app
REM -------------------------------------------------------------
pushd ..\..\Frontend\vue3
call build.bat
popd

xcopy /s /y ..\..\Frontend\vue3\dist .\wwwroot

REM remove index.js
del .\wwwroot\index.js
ren .\wwwroot\index.html vue.html

REM create an empty favicon.ico
type NUL > .\wwwroot\favicon.ico
