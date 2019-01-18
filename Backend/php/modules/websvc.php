<?php
if(!defined('prevent_direct_access')) { header('HTTP/1.0 403 Forbidden'); exit; }

class websvc {
    public function RequiresAuthentication($context) {
        return true;
    }

    public function Process($context) {        
        $result = null;

        // get web service name
        $regex = '/'.preg_quote($context->nav['url'], '/').'/';
        $relativePaths = preg_replace($regex, '', strtok($_SERVER["REQUEST_URI"],'?'), 1);
        $websvcName = str_replace('/', '', $relativePaths);
        
        if(IsNullOrEmpty($websvcName) == false) {
            // load web services                        
            $sql = "SELECT * FROM core_websvc WHERE navigation_id=? AND api_url=?";            
            $result = $context->conn->query($sql, array($context->nav['_id'], $websvcName));
            if(count($result) == 0) {
                header('HTTP/1.0 403 Forbidden');                
                return 'web service not found '.$context->nav['_id'].' '.$websvcName;
            }
                
            if (count($result) > 0) {
                $websvc = $result[0];
                $method = strtolower($_SERVER['REQUEST_METHOD']);
                if($websvc) {
                    // load workflow
                    $workflow_id = $websvc[$method.'_workflow'];
                    if(IsNullOrEmpty($workflow_id) == false) {
                        $sql = "SELECT * FROM core_workflow WHERE _id=?";
                        $result = $context->conn->query($sql, array($workflow_id));
                        if (count($result) > 0) {
                            $workflow = $result[0];

                            // configurtion
                            $config = $websvc[$method.'_configuration'];                        

                            // load data source
                            $ds = null;
                            $ds_id = $websvc[$method.'_datasource'];
                            if(IsNullOrEmpty($ds_id) == false) {
                                $sql = "SELECT * FROM core_dataservice WHERE _id=?";
                                $result = $context->conn->query($sql, array($ds_id));
                                if (count($result) > 0) {
                                    $dataservice = $result[0];
                                    $ds = new mysql($dataservice['connectionString']);
                                }
                            }
                            
                            // run script
                            $script = $workflow['script'];                          
                            $script = str_replace('<?php', '', $script);
                            $script = str_replace('?>', '', $script);
                            $result = eval($script);                            
                        }
                    }
                }
            }
        }                        

        return $result;
    }

    public function Authenticated($context) {
        
    }
}

?>