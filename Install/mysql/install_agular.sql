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

