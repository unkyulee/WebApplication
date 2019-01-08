

SET IDENTITY_INSERT angular_ui ON;

IF EXISTS(SELECT * FROM angular_ui WHERE _id = 13) DELETE FROM angular_ui WHERE _id = 13
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







IF EXISTS(SELECT * FROM angular_ui WHERE _id = 133) DELETE FROM angular_ui WHERE _id = 133
INSERT INTO angular_ui (_id, content)
VALUES (133, '
{
  "_id": 133,
  "navigation_name": "Site Administration Application",
  "type": "data-table",
  "name": "Groups Data Table",
  "src": "/adminapi/core.group",
  "list": {
    "src": "/adminapi/core.group",
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
          "link": "`detail/${row._id}`"
        },
        {
          "key": "_updated",
          "label": "_updated"
        }
      ]
    }
  },
  "detail": {
    "src": "`/adminapi/core.group?_id=${this.id}`",
    "method": "get",
    "transform": "response.data[0]",
    "screen": [
      {
        "name": "Group Details",
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
            "key": "users",
            "label": "users",
            "type": "selection",
            "multiple": true,
            "optionSrc": "/adminapi/user",
            "optionTransform": "response.data",
            "optionLabel": "name",
            "optionKey": "_id"
          },
          {
            "key": "_created",
            "label": "_created",
            "type": "date",
            "readonly": true
          },
          {
            "key": "_updated",
            "label": "_updated",
            "type": "date",
            "readonly": true
          }
        ]
      }
    ]
  }
}
');



IF EXISTS(SELECT * FROM angular_ui WHERE _id = 10) DELETE FROM angular_ui WHERE _id = 10
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



IF EXISTS(SELECT * FROM angular_ui WHERE _id = 136) DELETE FROM angular_ui WHERE _id = 136
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






IF EXISTS(SELECT * FROM angular_ui WHERE _id = 131) DELETE FROM angular_ui WHERE _id = 131
INSERT INTO angular_ui (_id, content)
VALUES (131, '
{
  "_id": 131,
  "name": "Reset Password",
  "isConfirm": false,
  "method": "post",
  "screen": [
    {
      "key": "new_password",
      "label": "new password",
      "inputType": "password"
    },
    {
      "type": "script-button",
      "buttons": [
        {
          "label": "Change Password",
          "color": "warn",
          "script": "
            this.rest.request(''/adminapi/resetpassword'', this.data, ''post'').subscribe(
              response => {
                if (response.error) this.snackBar.open(response.error, null, {duration: 2000})
                else this.snackBar.open(''Changed'', null, {duration: 2000})
            });
            this.event.send({''name'': ''close-dialog'' });
          "
        },
        {
          "label": "Close",
          "script": "this.event.send({''name'':''close-dialog''});",
          "color": "primary"
        }
      ]
    }
  ]
}
');





IF EXISTS(SELECT * FROM angular_ui WHERE _id = 113) DELETE FROM angular_ui WHERE _id = 113
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









IF EXISTS(SELECT * FROM angular_ui WHERE _id = 120) DELETE FROM angular_ui WHERE _id = 120
INSERT INTO angular_ui (_id, content)
VALUES (120, '

{
    "_id": 120,
    "type": "data-table",
    "name": "Scheduled Task",
    "src": "/adminapi/core.scheduled_task",
    "list": {
        "src": "/adminapi/core.scheduled_task",
        "method": "get",
        "transform": "response.data",
        "table": {
            "columns": [
                {
                    "key": "name",
                    "label": "Task name",
                    "link": "`detail/${row._id}`"
                },
                {
                    "key": "last_run_result",
                    "label": "Last Status",
                    "canAutoResize": false
                },
                {
                    "key": "next_run_date",
                    "label": "Next Run",
                    "type": "date",
                    "lang": "it",
                    "format": "L LT",
                    "canAutoResize": false
                }
            ]
        }
    },
    "detail": {
        "src": "`/adminapi/core.scheduled_task?_id=${this.id}`",
        "method": "get",
        "transform": "response.data[0]",
        "screen": [
            {
                "name": "Dettaglio Task",
                "width": 35,
                "screen": [
                    {
                        "key": "name",
                        "label": "Task name"
                    },
                    {
                        "key": "schedule",
                        "label": "Schedule Rule"
                    },
                    {
                        "key": "next_run_date",
                        "label": "Next Run",
                        "transform": "this.data.next_run_date ? moment(this.data.next_run_date).format(''L LT'') : ''''"
                    },
                    {
                        "key": "last_run_result",
                        "label": "Last Run Result",
                        "readonly": true
                    },
                    {
                        "type" : "script-button",
                        "buttons" : [
                            {
                                "label" : "Run Script",
                                "color" : "warn",
                                "script" : "this.data.last_run_result = ''''; this.data.logs = []; this.data.next_run_date = new Date(); this.event.send({ ''name'': ''save'' }); setTimeout(() => this.event.send({ ''name'': ''refresh'' }), 5000);"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Log",
                "width": 65,
                "screen": [
                    {
                        "key": "logs",
                        "type" : "simple-table",
                        "columns" : [
                            {
                                "key" : "msg",
                                "label" : "msg"
                            },
                            {
                                "key" : "_created",
                                "label" : "created",
                                "type" : "date",
                                "format" : "L LTS",
                                "lang" : "it",
                                "canAutoResize" : false
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Script",
                "width": 100,
                "screen": [
                    {
                        "key": "script",
                        "label": "Script",
                        "type": "text-area",
                        "rows": 10
                    }
                ]
            }
        ]
    }
}

');


SET IDENTITY_INSERT angular_ui OFF;
