import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material';

// user imports
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";
import { RestService } from "../../services/rest.service";

// cordova
declare var cordova: any

@Component({
    selector: 'script-button'
    , templateUrl: './script-button.component.html'
    , styleUrls: ['./script-button.component.css']
})
export class ScriptButtonComponent {
    constructor(
        private router: Router
        , private rest: RestService
        , public event: EventService // these are used by the user code
        , public user: UserService // these are used by the user code
        , public snackBar: MatSnackBar // userd in user code
    ) { }

    @Input() uiElement: any
    @Input() data: any

    ngOnInit() {
        let that = this
        for(let buttonProp of this.uiElement.buttons) {
            // if script_id is specified then look for the script
            if(buttonProp.script_id && ! buttonProp.script) {
                try { buttonProp.url = eval(buttonProp.url) } catch(e) {}
                this.rest.request(buttonProp.url).subscribe(
                    response => {
                        buttonProp.script = response
                        if(buttonProp.transform) {
                            try { buttonProp.script = eval(buttonProp.transform) } catch {}
                        }
                    }
                )
            }
        }

    }

    click(buttonProp) {
        try { eval(buttonProp.script) }
        catch (e) { console.error(e) }
    }

    route(url) {
        // navigate to link
        this.router.navigateByUrl(url)
    }

    condition(uiElement) {
        let result = true
        if(uiElement.condition) {
            try { result = eval(uiElement.condition) }
            catch(e) { console.error(e) }
        }
        return result
    }

}
