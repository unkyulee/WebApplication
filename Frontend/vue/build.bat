call npm install
md .\public
copy /y .\src\index.prod.html .\public\index.html
call npm run build