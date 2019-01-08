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
