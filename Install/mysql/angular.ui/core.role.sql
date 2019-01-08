
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
