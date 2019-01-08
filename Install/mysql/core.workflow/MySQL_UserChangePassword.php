<?php

// Get Configuration
$config = json_decode($config, true);
     
// Get Navigation ID
$navigation_id = getNavigationId(); if (IsNullOrEmpty($navigation_id)) return '{ error: "No X-App-Id Specified." }';

// check if admin 
$admin = false; 
if (@$config["admin"] != null) {
    $admin = true;
    $navigation_id = null;
}

// Form document
$data = getData();

// error check
if (@$data["new_password"] == null) return '{ error: "new password missing" }';
if (@$data["new_password_confirm"] == null && !$admin) return '{ error: "repeated password missing" }';
if (@$data["new_password_confirm"] != @$data["new_password"] && !$admin) return '{ error: "new password and repeated password mismatch" }';

// find the user
$params = array("_id" => $data["_id"]);
$sql = "SELECT * FROM core_user WHERE _id=?";
$results = $ds->query($sql, $params);

if ($results != null && count($results) > 0)
{
    // account exists
    $user = $results[0];

    if ($admin == false) {
        // empty password condition
        if( IsNullOrEmpty($user['password']) && IsNullOrEmpty(@$data["old_password"]) ) {
            // this is ok
        }
        // check if the password matches
        else if (password_verify(@$data["old_password"], $user['password']) == false)
            return '{ error: "password does not match" }';
    }        

    // update password                
    $password = password_hash( $data["new_password"], PASSWORD_DEFAULT);
    
    // update user
    $updatedId = $ds->upsert(        
        "core_user"
        , array("password" => $password, "_id" => $data["_id"])
        , "_id"
    );

    // return result    
    return json_encode(array("id" => $data["_id"]));
}

return '{ error: "no matching user found" }';
?>