import { Component, Input } from "@angular/core";

@Component({
    selector: 'checkbox'
    , templateUrl: './checkbox.component.html'
})
export class CheckboxComponent {
    @Input() uiElement: any
    @Input() data: any

    default: any // save default value

    ngOnInit() {
        // set default value if specified
        if (this.uiElement.default) {
            this.default = eval(this.uiElement.default)
        }
    }

    get value() {
        let v = null;

        if (this.data) {
            if (this.uiElement.key) {
                // set value
                v = this.data[this.uiElement.key]
            }
        }

        // Transform
        if (this.uiElement.transform) v = eval(this.uiElement.transform)

        return v
    }

    set value(v: any) {
        if (this.data) {
            if (this.uiElement.key) {
                // run onChange if exists
                if( this.uiElement.change ) {
                    try { eval(this.uiElement.change) }
                    catch(e) { console.error(e) }
                }
                this.data[this.uiElement.key] = v
            }

        }
    }

}
