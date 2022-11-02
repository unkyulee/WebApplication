@ECHO OFF
SET IMPORT=../import.js
SET ID=../firebase.json

node %IMPORT% %ID% navigation ./navigation
node %IMPORT% %ID% page ./page
node %IMPORT% %ID% ui ./ui
