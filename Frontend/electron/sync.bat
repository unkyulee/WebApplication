REM COPY UI from the parent project
RD /S /Q .\src\app\ui
MD .\src\app\ui
xcopy /s /y ..\angular\src\app\ui .\src\app\ui

REM COPY core from the parent project
RD /S /Q .\src\app\core
MD .\src\app\core
xcopy /s /y ..\angular\src\app\core .\src\app\core

REM COPY services from the parent project
RD /S /Q .\src\app\services
MD .\src\app\services
xcopy /s /y ..\angular\src\app\services .\src\app\services
