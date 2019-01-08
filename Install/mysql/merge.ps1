Remove-Item install.sql -ErrorAction Ignore
Get-ChildItem -Filter "*.sql" -Exclude "install.sql" | Get-Content | Add-Content -Path install.sql

Remove-Item install_agular.sql -ErrorAction Ignore
Get-ChildItem -Path .\angular.ui -Filter "*.sql" | Get-Content | Add-Content -Path install_agular.sql
