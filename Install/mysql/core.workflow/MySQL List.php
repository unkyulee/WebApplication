<?php

function getList(
    $mysql
    , $sqlTemplate
    , $options
    , $where
    , $params
    , $sort
    , $size = "10"
    , $page = "1"
) {
    $result = null;

    // null check
    if (IsNullOrEmpty($sqlTemplate)) {
        return null;
    }

    //
    $id = $options['id'];
    $fields = $options['fields'];

    // Paginate the result
    $sqlTemplate = str_replace('{fields}', $fields, $sqlTemplate);
    if (count($where) > 0) {
        $sqlTemplate = str_replace(
            '{where}'
            , ' WHERE ' . implode(' AND ', $where)
            , $sqlTemplate
        );
    } else {
        $sqlTemplate = str_replace(
            '{where}'
            , ''
            , $sqlTemplate
        );
    }

    // sorting
    if (count($sort) > 0) {
        $sqlTemplate = str_replace(
            '{order}'
            , ' ORDER BY ' . implode(' ,', $sort)
            , $sqlTemplate
        );
    } else {
        $sqlTemplate = str_replace(
            '{order}'
            , ''
            , $sqlTemplate
        );
    }

    // Run SQL
    $offset = (intval($page) - 1) * intval($size);
    $sql = "$sqlTemplate LIMIT $offset, $size";
    $result = $mysql->query($sql, $params);

    // For each row run fetch
    $fetch = @$options["fetch"];
    if ($fetch != null) {
        foreach ($result as &$row) {
            Fetch($mysql, $fetch, $row);
        }
    }

    // remove exclude fields
    $excludeFields = @$options['excludeFields'];    
    if($excludeFields != null) {
        foreach ($result as $row) {
            foreach($excludeFields as $excludeField) {
                if(@$row[$excludeField] != null)
                    unset($row[$excludeField]);
            }
        }        
    }

    // Convert to Json
    $jsonFields = @$options['jsonFields'];
    if ($jsonFields != null) {
        foreach ($result as &$row) {
            foreach ($jsonFields as $index => $jsonField) {
                $row[$jsonField] = json_decode($row[$jsonField]);
            }
        }
    }

    return $result;
}

function Fetch($mysql, $fetch, &$row)
{
    // run fetch on each row to add extra data
    foreach ($fetch as $operation) {
        // run fetch query
        $sql = $operation["sql"];
        $params = array();
        if (@$operation["parameters"]) {
            foreach ($operation["parameters"] as $param) {
                $sql = str_replace('@'.$param, '?', $sql);
                $params[] = $row[$param];
            }
        }

        $result = $mysql->query($sql, $params);
        $type = @$operation['type'];
        if (IsNullOrEmpty($type)) {
            foreach ($operation['fields'] as $field) {
                $fetchResult = array();
                foreach ($result as $fetchedRow) {
                    $fetchResult[] = $fetchedRow[$field['source']];
                }
                $row[$field['target']] = $fetchResult;
            }
        } 
        
        else if ($type == 'object') {
            $key = $operation['key'];
            $fetchResult = array();
            foreach ($result as $fetchedRow) {
                $item = array();
                foreach ($operation['fields'] as $field) {
                    $item[$field['target']] = $fetchedRow[$field['source']];
                }
                $fetchResult[] = $item;
            }

            $row[$key] = $fetchResult;
        }
    }
}

function getCount($mysql, $sqlTemplate, $where, $params)
{
    $total = 0;

    // null check
    $sql = str_replace(
        "{fields}"
        , "COUNT(*) AS CNT"
        , $sqlTemplate
    );

    if (count($where) > 0) {
        $sql = str_replace(
            '{where}'
            , ' WHERE ' . implode(' AND ', $where)
            , $sql
        );
    } else {
        $sql = str_replace(
            '{where}'
            , ''
            , $sql
        );
    }

    // sorting
    $sql = str_replace('{order}', '', $sql);

    // Run SQL
    $result = $mysql->query($sql, $params);
    if (count($result) > 0) {
        $total = $result[0]['CNT'];
    }

    return $total;
}

// Get Configuration
$config_json = json_decode($config, true);
if (IsNullOrEmpty($config_json)) {
    $msg = json_error(json_last_error());
    return json_encode(array(
        "error" => $msg
        , "content" => $config
    ));
}
$config = $config_json;

// check if admin
$admin = false;
if (@$config["admin"] != null) {
    $admin = true;
}

// Get Navigation ID
$navigation_id = getNavigationId();
if (IsNullOrEmpty($navigation_id)) {
    return json_encode(array(
        "error" => "No X-App-Key specified"
    ));
}

// pagination
$page = get("page"); if(IsNullOrEmpty($page)) $page = "1";
$size = get("size"); if(IsNullOrEmpty($size)) $size = "10";

// Query Options - Sort
$sort = array();
if (null != get("_sort")) {
    $sort[] = get("_sort");
}

if (null != get("_sort_desc")) {
    $sort[] = get("_sort_desc") . " DESC";
}

// Query - Filters
$where = array();

// get body
$data = getData();
$params = array();

if ($data != null && count($data) > 0) {
    foreach ($data as $key => $value) {
        //
        $parameterName = $key;
        $parameterName = str_replace("__", "._", $parameterName);
        $parameterName = str_replace("_lte", "", $parameterName);
        $parameterName = str_replace("_gte", "", $parameterName);
        $parameterName = str_replace("_lt", "", $parameterName);
        $parameterName = str_replace("_gt", "", $parameterName);

        if ($key == "page") {
            continue;
        } else if ($key == "size") {
            continue;
        } else if ($key == "_export") {
            continue;
        } else if ($key == "_aggregation") {
            continue;
        } else if ($key == "_sort") {
            continue;
        } else if ($key == "_sort_desc") {
            continue;
        }

        // search keyword
        else if ($key == "_search") {
            if (IsNullOrEmpty($value) == false) {
                $search = array();
                foreach ($config['searchFields'] as $searchKey) {
                    $search[] = "$searchKey LIKE CONCAT('%', ?, '%')";
                    $params[] = $value;
                }
                $where[] = "(" . implode(" OR ", $search) . ")";
            }
            continue;
        }

        // range filter
        else if (endsWith($key, "_date_gte")) {
            $where[] = "$parameterName >= ?";
        } else if (endsWith($key, "_date_lte")) {
            $where[] = "$parameterName <= ?";
        } else if (endsWith($key, "_date_gt")) {
            $where[] = "$parameterName > ?";
        } else if (endsWith($key, "_date_lt")) {
            $where[] = "$parameterName < ?";
        }

        // otherwise string filter
        else {
            $where[] = "$parameterName = ?";
        }

        // add to params
        $params[] = $value;
    }
}

// Add navigation_id filter
if ($admin == false) {
    $where[] = "navigation_id = ?";
    $params[] = $navigation_id;
}

$result = getList($ds, $config['sql'], $config, $where, $params, $sort, $size, $page);
$total = getCount($ds, $config['sql'], $where, $params);

return json_encode(array(
    "page" => $page
    , "size" => $size
    , "total" => $total
    , "data" => $result,
));