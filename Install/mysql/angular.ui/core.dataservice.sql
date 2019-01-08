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
