REM build angular app
pushd ..\angular
call build.bat
popd

REM create wwwroot
MD .\www

REM copy angular
xcopy /s /y ..\angular\dist .\www