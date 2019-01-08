Remove-Item angular.ui.json -ErrorAction Ignore
Get-ChildItem -Path . -Filter "*.json" -Recurse | Get-Content | Add-Content -Path angular.ui.json
