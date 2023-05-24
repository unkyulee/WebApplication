call npm install
RD /Q /S .\dist
copy /y .\index.prod.html .\index.html
call npm run build