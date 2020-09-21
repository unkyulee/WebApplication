REM swap index.html with index.html.prod
copy /y ..\angular\src\index.electron.html ..\angular\src\index.html
copy /y .\src\index.js ..\angular\src\index.js

REM clear wwwroot
RD /Q /S .\wwwroot



REM -------------------------------------------------------------
REM Build angular app
REM -------------------------------------------------------------
pushd ..\angular
REM call ng build --prod --aot --build-optimizer
call ng build
popd

MD .\wwwroot
xcopy /s /y ..\angular\dist .\wwwroot\
