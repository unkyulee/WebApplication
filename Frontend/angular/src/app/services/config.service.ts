import { Injectable } from '@angular/core';

// get config from index.html
declare var __CONFIG__: any

@Injectable()
export class ConfigService {
  constructor(
  ) {
    // load from the config if defined
    this.set(this.global.angular_client)

    // load default login screen
    this.configuration.login.screen = [
      {
        type: "typography"
        , text: this.configuration.name
        , style: {
          fontSize: "20px"
          , textTransform: "uppercase"
          , textAlign: "center"
          , padding: "32px 0 32px"
        }
      },
      {
        type: "typography"
        , key: "error"
        , style: {
          color: "crimson"
          , textAlign: "center"
          , padding: "0 0 12px"
        }
      },
      {
        type: "text"
        , inputType: "email"
        , key: "id"
        , label: "Login ID"
        , "keyup.enter": "this.event.send({name: 'login'})"
        , errorCondition: "!value"
        , errorMessage: "Login ID can't be empty"
        , style: {
          padding: "0px 48px 0px 48px"
        }
      },
      {
        type: "text"
        , inputType: "password"
        , key: "password"
        , label: "Password"
        , "keyup.enter": "this.event.send({name: 'login'})"
        , style: {
          padding: "0px 48px 0px 48px"
        }
      },
      {
        type: "script-button"
        , buttons: [
          {
            label: "LOGIN"
            , script: "this.event.send({name: 'login'})"
            , style: {
              color: "#FFF"
              , backgroundColor: "#039be5"
              , width: "200px"
              , margin: "12px 0 48px 0"
            }
          }
        ]
      }
    ]

    // see if there are privacy
    if (this.configuration.privacy) {
      this.configuration.login.screen.push(
        {
          type: "typography"
          , text: `<a href='${this.configuration.privacy}' target=_blank>Privacy Policy</a>`
          , style: {
            color: "lightgrey"
            , fontSize: "12px"
            , padding: "8px"
            , textAlign: "center"
          }
        }
      )
    }
  }

  // save global configuration
  global = __CONFIG__

  // default configuration
  configuration: any = {
    _id: null,
    name: null,
    layout: {
      layout: 'fullwidth', // 'boxed', 'fullwidth'
      navigation: 'left', // 'right', 'left', 'top', 'none'
      toolbar: 'top' // 'top', 'bottom', 'none'
    },
    colors: {
      primary: '#323237',
      primaryLight: '#46464B',
      primaryDark: '#1E1E24',
      secondary: '#26315A',
      secondaryLight: '#3C466A',
      secondaryDark: '#111D4A',
      accent: '#AD172B',
      accentLight: '#B42C3E',
      accentDark: '#9E1528',
      background: 'lightgray'
    },
    login: {
      screen: []
    },
    privacy: false
  }

  set(configuration) {
    // Set the settings from the given object
    this.configuration = Object.assign(this.configuration, configuration);
  }

}
