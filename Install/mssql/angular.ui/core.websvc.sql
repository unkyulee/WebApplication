SET IDENTITY_INSERT angular_ui ON;

IF EXISTS(SELECT * FROM angular_ui WHERE _id = 110) DELETE FROM angular_ui WHERE _id = 110
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

SET IDENTITY_INSERT angular_ui OFF;