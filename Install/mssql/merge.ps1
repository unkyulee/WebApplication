Remove-Item install.sql -ErrorAction Ignore
Get-ChildItem -Path .\Core -Filter "*.sql" -Recurse | Get-Content | Add-Content -Path install.sql
Get-ChildItem -Path .\Angular -Filter "*.sql" -Recurse | Get-Content | Add-Content -Path install.sql