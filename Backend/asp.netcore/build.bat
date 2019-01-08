REM swap index.html with index.html.prod
copy /y ..\..\Frontend\angular\src\index.prod.html ..\..\Frontend\angular\src\index.html

REM build angular app
pushd ..\..\Frontend\angular
call build.bat
popd

REM remove wwwroot
RD /Q /S .\wwwroot

REM create wwwroot
MD .\wwwroot

REM copy angular 
xcopy /s /y ..\..\Frontend\angular\dist .\wwwroot

REM remove index.js
del .\wwwroot\index.js
