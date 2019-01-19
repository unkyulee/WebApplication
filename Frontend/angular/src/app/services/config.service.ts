import { Injectable } from '@angular/core';

// get config from index.html
declare var __CONFIG__: any

@Injectable()
export class ConfigService {
    constructor(
    ) {
        // load from the config if defined
        this.set(this.global.angular_client)
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
        privacy: false
    }

    set(configuration) {
        // Set the settings from the given object
        this.configuration = Object.assign(this.configuration, configuration);
    }

}
