<?php

function resolveExternal($externals) {
        
    $extTable = $external["table"];
    $extIdField = $external["id"];    
    $relationships = $external["relationships"];
    $mapping = $external["mapping"];

    if($mapping == null) {
        echo 'mapping is null';
        return;
    }
    
    // for each value create new record on external
    $source = $data[$mapping["source"]];
    $sourceKey = $mapping["sourceKey"];

    // fetch existing records
    $where = array();
    if ($relationships != null)
        foreach ($relationships as $relationship)
            $where[] = $relationship['target']." = ".$data[$relationship['source']];

    //try
    //{
        $existingRecordIds = $ds->query(
            "SELECT $extIdField FROM $extTable WHERE ".implode(' AND ', $where)
        );
        // delete from existingRecords
        $sourceRecordIds = array();
        foreach($source as $key => $value) if( $key == $sourceKey ) $sourceRecordIds[] = $value;
        
        $tobeDeletedIds = array_diff($existingRecordIds, $sourceRecordIds);
        foreach ($tobeDeleteIds as $item)
            $ds->delete($extTable, $item, $extIdField);
    //} catch(Exception $e) { }

    foreach ($source as $item)
    {
        // new record
        $record = array();

        // fill up the record with foreign key relationship
        if ($relationships != null) {
            foreach ($relationships as $relationship) {                        
                $record[$relationship['target']] = $data[$relationship['source']];
            }
        }       

        // fill up the mapping value
        $type = $mapping["type"];
        if ($type == "object")
        {
            $targets = $mapping["targets"];
            if ($targets != null) {
                foreach ($targets as $target) {
                    $record[$target["target"]] = $item[$target["source"]];
                }                            
            }
                
        }

        // navigation_id
        if ($navigation_id != null) $record["navigation_id"] = $navigation_id;

        // find the key                            
        if ($sourceKey != null && $item[$sourceKey] != null)
        {
            // update 
            $record[$extIdField] = $item[$sourceKey];            
        }
        $ds->upsert($extTable, $record, $extIdField);
    }

}

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
$table = @$config["table"]; 
if (IsNullOrEmpty($table)) {
    return json_encode(array(
        "error" => "No table Specified." 
    ));
} 

// ID Field
$idField = @$config["id"]; 
if (IsNullOrEmpty($idField)) {
    return json_encode(array(
        "error" => "No id field Specified."
    ));
} 
            
// Get Navigation ID
$navigation_id = getNavigationId(); 
if (IsNullOrEmpty($navigation_id)) {
    return json_encode(array(
        "error" => "No X-App-Id Specified."
    ));
}

// check if admin 
$admin = false; 
if (@$config["admin"] != null) {
    $admin = true;
    $navigation_id = null;
}

// Form document
$data = getData();        

// set default fields
$data = $ds->setDefaults($data, $navigation_id);

// Complete external relationships
$externals = @$config["externals"];
if($externals) {
    foreach ($externals as $external) {
        resolveExternal($external);
    }    
}

// Exclude data
$excludeFields = @$config['excludeFields'];
if($excludeFields != null)
    foreach($excludeFields as $excludeField)
        if(@$data[$excludeField] != null)
            unset($data[$excludeField]);

// Update
$id = $ds->upsert($table, $data, $idField);

// Return Result
if($id)
    return '{ "_id": "'.$id.'" }';

?>