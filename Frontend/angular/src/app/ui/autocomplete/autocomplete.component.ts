import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

// user imports
import { RestService } from "../../services/rest.service";
import { UIService } from "../../services/ui.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
    selector: 'autocomplete'
    , templateUrl: './autocomplete.component.html'
})
export class AutoCompleteComponent implements OnInit {
    // Init
    constructor(
        private rest: RestService
        , private ui: UIService
        , public user: UserService
    ) { }

    @Input() uiElement: any
    @Input() data: any
    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {        
        // if optionSrc is specified then download the options
        this.loadOption()
    }

    get value() {
        if (this.data && this.data[this.uiElement.key])
            return this.data[this.uiElement.key]
        return ""
    }

    set value(v: any) {
        this.change.emit(v)

        // when value is set, reload the option
        this.loadOption()

        if (this.data) {
            // set value to itself
            this.data[this.uiElement.key] = v
            this.updateAlso(v)
        }
    }

    updateAlso(v) {
        // updateAlso
        if (this.uiElement.updateAlso && this.uiElement.options) {

            // find selected option
            let selected = this.uiElement.options.find(
                item => item[this.uiElement.optionKey] == v
            )

            for (let update of this.uiElement.updateAlso) {
                let source

                // update the target data
                if (selected)
                    source = selected[update.sourceKey]

                this.data[update.targetKey] = source
            }
        }
    }
    
    loadOption() {
        // if optionSrc is specified then request for option
        if (this.uiElement.optionSrc) {
            // download data through rest web services
            let src = this.ui.find(["optionSrc"], this.uiElement)
            try { src = eval(src) } catch(e) { }

            let method = this.ui.find(["optionMethod"], this.uiElement)
            let data = this.ui.find(["optionData"], this.uiElement, {})

            this.rest.request(src, data, method)
                .subscribe(response => {
                    let transform = this.ui.find(["optionTransform"], this.uiElement, {})
                    this.uiElement.options = eval(transform)

                    // set default when options are loaded
                    this.default()
                })
        } else {
            // set default
            this.default()
        }
    }

    default() {
        // when data is not set then apply default value
        if (!this.data[this.uiElement.key] && this.uiElement.default) {
            this.data[this.uiElement.key] = this.uiElement.default
            try {
                this.data[this.uiElement.key] = eval(this.uiElement.default)
            } catch { }

             // try to go through updateAlso options
            this.updateAlso(this.data[this.uiElement.key]) 
            return this.data[this.uiElement.key]
        }
    }

    format(row) {
        let value = row[this.uiElement.optionLabel ? this.uiElement.optionLabel : this.uiElement.optionKey]
        if (this.uiElement.format) {
            try { value = eval(this.uiElement.format) } catch(e) {}
        }
        return value
    }

}
