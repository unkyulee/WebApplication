<?php
define('prevent_direct_access', TRUE);
try {
  // connect to db
  require 'config.php';
  require 'utility/lib.php';
  require 'modules/angular.php';
  require 'modules/websvc.php';
  require 'db/mysql.php';
  require 'services/router.php';
  require 'services/auth.php';
  require 'utility/jwt.php';

  // base context
  $context = new StdClass;
  $context->conn = new mysql(json_encode(array(
    "servername" => $servername,
    "username" => $username,
    "password" => $password,
    "db" => $db
  )));
  $context->secret = $secret;
  $context->home = 'wwwroot';

  // Check connection
  if ($context->conn->connect_error) {
    die("Connection failed: " . $context->conn->connect_error);
  }

  // pre process
  if(router::PreProcess($context) == false) return;

  // serve static files
  if(router::ServeStaticFiles($context) == true) return;

  // routing
  $context->nav = router::ResolveNav($context);
  $context->module = router::ResolveModule($context);

  // authentication
  if(auth::CanModuleProcess($context))
    echo $context->module->Process($context);

} catch(Exception $e) {
  echo $e;
}
?>