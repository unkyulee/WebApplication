REM clear wwwroot
RD /Q /S .\wwwroot
MD .\wwwroot

REM -------------------------------------------------------------
REM Build vue app
REM -------------------------------------------------------------
pushd ..\..\Frontend\vue
call build.gas.bat
popd

copy ..\..\Frontend\vue\dist\index.html .\wwwroot\index.html
