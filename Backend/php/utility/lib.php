<?php

function joinPaths()
{
  $args = func_get_args();
  $paths = array();
  foreach ($args as $arg) {
    $paths = array_merge($paths, (array)$arg);
  }

  $paths = array_map(create_function('$p', 'return trim($p, "/");'), $paths);
  $paths = array_filter($paths);
  return join('/', $paths);
}

function startsWith($haystack, $needle)
{
  $length = strlen($needle);
  return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
  $length = strlen($needle);
  if ($length == 0) {
    return true;
  }

  return (substr($haystack, -$length) === $needle);
}

function getNavigationId()
{
  $navigation_id = null;

  if (array_key_exists('HTTP_X_APP_KEY', $_SERVER))
    $navigation_id = $_SERVER['HTTP_X_APP_KEY'];
  else if (array_key_exists('X-App-Key', $_COOKIE))
    $navigation_id = $_COOKIE['X-App-Key'];
  else if (array_key_exists('X-App-Key', $_REQUEST))
    $navigation_id = $_REQUEST['X-App-Key'];

  return $navigation_id;
}

// Function for basic field validation (present and neither empty nor only white space
function IsNullOrEmpty($str)
{
  return (!isset($str) || $str == '');
}

function wildcard_match($pattern, $subject)
{
  $pattern = preg_quote($pattern, '/');
  $pattern = strtr($pattern, array(
    '*' => '.*?', // 0 or more (lazy) - asterisk (*)
    '?' => '.', // 1 character - question mark (?)
  ));
  return preg_match("/$pattern/", $subject);
}

function scheme()
{
  return (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
}

function get($name)
{
  $value = @$_GET[$name];
  if (!$value) $value = @$_POST[$name];
  if (!$value) {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);

    $value = @$input[$name];
  }
  return $value;
}

function json_error($error)
{
  switch ($error) {
    case JSON_ERROR_NONE:
      return ' - No errors';
      break;
    case JSON_ERROR_DEPTH:
      return ' - Maximum stack depth exceeded';
      break;
    case JSON_ERROR_STATE_MISMATCH:
      return ' - Underflow or the modes mismatch';
      break;
    case JSON_ERROR_CTRL_CHAR:
      return ' - Unexpected control character found';
      break;
    case JSON_ERROR_SYNTAX:
      return ' - Syntax error, malformed JSON';
      break;
    case JSON_ERROR_UTF8:
      return ' - Malformed UTF-8 characters, possibly incorrectly encoded';
      break;
    default:
      return ' - Unknown error';
      break;
  }
}

function getData()
{
  $dataJSON = file_get_contents('php://input');
  $data = json_decode($dataJSON, TRUE);
  // get query
  foreach ($_GET as $key => $value) $data[$key] = $value;

  return $data;
}

function escape($value)
{
  return $value;
}

function multiToSingle($content)
{
  $startPos = 0;
  $endPos = 0;

  while (true) {
    $startPos = strpos($content, '"""');
    if ($startPos == false) break;
    $endPos = strpos($content, '"""', $startPos+3);
    if ($endPos == false) break;

    $part = substr($content, $startPos, $endPos - $startPos+3);

    // convert multiline to single line
    $replaced = str_replace('"""', '', $part);
    $replaced = json_encode($replaced);
    $content = str_replace($part, $replaced, $content);
  }

  return $content;
}
