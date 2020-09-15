REM COPY UI from the parent project
RD /S /Q .\src\angular\ui
MD .\src\angular\ui
xcopy /s /y ..\angular\src\app\ui .\src\angular\ui

REM COPY core from the parent project
RD /S /Q .\src\angular\core
MD .\src\angular\core
xcopy /s /y ..\angular\src\app\core .\src\angular\core

REM COPY services from the parent project
RD /S /Q .\src\angular\services
MD .\src\angular\services
xcopy /s /y ..\angular\src\app\services .\src\angular\services
