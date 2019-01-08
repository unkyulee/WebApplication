CREATE TABLE IF NOT EXISTS angular_ui (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content LONGTEXT,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS angular_navigation (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6) NOT NULL,
    content LONGTEXT,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);


DELETE FROM angular_navigation WHERE _id = 2;
INSERT INTO angular_navigation (_id, navigation_id, content)
VALUES (2, 2, '
{
    "_id": 2,
    "navigation_id": 2,
    "name": "Profile",
    "url": "/profile",
    "order": 0,
    "uiElementIds": [
      1
    ],
    "hidden": {
      "uiElementIds": [
        2
      ]
    }
  }
');

DELETE FROM angular_navigation WHERE _id = 1;
INSERT INTO angular_navigation (_id, navigation_id, content)
VALUES (1, 2, '
{
    "_id": 1,
    "navigation_id": 2,
    "navigation_name": "Admin",
    "name": "Apps",
    "type": "collapse",
    "order": 10,
    "children": [
      {
        "name": "URL Assignment",
        "type": "item",
        "url": "/core.navigation",
        "uiElementIds": [
          10
        ]
      },
      {
        "name": "Angular Navigation",
        "type": "item",
        "url": "/angular.navigation",
        "uiElementIds": [
          13
        ]
      },
      {
        "name": "Angular UI",
        "type": "item",
        "url": "/angular.ui",
        "uiElementIds": [
          16
        ]
      }
    ]
  }
');

DELETE FROM angular_navigation WHERE _id = 11;
INSERT INTO angular_navigation (_id, navigation_id, content)
VALUES (11, 2, '
{
    "_id": 11,
    "navigation_id": 2,
    "navigation_name": "Admin",
    "name": "Web API",
    "type": "collapse",
    "order": 110,
    "children": [
      {
        "name": "Web Services",
        "type": "item",
        "url": "/core.websvc",
        "uiElementIds": [
          110
        ]
      },
      {
        "name": "Workflow",
        "type": "item",
        "url": "/core.workflow",
        "uiElementIds": [
          113
        ]
      },
      {
        "name": "Data Service",
        "type": "item",
        "url": "/core.dataservice",
        "uiElementIds": [
          116
        ]
      }
    ]
  }
');

DELETE FROM angular_navigation WHERE _id = 12;
INSERT INTO angular_navigation (_id, navigation_id, content)
VALUES (12, 2, '
{
    "_id": 12,
    "navigation_id": 2,
    "navigation_name": "Admin",
    "name": "Tasks",
    "type": "collapse",
    "order": 120,
    "children": [
      {
        "name": "Scheduled Tasks",
        "type": "item",
        "url": "/task",
        "uiElementIds": [
          120
        ]
      }
    ]
  }
');


DELETE FROM angular_navigation WHERE _id = 13;
INSERT INTO angular_navigation (_id, navigation_id, content)
VALUES (13, 2, '
{
    "_id": 13,
    "navigation_id": 2,
    "navigation_name": "Admin",
    "name": "Users",
    "type": "collapse",
    "order": 130,
    "children": [
      {
        "name": "Users",
        "type": "item",
        "url": "/core.user",
        "uiElementIds": [
          130
        ],
        "hidden": {
          "uiElementIds":[
            131
            , 2
          ]
        }
      },
      {
        "name": "Group",
        "type": "item",
        "url": "/core.group",
        "uiElementIds": [
          133
        ]
      },
      {
        "name": "Role",
        "type": "item",
        "url": "/core.role",
        "uiElementIds": [
          136
        ]
      }
    ]
  }
');
CREATE TABLE IF NOT EXISTS core_dataservice (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type NVARCHAR(255) NOT NULL,
    name NVARCHAR(255),
    description NVARCHAR(255),
    connectionString NVARCHAR(255) NOT NULL,
    db NVARCHAR(255) NOT NULL,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_dataservice WHERE _id = 1;
INSERT INTO core_dataservice (_id, type, name, description, connectionString, db)
VALUES (1, 'SQL', 'Site Admin SQL Data Services', 'Site Admin SQL Data Services',
  '{
      "servername": "localhost",
      "username": "root",
      "password": "",
      "db": "web"
  }',
  'web');
CREATE TABLE IF NOT EXISTS core_group (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6)NOT NULL,
    name NVARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_group WHERE _id = 1;
INSERT INTO core_group (_id, navigation_id, name)
VALUES (1, 2, 'Administrators');
CREATE TABLE IF NOT EXISTS core_group_user (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id int,
    user_id int,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_group_user WHERE _id = 1;
INSERT INTO core_group_user (_id, group_id, user_id)
VALUES (1, 1, 1);
CREATE TABLE IF NOT EXISTS core_navigation (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(255),
    description NVARCHAR(255),
    url NVARCHAR(255),
    priority INT(6) NOT NULL,
    module NVARCHAR(255),
    color_primary NVARCHAR(50),
    color_primaryLight NVARCHAR(50),
    color_primaryDark NVARCHAR(50),
    color_secondary NVARCHAR(50),
    color_secondaryLight NVARCHAR(50),
    color_secondaryDark NVARCHAR(50),
    color_accent NVARCHAR(50),
    color_accentLight NVARCHAR(50),
    color_accentDark NVARCHAR(50),
    color_background NVARCHAR(50),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_navigation WHERE _id = 1;
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (1, 'Default Site', 'Default Site', '/', 1, 'angular');

DELETE FROM core_navigation WHERE _id = 2;
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (2, 'Admin', 'Provide site administration', '/admin', 2, 'angular');

DELETE FROM core_navigation WHERE _id = 3;
INSERT INTO core_navigation (_id, name, description, url, priority, module)
VALUES (3, 'Admin Web Services', 'Provide site administration web services', '/adminapi', 3, 'websvc');

CREATE TABLE IF NOT EXISTS core_policy (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id INT(6)NOT NULL,
    type bit,
    policy VARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_policy WHERE _id = 1;
INSERT INTO core_policy (_id, role_id, type, policy)
VALUES (1, 1, 1, '*:*');
CREATE TABLE IF NOT EXISTS core_role (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6)NOT NULL,
    name VARCHAR(255),
    description VARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_role WHERE _id = 1;
INSERT INTO core_role (_id, navigation_id, name, description)
VALUES (1, 2, 'Administrators', 'Administrators');
CREATE TABLE IF NOT EXISTS core_role_group (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id int,
    group_id int,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_role_group WHERE _id = 1;
INSERT INTO core_role_group (_id, role_id, group_id)
VALUES (1, 1, 1);

CREATE TABLE IF NOT EXISTS core_user (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    navigation_id INT(6),
    id VARCHAR(255),
    password VARCHAR(1024),
    name VARCHAR(255),
    mobile VARCHAR(255),
    email VARCHAR(255),
    note VARCHAR(255),
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_user WHERE _id = 1;
INSERT INTO core_user (_id, navigation_id, id, name)
VALUES (1, 2, 'admin', 'Administrator');
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
CREATE TABLE IF NOT EXISTS core_workflow (
    _id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    script LONGTEXT,
    _created DATETIME default CURRENT_TIMESTAMP,
    _updated DATETIME default CURRENT_TIMESTAMP
);

DELETE FROM core_workflow WHERE _id = 40;
INSERT INTO core_workflow (_id, name) VALUES (40, 'Mysql List');

DELETE FROM core_workflow WHERE _id = 70;
INSERT INTO core_workflow (_id, name) VALUES (70, 'Mysql Upsert');

DELETE FROM core_workflow WHERE _id = 80;
INSERT INTO core_workflow (_id, name) VALUES (80, 'Mysql Delete');

DELETE FROM core_workflow WHERE _id = 90;
INSERT INTO core_workflow (_id, name) VALUES (90, 'Mysql Query');

DELETE FROM core_workflow WHERE _id = 140;
INSERT INTO core_workflow (_id, name) VALUES (140, 'User Upsert');

DELETE FROM core_workflow WHERE _id = 150;
INSERT INTO core_workflow (_id, name) VALUES (150, 'User Change Password');


DELETE FROM angular_ui WHERE _id = 13;
INSERT INTO angular_ui (_id, content)
VALUES (13, '
{
  "type": "data-table",
  "label": "Angular Navigation Data Table",
  "src": "/adminapi/angular.navigation",
  "list": {
    "src": "/adminapi/angular.navigation",
    "size": 1000,
    "method": "get",
    "transform": "response.data",
    "filters": [
      {
        "key": "C.name",
        "label": "Navigation",
        "optionSrc": "`/adminapi/core.navigation?_sort=name&module=Module.SinglePage.dll&_search=${this.value}`",
        "optionTransform": "response.data",
        "optionLabel": "name"
      }
    ],
    "table": {
      "groupBy": "navigation_name",
      "columns": [
        {
          "key": "_id",
          "label": "_id",
          "link": "`detail/${row._id}`"
        },
        {
          "key": "content.type",
          "label": "type"
        }
      ]
    }
  },
  "detail": {
    "src": "`/adminapi/angular.navigation?N._id=${this.id}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "name": "angular.navigation",
        "screen": [
          {
            "path": "content",
            "label": "angular.navigation",
            "type": "json-editor"
          }
        ]
      }
    ]
  }
}
');
DELETE FROM angular_ui WHERE _id = 16;
INSERT INTO angular_ui (_id, content)
VALUES (16, '
{
  "_id": 16,
  "type": "data-table",
  "name": "Angular UI Elements Data Table",
  "src": "/adminapi/angular.ui",
  "list": {
      "src": "/adminapi/angular.ui",
      "size": 1000,
      "method": "get",
      "transform": "response.data",
      "table": {
          "columns": [
              {
                  "key": "content.name",
                  "label": "name",
                  "link": "`detail/${row._id}`"
              },
              {
                  "key": "content.type",
                  "label": "type",
                  "canAutoResize": false
              },
              {
                  "key": "_id",
                  "label": "_id"
              }
          ]
      }
  },
  "detail": {
      "src": "`/adminapi/angular.ui?_id=${this.id}`",
      "method": "get",
      "transform": "response.data[0]",
      "screen": [
          {
              "name": "Angular UI Element Specification",
              "screen": [
                  {
                      "path": ".",
                      "label": "UI Element",
                      "type": "json-editor"
                  }
              ]
          }
      ]
  }
}
');
DELETE FROM angular_ui WHERE _id = 116;
INSERT INTO angular_ui (_id, content)
VALUES (116, '
{
    "_id": 116,
    "navigation_name": "Site Administration Application",
    "type": "data-table",
    "name": "Data Source Data Table",
    "src": "/adminapi/core.dataservice",
    "list": {
      "src": "/adminapi/core.dataservice",
      "method": "get",
      "size": 1000,
      "transform": "response.data",
      "table": {
        "columns": [
          {
            "key": "name",
            "label": "name",
            "link": "`detail/${row._id}`"
          },
          {
            "key": "type",
            "label": "type",
            "canAutoResize": false
          },
          {
            "key": "description",
            "label": "description"
          }

        ]
      }

    },
    "detail": {
      "src": "`/adminapi/core.dataservice?_id=${this.id}`",
      "method": "get",
      "transform": "response.data[0]",

      "screen": [
        {
          "name": "core.dataservice",
          "screen": [
            {
              "path": ".",
              "label": "core.dataservice",
              "type": "json-editor"
            }
          ]
        }
      ]


    }

  }
');

DELETE FROM angular_ui WHERE _id = 10;
INSERT INTO angular_ui (_id, content)
VALUES (10, '
{
  "_id": 10,
  "type": "data-table",
  "lable": "Site Map",
  "src": "/adminapi/core.navigation",
  "list": {
    "src": "/adminapi/core.navigation?_sort_desc=priority",
    "method": "get",
    "size": 1000,
    "transform": "response.data",
    "table": {
      "enableCheckbox": true,
      "columns": [
        {
          "key": "name",
          "label": "name",
          "link": "`detail/${row._id}`",
          "canAutoResize": true
        },
        {
          "key": "url",
          "label": "url",
          "canAutoResize": false
        },
        {
          "key": "priority",
          "label": "priority",
          "canAutoResize": false
        }
      ]
    }
  },
  "detail": {
    "src": "`/adminapi/core.navigation?_id=${this.id}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "name": "core.navigation",
        "screen": [
          {
            "path": ".",
            "label": "core.navigation",
            "type": "json-editor"
          }
        ]
      }
    ]
  }
}
');

DELETE FROM angular_ui WHERE _id = 136;
INSERT INTO angular_ui (_id, content)
VALUES (136, '
{
  "_id": 136,
  "navigation_name": "Site Administration Application",
  "type": "data-table",
  "name": "Roles Data Table",
  "src": "/adminapi/core.role",
  "list": {
    "src": "/adminapi/core.role",
    "method": "get",
    "size": 1000,
    "transform": "response.data",
    "filters": [
      {
        "key": "navigation_name",
        "label": "Navigation",
        "optionSrc": "`/adminapi/core.navigation?_sort=title&_search=${this.value}`",
        "optionTransform": "response.data",
        "optionLabel": "name"
      }
    ],
    "table": {
      "groupBy": "navigation_name",
      "columns": [
        {
          "key": "name",
          "label": "name",
          "link": "`detail/${row._id}`",
          "canAutoResize": true
        },
        {
          "key": "description",
          "label": "description",
          "canAutoResize": true
        }
      ]
    }
  },
  "detail": {
    "src": "`/adminapi/core.role?_id=${this.id}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "name": "Role Details",
        "screen": [
          {
            "path": ".",
            "label": "core.role",
            "type": "json-editor"
          }
        ]
      }
    ]
  }
}
');
DELETE FROM angular_ui WHERE _id = 130;
INSERT INTO angular_ui (_id, content)
VALUES (130, '

{
  "_id": 130,
  "type": "data-table",
  "name": "Users Data Table",
  "src": "/adminapi/core.user",
  "list": {
    "src": "/adminapi/core.user",
    "size": 1000,
    "method": "get",
    "transform": "response.data",
    "filters": [
      {
        "key": "navigation_name",
        "label": "Navigation",
        "optionSrc": "`/adminapi/core.navigation?_sort=name&_search=${this.value}`",
        "optionTransform": "response.data",
        "optionLabel": "name"
      }
    ],
    "table": {
      "groupBy": "navigation_name",
      "columns": [
        {
          "key": "id",
          "label": "id",
          "link": "`detail/${row._id}`",
          "canAutoResize": false
        },
        {
          "key": "name",
          "label": "name"
        }
      ]
    }
  },
  "detail": {
    "src": "`/adminapi/core.user?_id=${this.id}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "name": "User Details",
        "screen": [
          {
            "path": ".",
            "label": "core.user",
            "type": "json-editor"
          },

          {
            "type": "script-button",
            "buttons": [
              {
                "label": "Reset Password",
                "color": "warn",
                "script": "this.event.send({ name:''open-dialog'', uiElementId: 2, data: JSON.parse(JSON.stringify(this.data)) });"
              }
            ]

          }

        ]
      }
    ]
  }
}
');

DELETE FROM angular_ui WHERE _id = 2;
INSERT INTO angular_ui (_id, content)
VALUES (2, '

{
  "_id" : 2,
  "name": "Reset Password",
  "src": "/adminapi/resetpassword",
  "method": "post",
  "screen": [

    {
      "key": "new_password",
      "label": "New  password",
      "inputType": "password"
    },

    {
      "type": "script-button",
      "buttons": [
        {
          "label": "Reset Password",
          "color": "warn",
          "script": "
          this.event.send({name:''close-dialog''});
          this.rest.request(''/adminapi/resetpassword'', this.data, ''post'')
            .subscribe(response => {
                if (response && response.id) {
                  this.snackBar.open(''Changed'', null, {duration: 2000})
                }
                else {
                  this.snackBar.open(response.error, null, {duration: 2000})
                }
              }
          );
          "
        },

        {
          "label": "Close",
          "script": "this.event.send({name:''close-dialog''});",
          "color": "primary"
        }
      ]

    }
  ]
}

');
DELETE FROM angular_ui WHERE _id = 110;
INSERT INTO angular_ui (_id, content)
VALUES (110, '
{
  "_id": 110,
  "type": "data-table",
  "name": "Web Services Data Table",
  "src": "/adminapi/core.websvc",
  "list": {
    "src": "/adminapi/core.websvc",
    "size": 1000,
    "method": "get",
    "transform": "response.data",
    "filters": [
      {
        "key": "navigation_name",
        "label": "Navigation",
        "optionSrc": "`/adminapi/core.navigation?module=Module.WebServices.dll&_search=${this.value}`",
        "optionTransform": "response.data",
        "optionLabel": "name"
      }
    ],
    "table": {
      "groupBy": "navigation_name",
      "columns": [
        {
          "key": "navigation_url",
          "label": "navigation_url",
          "canAutoResize": false
        },
        {
          "key": "api_url",
          "label": "api_url",
          "link": "`detail/${row._id}`"
        },
        {
          "key": "description",
          "label": "description"
        },
        {
          "key": "enabled",
          "label": "enabled"
        }
      ]
    }
  },
  "detail": {
    "src": "`/adminapi/core.websvc?W._id=${this.id}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "name": "Navigation",
        "description": "Define URL of the web services",
        "width": 50,
        "screen": [
          {
            "key": "navigation_id",
            "label": "Select base url",
            "type": "selection",
            "optionSrc": "`/adminapi/core.navigation?module=Module.WebServices.dll`",
            "optionLabel": "name",
            "optionKey": "_id",
            "optionTransform": "response.data",
            "updateAlso": [
              {
                "sourceKey": "name",
                "targetKey": "navigation_name"
              },
              {
                "sourceKey": "url",
                "targetKey": "navigation_url"
              }
            ]
          },
          {
            "key": "navigation_url",
            "label": "navigation_url"
          },
          {
            "key": "api_url",
            "label": "api_url"
          }
        ]
      },
      {
        "name": "General",
        "description": "Specify general inforamtion of the web service",
        "width": 50,
        "screen": [
          {
            "key": "_id",
            "label": "_id",
            "readonly": true
          },
          {
            "key": "description",
            "label": "description",
            "type": "text-area"
          },
          {
            "key": "_created",
            "label": "Created At",
            "readonly": true
          },
          {
            "key": "_updated",
            "label": "Updated At",
            "readonly": true
          }
        ]
      },
      {
        "name": "Workflow: GET",
        "description": "Define how webservices will react to the request",
        "width": 25,
        "screen": [
          {
            "key": "get_description",
            "label": "Description",
            "type": "text"
          },
          {
            "key": "get_datasource",
            "label": "Data Source",
            "type": "selection",
            "optionSrc": "/adminapi/core.dataservice?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "get_workflow",
            "label": "Workflow",
            "type": "selection",
            "optionSrc": "/adminapi/core.workflow?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "get_configuration",
            "label": "Configuration",
            "type": "text-area"
          }
        ]
      },
      {
        "name": "Workflow: POST",
        "description": "Define how webservices will react to the request",
        "width": 25,
        "screen": [
          {
            "key": "post_description",
            "label": "Description",
            "type": "text"
          },
          {
            "key": "post_datasource",
            "label": "Data Source",
            "type": "selection",
            "optionSrc": "/adminapi/core.dataservice?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "post_workflow",
            "label": "Workflow",
            "type": "selection",
            "optionSrc": "/adminapi/core.workflow?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "post_configuration",
            "label": "Configuration",
            "type": "text-area"
          }
        ]
      },
      {
        "name": "Workflow: PUT",
        "description": "Define how webservices will react to the request",
        "width": 25,
        "screen": [
          {
            "key": "put_description",
            "label": "Description",
            "type": "text"
          },
          {
            "key": "put_datasource",
            "label": "Data Source",
            "type": "selection",
            "optionSrc": "/adminapi/core.dataservice?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "put_workflow",
            "label": "Workflow",
            "type": "selection",
            "optionSrc": "/adminapi/core.workflow?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "put_configuration",
            "label": "Configuration",
            "type": "text-area"
          }
        ]
      },
      {
        "name": "Workflow: DELETE",
        "description": "Define how webservices will react to the request",
        "width": 25,
        "screen": [
          {
            "key": "delete_description",
            "label": "Description",
            "type": "text"
          },
          {
            "key": "delete_datasource",
            "label": "Data Source",
            "type": "selection",
            "optionSrc": "/adminapi/core.dataservice?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "delete_workflow",
            "label": "Workflow",
            "type": "selection",
            "optionSrc": "/adminapi/core.workflow?size=1000",
            "optionKey": "_id",
            "optionLabel": "name",
            "optionTransform": "response.data"
          },
          {
            "key": "delete_configuration",
            "label": "Configuration",
            "type": "text-area"
          }
        ]
      }
    ]
  }
}
');

DELETE FROM angular_ui WHERE _id = 113;
INSERT INTO angular_ui (_id, content)
VALUES (113, '
{
    "_id": 113,
    "type": "data-table",
    "name": "Workflow",
    "src": "/adminapi/core.workflow",
    "list": {
      "src": "/adminapi/core.workflow?_sort=name",
      "size": 1000,
      "method": "get",
      "transform": "response.data",
      "table": {
        "columns": [
          {
            "key": "name",
            "label": "name",
            "link": "`detail/${row._id}`"
          },
          {
            "key": "description",
            "label": "description"
          }
        ]
      }

    },
    "detail": {
      "src": "`/adminapi/core.workflow?_id=${this.id}`",
      "method": "get",
      "transform": "response.data[0]",

      "screen": [

        {
          "name": "Workflow Script Details",
          "screen": [
            {
              "key": "_id",
              "label": "_id",
              "readonly": true
            },
            {
              "key": "name",
              "label": "name"
            },
            {
              "key": "description",
              "label": "description",
              "type": "text-area"
            },
            {
              "key": "script",
              "label": "script",
              "type": "text-area"
            }
          ]
        }

      ]


    }

  }
');
DELETE FROM angular_ui WHERE _id = 1;
INSERT INTO angular_ui (_id, content)
VALUES (1, '
{
  "_id": 1,
  "type": "data-table",
  "name": "Profile",
  "src": "/adminapi/core.user",
  "detail": {
    "src": "`/adminapi/core.user?id=${this.user.id()}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "screen": [
          {
            "key": "id",
            "label": "Login ID",
            "readonly": true
          },

          {
            "key": "name",
            "label": "Name"
          },

          {
            "type": "script-button",
            "buttons": [
              {
                "label": "Change Password",
                "color": "warn",
                "script": "this.event.send({ name:''open-dialog'', uiElementId: 2, data: JSON.parse(JSON.stringify(this.data)) });"
              }
            ]

          }

        ]
      }
    ]
  }
}

');


DELETE FROM angular_ui WHERE _id = 2;
INSERT INTO angular_ui (_id, content)
VALUES (2, '

{
  "_id" : 2,
  "name": "Change Password",
  "src": "/adminapi/changepassword",
  "method": "post",
  "screen": [
    {
      "key": "old_password",
      "label": "Current password",
      "inputType": "password"
    },

    {
      "key": "new_password",
      "label": "New  password",
      "inputType": "password"
    },

    {
      "key": "new_password_confirm",
      "label": "Repeat new password",
      "inputType": "password"
    },

    {
      "type": "script-button",
      "buttons": [
        {
          "label": "Change Password",
          "color": "warn",
          "script": "this.event.send({name:''close-dialog''}); this.rest.request(''/adminapi/changepassword'', this.data, ''post'').subscribe(response => { if (response && response.id) { this.snackBar.open(''Changed'', null, {duration: 2000}) } else { this.snackBar.open(response.error, null, {duration: 2000}) } } );"
        },

        {
          "label": "Close",
          "script": "this.event.send({name:''close-dialog''});",
          "color": "primary"
        }
      ]

    }
  ]
}

');

