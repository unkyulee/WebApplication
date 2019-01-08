<?php

// Query
$query = get('query');
$data = $ds->exec($query);

return json_encode($data);

?>