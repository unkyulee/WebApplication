call npm install
md .\public
copy /y .\index.prod.html .\public\index.html
call npm run build