call npm install --legacy-peer-deps
REM swap index.html with index.html.prod
copy /y ..\..\Frontend\angular\src\index.electron.html ..\..\Frontend\angular\src\index.html
copy /y .\src\index.js ..\..\Frontend\angular\src\index.js

REM clear wwwroot
RD /Q /S .\wwwroot

REM -------------------------------------------------------------
REM Build angular app
REM -------------------------------------------------------------
pushd ..\..\Frontend\angular
REM call node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --aot
call ng build
popd

MD .\wwwroot
xcopy /s /y ..\..\Frontend\angular\dist .\wwwroot\

REM call npm run-script build