<?php
if(!defined('prevent_direct_access')) { header('HTTP/1.0 403 Forbidden'); exit; }

class auth { 
    public static function CanModuleProcess($context) {
        // check if the current module requires authentication
        if($context->module->RequiresAuthentication($context) == false)
            return true;
        
        // check if the request is authenticated
        $isAuthenticated = auth::IsAuthenticated($context);
        if($isAuthenticated == false) {
            $isAuthenticated = auth::Authenticate($context);
            if($isAuthenticated == false) {
                // clear cookie
                setcookie('X-App-Key', '');
                setcookie('Authorization', '');
                header('HTTP/1.0 403 Forbidden');
                return false;  
            }
            else {        
                // if authentication is successful then return the angular config
                echo $context->module->Authenticated($context);
                return false;
            }                      
        }         

        // check if the request is authorized
        $isAuthorized = auth::IsAuthorized($context);
        if ($isAuthorized == false) {
            // request is not authorized
            header("HTTP/1.1 401 Unauthorized");
            return false;
        }
        else {
            // authorized
            return true;
        }
    }

    public static function IsAuthenticated($context) {
        $authenticated = false;

        // do the JWT toekn thingy
        $token = null;
        if(array_key_exists('HTTP_AUTHORIZATION', $_SERVER)) {
            $token = $_SERVER['HTTP_AUTHORIZATION'];
            $token = str_replace('Bearer ', '', $token);
        }

        else if($_SERVER['REQUEST_METHOD'] == 'GET' &&
            array_key_exists('Authorization', $_COOKIE)
        ) {
            $token = $_COOKIE['Authorization'];
            $token = str_replace('Bearer ', '', $token);
        }

        else if (
            array_key_exists('Bearer', $_GET) &&
            $_SERVER['REQUEST_METHOD'] == 'GET' )
        {
            $token = $_GET['Bearer'];
        }

        if ($token != null)
        {            
            // decoded token will be saved as token in the res.locals
            if(verifyJWT($token, $context->secret)){
                $context->token = payloadJWT($token);                
            
                // if authentication is expiring soon then issue a new token
                // if half of the time is passed then renew
    
                // authenticated
                $authenticated = true;
            }                
        }

        return $authenticated;
    }

    public static function Authenticate($context) {
        $authenticated = false;

        // get user id and password
        $id = get('id');        
        $password = get('password');
        $navigation_id = getNavigationId();
        if (IsNullOrEmpty($id) == false && IsNullOrEmpty($navigation_id) == false)
        {
            // find user with matching id and navigation_id            
            $sql = "SELECT * FROM core_user WHERE id = ? AND navigation_id = ?";                        
            $result = $context->conn->query($sql, array($id, $navigation_id));
            if (count($result) > 0) {
                $user = $result[0];
                
                $valid = false;
                // if password is empty then pass
                if( IsNullOrEmpty($user['password']) == true ) {
                    $valid = true;                    
                }

                // verify the password
                else if( password_verify($password, $user['password']) ) {
                    $valid = true;
                }

                if($valid) {
                    // create a new token                       
                    $token = auth::CreateToken(
                        $context
                        , $user['id']
                        , $user['name']
                        , auth::RolesOfUser($context, $user['_id'])
                    );

                    $context->token = payloadJWT($token);

                    // update the header
                    auth::RefreshHeader($context, $token);
                    
                    // is authenticated
                    $authenticated = true;
                }
            }
        }

        return $authenticated;
    }

    public static function CreateToken($context, $id, $name, $roles) {        
        $token = generateJWT([
                'unique_name' => $id, 
                'nameid' => $name,
                'roles' => $roles,
                'exp' => time() + (60*60*24*30)
            ]
            ,$context->secret);

        return $token;
    }

    public static function RefreshHeader($context, $token) {                
        header('Authorization: Bearer '.$token);
        setcookie('Authorization', 'Bearer '.$token);
    }

    public static function RolesOfUser($context, $id) {
        // find user with matching id and navigation_id
        $id = escape($id);
        $sql = "SELECT DISTINCT G.* FROM core_group G 
            INNER JOIN core_group_user GU ON GU.group_id = G._id
            WHERE GU.user_id = ?";           
        $result = $context->conn->query($sql, array($id));
        $roleIds = array();
        if (count($result) > 0) {
            foreach($result as $group) {
                $sql = "SELECT * FROM core_role_group WHERE group_id = ?";
                $roles = $context->conn->query($sql, array($group['_id']));
                foreach($roles as $role)                
                    $roleIds[$role['_id']] = 1;                
            }
        
        }
        return array_keys($roleIds);
    }

    public static function IsAuthorized($context) {
        $authorized = false;

        $payload = $context->token;        
        if(isset($payload)) {
            if(is_array($payload['roles'])) 
                $roleIds = $payload['roles'];            
            else 
                $roleIds = array($payload['roles']);
            
            $policy = auth::GetPolicy($context, $roleIds);
            $authorized = auth::IsAllowed($context, $policy);
        }

        return $authorized;
    }

    // populate policy
    public static function GetPolicy($context, $roleIds)
    {
        // collect keys
        $allowed = array();
        $not_allowed = array();

        foreach($roleIds as $roleId)
        {
            // load role
            $sql = "SELECT * FROM core_policy WHERE role_id=?";
            $policies = $context->conn->query($sql, array($roleId));
            foreach($policies as $policy) {
                if((bool)$policy['type'] == true)
                    $allowed[] = $policy['policy'];
                else
                    $not_allowed[] = $policy['policy'];
            }
        }

        return array("allowed" => $allowed, "not_allowed" => $not_allowed);
    }
        
    public static function IsAllowed($context, $policies)
    {
        $result = false;

        // set default url if not specified
        $url = $_SERVER['REQUEST_URI'];
        $method = strtolower($_SERVER['REQUEST_METHOD']);
        
        // is allowed?
        if (isset($policies['allowed']))
        {
            foreach ($policies['allowed'] as $policy)
            {                
                $permissionUrl = explode(":", $policy)[0];
                $permissionMethod = explode(":", $policy)[1];

                if (wildcard_match($permissionUrl, $url) == true
                    && wildcard_match($permissionMethod, $method) == true)
                {
                    $result = true;
                    break;
                }
            }
        }

        // check not allowed
        if (isset($policies['not_allowed']))
        {
            foreach ($policies['not_allowed'] as $policy)
            {
                $permissionUrl = explode(":", $policy)[0];
                $permissionMethod = explode(":", $policy)[1];

                if (wildcard_match($permissionUrl, $url) == true
                    && wildcard_match($permissionMethod, $method) == true)
                {
                    $result = false;
                    break;
                }
            }
        }

        return $result;
    }
  
} 
?>