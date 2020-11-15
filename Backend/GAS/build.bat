pushd frontend
call npm run build
popd
copy .\frontend\dist\index.html .\src\index.html