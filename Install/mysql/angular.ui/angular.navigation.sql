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