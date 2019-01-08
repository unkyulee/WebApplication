import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DateAdapter } from '@angular/material/core';

@Component({
    selector: 'date'
    , templateUrl: './date.component.html'
})
export class DateComponent {

    @Input() uiElement: any
    @Input() data: any    

    get value() {
        let v = null;

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

        // label Transform ?
        if (this.uiElement.transform) {
            try { v = eval(this.uiElement.transform) }
            catch (e) { }
        }

        return v
    }

    set value(v: any) {               
        if (this.data && this.uiElement.key) {
            this.data[this.uiElement.key] = v
        }
    }

    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    changed(e) {
        this.change.emit(e.value)        
    }

    constructor(private dateAdapter: DateAdapter<Date>) {

    }

    ngOnInit() {
        this.dateAdapter.setLocale(this.uiElement.lang)
    }

}
