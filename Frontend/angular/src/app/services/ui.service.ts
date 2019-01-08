import { Injectable } from '@angular/core';
import { EventService } from './event.service';

// get config from index.html
declare var __CONFIG__: any

@Injectable()
export class UIService {
    constructor(
        private event: EventService
    ) {
        // init ui element
        this.set()

        // event handler
        this.event.onEvent.subscribe(
            e => {
                if (e == 'authenticated') {
                    // set navigation
                    this.set()
                }
            }
        )
    }

    // save global config
    global = __CONFIG__

    // navigation model
    uiElements: any[] = []

    set() {
        try {
            this.uiElements = this.global.angular_ui
            if(!this.uiElements) {
                // if index.js doesn't contain angular_navigation then get it from the cache
                // Set the settings from the given object
                this.uiElements = JSON.parse(localStorage.getItem('angular_ui'))
            }            
        } catch(e) {}
    }

    // given data find value and if not found then look up in parent
    find(path: string[], data: any, defaultValue?: any) {
        let retValue = null

        let currPath = Object.assign([], path)
        for (let i in path) {
            retValue = this.get(currPath, data)
            if (!retValue)
                currPath.shift()
            else
                return retValue
        }

        return retValue == null ? defaultValue : retValue;
    }

    get(path: string[], data: any) {
        let value = data
        for (let pathname of path) {
            if (!value[pathname])
                return null;
            value = value[pathname]
        }

        return value
    }

}
