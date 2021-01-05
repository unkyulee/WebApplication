REM swap index.html with index.html.prod
copy /y ..\angular\src\index.electron.html ..\angular\src\index.html
copy /y .\src\index.js ..\angular\src\index.js

REM clear wwwroot
RD /Q /S .\wwwroot

REM -------------------------------------------------------------
REM Build angular app
REM -------------------------------------------------------------
pushd ..\angular
call node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --aot
REM call ng build
popd

MD .\wwwroot
xcopy /s /y ..\angular\dist .\wwwroot\

REM call npm run-script build