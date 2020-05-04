call npm install
RD /S /Q .\dist
copy /y .\src\index.prod.html .\src\index.html
call ng build --prod --aot --build-optimizer
