CREATE TABLE IF NOT EXISTS core_websvc (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6)NOT NULL,
    api_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    get_description VARCHAR(255),
    get_configuration LONGTEXT,
    get_datasource INT(6),
    get_workflow INT(6),
    post_description VARCHAR(255),
    post_configuration LONGTEXT,
    post_datasource INT(6),
    post_workflow INT(6),
    put_description VARCHAR(255),
    put_configuration LONGTEXT,
    put_datasource INT(6),
    put_workflow INT(6),
    delete_description VARCHAR(255),
    delete_configuration LONGTEXT,
    delete_datasource INT(6),
    delete_workflow INT(6),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_websvc WHERE _id = 1;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (1, 3, 'core.navigation', 'core.navigation',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_navigation {where}"
  , "admin": true
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["name", "description", "url", "module"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_navigation"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_navigation"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_navigation"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);


DELETE FROM core_websvc WHERE _id = 20;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (20, 3, 'angular.navigation', 'angular.navigation',
  'Get', '
{
  "sql": "SELECT {fields} FROM angular_navigation N INNER JOIN core_navigation C ON C._id = N.navigation_id {where}"
  , "admin": true
  , "jsonFields": ["content"]
  , "id": "N._id"
  , "fields": "N.*, C.name AS navigation_name"
  , "searchFields": ["N._id", "N.navigation_id", "N.content", "C.name"]
}
  ', 1, 40,
  'Update', '
{
  "table": "angular_navigation"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "angular_navigation"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "angular_navigation"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 30;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (30, 3, 'angular.ui', 'angular.ui',
  'Get', '
{
  "sql": "SELECT {fields} FROM angular_ui {where}"
  , "admin": true
  , "jsonFields": ["content"]
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["_id", "content"]
}
  ', 1, 40,
  'Update', '
{
  "table": "angular_ui"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "angular_ui"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "angular_ui"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 40;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (40, 3, 'core.websvc', 'core.websvc',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_websvc W INNER JOIN core_navigation N ON N._id = W.navigation_id {where}"
  , "admin": true
  , "id": "W._id"
  , "fields": "W.*, N.name AS navigation_name, N.url AS navigation_url"
  , "searchFields": ["W._id", "W.api_url", "W.name", "W.description"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_websvc"
  , "id": "_id"
  , "admin": true
  , "excludeFields": ["navigation_name", "navigation_url"]
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_websvc"
  , "id": "_id"
  , "admin": true
  , "excludeFields": ["navigation_name", "navigation_url"]
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_websvc"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 50;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (50, 3, 'core.workflow', 'core.workflow',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_workflow {where}"
  , "admin": true
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["_id", "name", "description"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_workflow"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_workflow"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_workflow"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 60;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (60, 3, 'core.dataservice', 'core.dataservice',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_dataservice {where}"
  , "admin": true
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["_id", "type", "name", "description", "connectionString", "db"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_dataservice"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_dataservice"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_dataservice"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 70;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (70, 3, 'core.user', 'core.user',
  'Get', '{
    "sql": "SELECT {fields} FROM core_user {where}"
    , "id": "_id"
    , "fields": "*"
    , "excludeFields": ["password"]
    , "searchFields": ["_id", "name", "id"]
    , "fetch": [
      {
        "fields": [
          { "source": "_id", "target": "group_id" }
          , { "source": "name", "target": "group_name" }
        ]
        , "parameters": ["_id"]
        , "sql": "SELECT G.* FROM core_group G INNER JOIN core_group_user GU ON GU.group_id = G._id WHERE GU.user_id = @_id"
      }
    ]
  }', 1, 40,
  'Update', '
{
  "table": "core_user"
  , "id": "_id"
  , "excludeFields": ["group_id", "group_name"]
}
  ', 1, 140,
  'Insert', '
{
  "table": "core_user"
  , "id": "_id"
  , "excludeFields": ["group_id", "group_name"]
}
  ', 1, 140,
  'Delete', '
{
  "table": "core_user"
  , "id": "_id"
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 71;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  post_description, post_configuration, post_datasource, post_workflow)
VALUES (71, 3, 'changepassword', 'changepassword',
  'Change password', '', 1, 150
);

DELETE FROM core_websvc WHERE _id = 72;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  post_description, post_configuration, post_datasource, post_workflow)
VALUES (72, 3, 'resetpassword', 'resetpassword',
  'Reset Password', '{ "admin": true }', 1, 150
);

DELETE FROM core_websvc WHERE _id = 80;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (80, 3, 'core.group', 'core.group',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_group {where}"
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["_id", "navigation_id", "name"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_group"
  , "id": "_id"
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_group"
  , "id": "_id"
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_group"
  , "id": "_id"
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 90;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (90, 3, 'core.role', 'core.role',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_role {where}"
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["_id", "navigation_id", "name", "description"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_role"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_role"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_role"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);

DELETE FROM core_websvc WHERE _id = 100;
INSERT INTO core_websvc (_id, navigation_id, api_url, description,
  get_description, get_configuration, get_datasource, get_workflow,
  post_description, post_configuration, post_datasource, post_workflow,
  put_description, put_configuration, put_datasource, put_workflow,
  delete_description, delete_configuration, delete_datasource, delete_workflow)
VALUES (100, 3, 'core.scheduled_task', 'core.scheduled_task',
  'Get', '
{
  "sql": "SELECT {fields} FROM core_scheduled_task {where}"
  , "id": "_id"
  , "fields": "*"
  , "searchFields": ["_id", "navigation_id", "name", "description"]
}
  ', 1, 40,
  'Update', '
{
  "table": "core_scheduled_task"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Insert', '
{
  "table": "core_scheduled_task"
  , "id": "_id"
  , "admin": true
}
  ', 1, 70,
  'Delete', '
{
  "table": "core_scheduled_task"
  , "id": "_id"
  , "admin": true
}
  ', 1, 80
);
