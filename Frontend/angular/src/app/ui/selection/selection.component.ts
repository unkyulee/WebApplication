import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { MatSelect } from "@angular/material";
import * as obj from 'object-path'

// user imports
import { RestService } from "../../services/rest.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'selection'
    , templateUrl: './selection.component.html'
})
export class SelectionComponent implements OnInit {
    // Init
    constructor(
        private rest: RestService
        , public user: UserService
    ) { }

    @Input() uiElement: any
    @Input() data: any
    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    get value() {
        if (this.data) return this.data[this.uiElement.key]
        if (this.uiElement.multiple) return []
        return ''
    }

    @ViewChild('select') select: MatSelect

    set value(v: any) {
        this.change.emit(v)

        // close the selection panel
        this.select.close()

        if (this.data) {
            // set value to itself
            this.data[this.uiElement.key] = v

            // updateAlso
            this.updateAlso(v)
        }
    }

    updateAlso(v) {
        // updateAlso
        if (this.uiElement.updateAlso && this.uiElement.options) {
            if (this.uiElement.multiple != true) {
                // find selected option
                let selected = this.uiElement.options.find(
                    item => item[this.uiElement.optionKey] == v
                )
                for (let update of this.uiElement.updateAlso) {
                    // update the target data
                    this.data[update.targetKey] = selected[update.sourceKey]
                }
            }
            else {
                for (let value of v) {
                    // find selected option                    
                    let selected = this.uiElement.options.find(
                        item => item[this.uiElement.optionKey] == value
                    )

                    for (let update of this.uiElement.updateAlso) {

                        // get source data
                        let source = selected[update.sourceKey]

                        // update the target data
                        obj.ensureExists(this.data, update.targetKey, [])
                        let target = obj.get(this.data, update.targetKey)
                        if (Array.isArray(target) && target.indexOf(source) < 0) target.push(source)
                    }
                }
            }
        }
    }


    ngOnInit() {
        // if optionSrc is specified then download the options
        if (this.uiElement.optionSrc) {
            let src = this.uiElement.optionSrc
            try { src = eval(src) } catch (e) { }

            let data = this.uiElement.optionData
            let method = this.uiElement.optionMethod
            this.rest.request(src, data, method).subscribe(
                response => {
                    if (this.uiElement.optionTransform)
                        this.uiElement.options = eval(this.uiElement.optionTransform)
                    else
                        this.uiElement.options = response

                    // when options are ready then run 
                    this.default()
                }
            )
        } else {
            this.default()
        }
    }

    default() {
        // when data is not set then apply default value
        if (!this.data[this.uiElement.key] && this.uiElement.default) {
            this.data[this.uiElement.key] = this.uiElement.default
            try { this.data[this.uiElement.key] = eval(this.uiElement.default) } catch { }

            // try to go through updateAlso options
            if (this.data[this.uiElement.key])
                this.updateAlso(this.data[this.uiElement.key])
        }
    }

    format(option, uiElement) {
        let value = option[uiElement.optionLabel ? uiElement.optionLabel : uiElement.optionKey]

        if (uiElement.optionLabelTransform) {
            try { value = eval(uiElement.optionLabelTransform) }
            catch (e) { console.error(e) }
        }
        return value
    }

    condition() {
        let result = true
        if (this.uiElement.condition) {
            try { result = eval(this.uiElement.condition) }
            catch (e) { console.error(e) }
        }
        return result
    }

}
