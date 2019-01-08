SET IDENTITY_INSERT angular_ui ON;

IF EXISTS(SELECT * FROM angular_ui WHERE _id = 0) DELETE FROM angular_ui WHERE _id = 0
INSERT INTO angular_ui (_id, content)
VALUES (0, '
{
  "_id": 0,
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
                "script": "this.event.send({ name:''open-dialog'', uiElementId: 1, data: JSON.parse(JSON.stringify(this.data)) });"
              }
            ]

          }

        ]
      }
    ]
  }
}

');


IF EXISTS(SELECT * FROM angular_ui WHERE _id = 1) DELETE FROM angular_ui WHERE _id = 1
INSERT INTO angular_ui (_id, content)
VALUES (1, '

{
  "_id" : 1,
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
          "script": "
          this.event.send({name:''close-dialog''});
          this.rest.request(''/adminapi/changepassword'', this.data, ''post'')
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

SET IDENTITY_INSERT angular_ui OFF;