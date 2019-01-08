SET IDENTITY_INSERT angular_ui ON;

IF EXISTS(SELECT * FROM angular_ui WHERE _id = 16) DELETE FROM angular_ui WHERE _id = 16
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

SET IDENTITY_INSERT angular_ui OFF;