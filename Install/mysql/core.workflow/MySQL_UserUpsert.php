<?php

function updateGroup($ds, $navigation_id, $groupd_ids, $user_id)
{
    // delete the user from all the group        
    $ds->query(
        "DELETE FROM core_group_user WHERE user_id=?"
        , array("user_id" => $user_id)
    );

    // then add to the specified group
    foreach($groupd_ids as $group_id) {        
        $ds->query(
            "INSERT INTO core_group_user (group_id, user_id) VALUES (?, ?)"
            , array("group_id" => $group_id, "user_id" => $user_id)
        );            
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

// Form document
$data = getData();

// Get Group ID
$group_ids = @$data["group_id"];
if ($group_ids == null || count($group_ids) == 0)
    return json_encode(array("error" => "No Group Specified."));

// data validation - id is mandatory 
$id = get("id");
if (IsNullOrEmpty($id))
    return json_encode(array("error" => "id is mandatory field")); 

// if _id exists - Is it existing user?
if (@$data["_id"] != null)
{
    // Find Item    
    $sql = "SELECT * FROM core_user WHERE _id=?";    
    $results = $ds->query($sql, array("_id" => $data["_id"]));
    if ($results != null && count($result) > 0)
    {
        // account exists
        $user = $results[0];

        // check if the password matches
        if (@$data["password"] != null && @$user["password"] != $data["password"])
            if (password_verify(@$data["password"], $user['password']) == false)            
                return json_encode(array("error" => "password doesn't match"));

        // update the password
        if (@$data["password"] != null) 
            $data["password"] = password_hash($data["password"], PASSWORD_DEFAULT);

        $updatedData = $ds->setDefaults($data, $navigation_id);

        // Exclude data
        $excludeFields = @$config["excludeFields"];
        if ($excludeFields != null)
            foreach ($excludeFields as $excludeField) 
                if($excludeField != "password" && @$updatedData[$excludeField] != null)
                    unset($updatedData[$excludeField]);        

        // update user
        $ds->upsert($table, $updatedData, $idField);

        // update group
        updateGroup($ds, $navigation_id, $group_ids, $data["_id"]);
        
        return json_encode(array("_id" => $data["_id"]));
    }
}

// new user creation
else
{
    // check if the user with same id already exists    
    $sql = "SELECT * FROM core_user WHERE id=? AND navigation_id=?";
    
    $results = $ds->query($sql, array(
        "id" => $id
        , "navigation_id" => $navigation_id
    ));
    if ($results != null && count($results) > 0) 
        return json_encode(array("error" => "same id already exists"));

    // create new user
    $data["password"] = password_hash($data["password"], PASSWORD_DEFAULT);

    $updatedData = $ds->setDefaults($data, $navigation_id);

    // Exclude data
    $excludeFields = @$config["excludeFields"];
    if ($excludeFields != null)
        foreach ($excludeFields as $excludeField) 
            if($excludeField != "password" && @$updatedData[$excludeField] != null)
                unset($updatedData[$excludeField]);

    // update user
    $insertedId = $ds->insert($table, $updatedData, $idField);

    // update group
    updateGroup($ds, $navigation_id, $group_ids, $insertedId);

    return json_encode(array("_id" => $insertedId));
}

?>