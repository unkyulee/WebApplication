<?php
if (!defined('prevent_direct_access')) {
  header('HTTP/1.0 403 Forbidden');
  exit;
}

class router
{
  public static function PreProcess($context)
  {
    // append default headers
    header('Access-Control-Allow-Origin:*');
    header('Access-Control-Allow-Methods:GET,PUT,POST,DELETE');
    header('Access-Control-Allow-Headers:Authorization, Origin, X-Requested-With, Content-Type, Accept, X-App-Key');
    header('Access-Control-Expose-Headers:Authorization');

    // response with authorization when specified
    if (array_key_exists('HTTP_AUTHORIZATION', $_SERVER)) {
      header('Authorization: ' . $_SERVER['HTTP_AUTHORIZATION']);
      setcookie('Authorization', $_SERVER['HTTP_AUTHORIZATION']);
    }

    // response with x-app-key when specified
    if (array_key_exists('HTTP_X_APP_KEY', $_SERVER)) {
      header('X-App-Key: ' . $_SERVER['HTTP_X_APP_KEY']);
      setcookie('X-App-Key', $_SERVER['HTTP_X_APP_KEY']);
    }

    // intercept OPTIONS method
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
      header('HTTP/1.1 200 OK');
      return false;
    }

    return true;
  }

  public static function ServeStaticFiles($context)
  {
    $url = basename($_SERVER['REQUEST_URI'], '?' . $_SERVER['QUERY_STRING']);
    $path = joinPaths($context->home, $url);

    if (is_file($path) && file_exists($path)) {
      try {
        if (endsWith($path, 'css')) header("Content-type:text/css");
        else header("Content-type:" . mime_content_type($path));

        // cache for 1 month
        header("Expires: " . gmdate('D, d M Y H:i:s T', strtotime("+3 months", time())));
        header("Cache-Control: public, max-age=" . (60 * 60 * 24 * 30));

        readfile($path);
        return true;
      } catch (Exception $e) { }
    }
    return false;
  }

  public static function ResolveNav($context)
  {
    $sql = "
      SELECT * FROM core_navigation
      WHERE ? LIKE CONCAT(url,'%')
      ORDER BY priority DESC
    ";
    $result = $context->conn->query($sql, array($_SERVER['REQUEST_URI']));
    return $result[0];
  }

  public static function ResolveModule($context)
  {
    if ($context->nav['module'] == 'angular')
      return new angular();
    else if ($context->nav['module'] == 'websvc')
      return new websvc();
  }
}
