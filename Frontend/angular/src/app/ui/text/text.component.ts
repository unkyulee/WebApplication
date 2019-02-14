import { Component, Input } from "@angular/core";
import { UserService } from "../../services/user/user.service";
import { EventService } from "../../services/event.service";

@Component({
    selector: 'text'
    , templateUrl: './text.component.html'
})
export class TextComponent {
    constructor(
        public user: UserService
        , public event: EventService
    ) { }

    @Input() uiElement: any
    @Input() data: any

    get value() {
        let v = null;

        // do not set value if it is password
        if( this.uiElement.inputType == 'password')
            return

        if (this.data && this.uiElement.key) {
            // if null then assign default
            if (!this.data[this.uiElement.key]) {
                let def = this.uiElement.default
                try { def = eval(this.uiElement.default) }
                catch(e) {}
                this.data[this.uiElement.key] = def
            }

            // set value
            v = this.data[this.uiElement.key]
        }

        // Transform
        if (this.uiElement.transform) {
            try {v = eval(this.uiElement.transform)}
            catch(e) {}
        }

        // if number
        if( v && this.uiElement.inputType == "number" ) v = parseFloat(v)

        return v
    }

    set value(v: any) {
        if (this.data && this.uiElement.key) {
            this.data[this.uiElement.key] = v
            // if number
            if (v && this.uiElement.inputType == "number")
                this.data[this.uiElement.key] = parseFloat(v)
        }
    }

    condition() {
        let result = true
        if(this.uiElement.condition) {
            try { result = eval(this.uiElement.condition) }
            catch(e) { console.error(e) }
        }
        return result
    }

    click() {
        if(this.uiElement.click) {
            try { eval(this.uiElement.click) }
            catch(e) { console.error(e) }
        }
    }

    eval(script) {
        eval(script)
    }

}
