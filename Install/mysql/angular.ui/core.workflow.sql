
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