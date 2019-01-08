<?php

// Get Configuration
$config_json = json_decode($config, true);
if(IsNullOrEmpty($config_json)) {    
    $msg = json_error(json_last_error());
    return json_encode(array(
        "error" => $msg
        , "content" => $config
    ));
}
$config = $config_json;

// Table 
$table = @$config["table"]; if (IsNullOrEmpty($table)) return '{ error: "No table Specified." }';

// ID Field
$idField = @$config["id"]; if (IsNullOrEmpty($idField)) return '{ error: "No id field Specified." }';
            
// Get Navigation ID
$navigation_id = getNavigationId(); if (IsNullOrEmpty($navigation_id)) return '{ error: "No X-App-Id Specified." }';

// check if admin 
$admin = false; 
if (@$config["admin"] != null) {
    $admin = true;
    $navigation_id = null;
}

// Retrieve DataService            
if (!$ds) return '{ error: "Data Service not provided" }';

// Form document
$data = getData();

// filter
$where = array();
$params = array();
if($navigation_id) {
    $where[] = 'navigation_id = ?';
    $params[] = $navigation_id;
}
$where[] = "$idField = ?";
$params[] = $data[$idField];

$result = $ds->delete($table, $where, $params);

// Return Result
return json_encode(array(
    "result" => $result
));

?>
