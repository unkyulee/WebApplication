REM call npm install
RD /Q /S .\dist
REM copy /y .\index.prod.html .\index.html
call npm run build