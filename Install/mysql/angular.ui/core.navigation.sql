
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