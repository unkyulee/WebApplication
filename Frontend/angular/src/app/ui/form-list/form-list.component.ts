import { Component, Input } from "@angular/core"
import * as objectPath from 'object-path'

@Component({
    selector: 'form-list'
    , templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})
export class FormListComponent {

    @Input() uiElement: any

    // get data
    _data: any
    @Input()
    get data() { return this._data }
    set data(v) {
        this._data = v

        // set forms
        if(v && ! this.forms) {
            objectPath.ensureExists(this._data, this.uiElement.key, [])
            this.forms = objectPath.get(this._data, this.uiElement.key)

            // if no forms are set then use default
            if( ! this.forms || this.forms.length == 0 ) {
                if( this.uiElement.default ) {
                    objectPath.set(this._data, this.uiElement.key, this.uiElement.default)
                    this.forms = objectPath.get(this._data, this.uiElement.key)
                }

            }
        }
    }

    // forms
    forms: any[]

    constructor(
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    addForm() {

        // add forms
        this.forms.push({})

    }

    delForm(form) {
        this.forms.splice(this.forms.indexOf(form), 1)
    }

}
