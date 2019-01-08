<?php
if(!defined('prevent_direct_access')) { header('HTTP/1.0 403 Forbidden'); exit; }

class angular {
    public function RequiresAuthentication($context) {        
        if ($_SERVER['REQUEST_METHOD'] == 'GET') 
            return false;        
        return true;
    }

    public function Process($context) {
        $url = $_SERVER['REQUEST_URI'];
        if(endsWith($url, 'index.js'))
            return $this->IndexJS($context);
        else
            return $this->IndexHtml($context);
    }

    public function IndexJS($context) {        
        return "__CONFIG__ = Object.assign(__CONFIG__, {
            rest: '".scheme()."://".$_SERVER['HTTP_HOST']."'
            , auth: '".scheme()."://".$_SERVER['HTTP_HOST'].$context->nav['url']."'
            , angular_client: ".json_encode($context->nav)."
        })";
    }

    public function IndexHtml($context) {        
        // read index html
        $result = file_get_contents('wwwroot/index.tmpl');        

        //         
        $url = $_SERVER['REQUEST_URI'];
        if($url == '/') $url = '';
        
        $result = str_replace("@title", $context->nav['name'], $result);
        $result = str_replace("@base_href", "<base href='".$context->nav['url']."'>", $result);
        $result = str_replace("@path", $context->nav['url'], $result);            

        return $result;
    }

    public function Authenticated($context) {
        
        // get angular navigation
        $angular_navigation = array();
        
        $sql = "SELECT * FROM angular_navigation WHERE navigation_id=?";
        $result = $context->conn->query($sql, array($context->nav['_id']));
        if (count($result) > 0) {
            foreach($result as $ang_nav) {
                $content = json_decode($ang_nav['content'], true);                
                $content['_id'] = $ang_nav['_id'];
                $content['navigation_id'] = $context->nav['_id'];

                array_push($angular_navigation, $content);
            }
        }

        // get angular ui
        $angular_ui = array();
        
        // retrieve all matching uiElements and load it
        $uiElementIds = array();
        foreach($angular_navigation as $nav) {
            if(@$nav['uiElementIds']) $uiElementIds = array_merge($uiElementIds, $nav['uiElementIds']);
            if(@$nav['hidden'] && @$nav['hidden']['uiElementIds']) $uiElementIds = array_merge($uiElementIds, $nav['hidden']['uiElementIds']);
            if(@$nav['children']) {
                foreach($nav['children'] as $child) {
                    if(@$child['uiElementIds']) $uiElementIds = array_merge($uiElementIds, $child['uiElementIds']);
                    if(@$child['hidden'] && @$child['hidden']['uiElementIds']) $uiElementIds = array_merge($uiElementIds, $child['hidden']['uiElementIds']);
                }
            }
        }
        
        $sql = "SELECT * FROM angular_ui WHERE _id IN (".implode(", ", array_fill(0, count($uiElementIds), '?')).")";
        $result = $context->conn->query($sql, $uiElementIds);
        if (count($result) > 0) {
            foreach($result as $ang_ui) {                
                $angular_ui[$ang_ui['_id']] = json_decode($ang_ui['content']);
            }
        }

        return json_encode(array(
            "angular_navigation" => $angular_navigation
            , "angular_ui" => $angular_ui
        ));        
    }
}

?>
