<?php
if (!defined('prevent_direct_access')) {header('HTTP/1.0 403 Forbidden');exit;}

class mysql
{
    public $conn;
    public $connectionString;
    public function __construct($connectionString)
    {
        $this->connectionString = $connectionString;
        $info = json_decode($connectionString, true);

        $this->conn = new mysqli(
            $info['servername']
            , $info['username']
            , $info['password']
            , $info['db']
        );
    }

    public function exec($sql)
    {   
        $data = array();

        // Execute multi query
        if (mysqli_multi_query($this->conn, $sql)) {
            do {
                // Store first result set
                if ($result = mysqli_store_result($this->conn)) {

                    $data[] = $result;

                    // Free result set
                    mysqli_free_result($result);

                }
            } while (mysqli_next_result($this->conn));
        }

        if(mysqli_errno($this->conn)){            
            header("HTTP/1.0 500 Internal Server Error");
            print "mysqli error on query number ".count($data)."\r\n";            
            print $this->conn->error ."\n";
        }

        return $data;
    }

    //
    public function query($sql, $params, $upsert = false)
    {
        // Bind parameters. Types: s = string, i = integer, d = double,  b = blob
        $a_params = array();

        $param_type = '';
        foreach ($params as $p) {
            if (gettype($p) == "integer") {
                $param_type .= 'i';
            } else {
                $param_type .= 's';
            }

        }
        // make it double to match insert and update
        if ($upsert) {
            $param_type .= $param_type;
        }

        // with call_user_func_array, array params must be passed by reference
        $a_params[] = &$param_type;

        // with call_user_func_array, array params must be passed by reference
        // run twice to match insert and update params
        foreach ($params as $key => $value) {
            $a_params[] = &$params[$key];
        }

        if ($upsert) {
            foreach ($params as $key => $value) {
                $a_params[] = &$params[$key];
            }
        }

        // Prepare statement
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            echo 'Wrong SQL: ' . $sql . ' Error: ' . $this->conn->errno . ' ' . $this->conn->error;
            return;
        }

        // use call_user_func_array, as $stmt->bind_param('s', $param); does not accept params array
        if (IsNullOrEmpty($param_type) == false) {
            call_user_func_array(array($stmt, 'bind_param'), $a_params);
        }

        // Execute statement
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result == false) {
            return $stmt;
        } else {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            return $data;
        }
    }

    //
    public function setDefaults(&$data, $navigation_id)
    {
        // convert to date field
        foreach ($data as $key => $value) {
            if (endsWith("_date", $key)) {
                $data[$key] = date("Y-m-d H:i:s", strtotime($data[$key]));
            }
        }

        // convert _created
        $data["_created"] = strtotime(@$data["_created"]) != false ? $data["_created"] : date("Y-m-d H:i:s");
        $data["_updated"] = date("Y-m-d H:i:s");

        // asign navigation_id
        if ($navigation_id != null) {
            $data["navigation_id"] = $navigation_id;
        }

        return $data;
    }

    //
    public function upsert($table, $data)
    {
        $keyValues = array();
        foreach ($data as $key => $value) {
            $keyValues[] = "$key = ?";
        }

        $columns = implode(', ', array_keys($data));
        $values = implode(", ", array_fill(0, count($data), '?'));

        $sql = "INSERT INTO $table ($columns) VALUES ($values) ON DUPLICATE KEY UPDATE " . implode(', ', $keyValues);
        $result = $this->query($sql, $data, true);

        return $this->conn->insert_id;
    }

    //
    public function delete($table, $where, $params)
    {
        $sql = "DELETE FROM $table WHERE " . implode(' AND ', $where);
        $result = $this->query($sql, $params);

        return $result->affected_rows;
    }

}
