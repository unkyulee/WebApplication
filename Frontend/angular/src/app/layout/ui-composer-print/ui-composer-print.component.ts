import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

// user imports
import { EventService } from '../../services/event.service';
import { ConfigService } from 'src/app/services/config.service';
import { SelectionComponent } from 'src/app/ui/selection/selection.component';
import { SimpleTableComponent } from 'src/app/ui/simple-table/simple-table.component';
import { RestService } from 'src/app/services/rest.service';
import { ImageUploadComponent } from 'src/app/ui/img-upload/img-upload.component';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'ui-composer-print',
    templateUrl: './ui-composer-print.component.html',
    styleUrls: ['./ui-composer-print.component.scss']
})
export class UIComposerPrintComponent {
    constructor(
        private event: EventService
        , public config: ConfigService
        , private rest: RestService
        , private user: UserService
    ) { }

    screenConfigs: any;
    data: any = {}
    name: string

    // event subscription
    onEvent: Subscription

    ngOnInit() {
        // subscript to event
        this.onEvent = this.event.onEvent.subscribe(
            event => {
                if (event.name == 'print-dialog') {
                    this.name = event.display
                    this.screenConfigs = event.screenConfigs
                    this.data = event.data
                    setTimeout(() => this.print(), 0);
                }
            }
        )
    }

    ngOnDestroy() {
        this.onEvent.unsubscribe()
    }

    print() {

        // open up print screen for the browsers
        let printFrame = document.createElement('iframe');
        printFrame.name = "print_outlet";
        printFrame.style.position = "absolute";
        printFrame.style.top = "-1000000px";
        document.body.appendChild(printFrame);

        // write content
        let doc = printFrame.contentWindow
        doc.document.open()
        doc.document.write(`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">`)
        doc.document.write(`<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>`)
        doc.document.write(`<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>`)
        doc.document.write(`<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>`)
        doc.document.write(document.getElementById('print_preview').innerHTML)
        doc.document.close()

        // remove the generated frame
        printFrame.onload = function() {
            window.frames["print_outlet"].focus();
            window.frames["print_outlet"].print();
            document.body.removeChild(printFrame);
        };


    }

    formatValue(ui, data, type?) {
        let value

        if(!ui.type || ui.type == 'text') {
            value = data[ui.key]
            if( ui.transform ) {
                try { value = eval(ui.transform) }
                catch(e) {}
            }
        }

        else if(ui.type == 'selection') {
            let selectedOption = ui.options.find(x => x[ui.optionKey] == data[ui.key])
            if(selectedOption) value = SelectionComponent.prototype.format(selectedOption, ui)
        }

        else if(type == 'simple-table') {
            value = SimpleTableComponent.prototype.format(ui, data)
        }

        else if(ui.type == 'img-upload') {
            value = `${this.rest.host()}${data.url}${ImageUploadComponent.prototype.extra(data, this.user, this.config, true)}&print=1`
        }

        return value
    }

}
