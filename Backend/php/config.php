<?php
$servername = "localhost";
$username = "root";
$password = "";
$db = "web";

// Azure connection information
if(@$_SERVER['MYSQLCONNSTR_localdb'] != null) {
    $value = $_SERVER['MYSQLCONNSTR_localdb'];    

    $servername = preg_replace("/^.*Data Source=(.+?);.*$/", "\\1", $value);
    $db = preg_replace("/^.*Database=(.+?);.*$/", "\\1", $value);
    $username = preg_replace("/^.*User Id=(.+?);.*$/", "\\1", $value);
    $password = preg_replace("/^.*Password=(.+?)$/", "\\1", $value);
}

$secret = "secretphrase";
?>