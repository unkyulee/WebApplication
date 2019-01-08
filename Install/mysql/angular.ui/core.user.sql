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
