REM swap index.html with index.html.prod
copy /y ..\angular\src\index.electron.html ..\angular\src\index.html
copy /y .\src\index.js ..\angular\src\index.js

REM clear wwwroot
RD /Q /S .\dist



REM -------------------------------------------------------------
REM Build angular app
REM -------------------------------------------------------------
pushd ..\angular
call ng build --prod --aot --build-optimizer
popd

MD .\dist
xcopy /s /y ..\angular\dist .\dist\
