import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import * as obj from 'object-path'
import {MatSnackBar} from '@angular/material';

// user imports
import { UIService } from '../../../services/ui.service';
import { NavService } from '../../../services/nav.service';
import { RestService } from '../../../services/rest.service';
import { EventService } from '../../../services/event.service';
import { ConfigService } from '../../../services/config.service';
import { UserService } from '../../../services/user.service';


@Component({
    selector: 'data-table-add',
    templateUrl: '../detail/data-table-detail.component.html',
    styleUrls: ['../detail/data-table-detail.component.scss']
})
export class DataTableAddComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router
        , private ui: UIService
        , private event: EventService
        , private nav: NavService
        , private rest: RestService
        , public snackBar: MatSnackBar
        , private config: ConfigService
        , public user: UserService
        , private breakpointObserver: BreakpointObserver
    ) {
    }

    // configuration of the ui element
    @Input() uiElement: any;

    // data
    id: string
    data: any = {}
    screenConfigs: any[]

    // header color
    headerColor: string

    // detect window size changes
    isHandset: boolean
    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map(result => {
                this.isHandset = result.matches
                return result.matches
            })
        );

    // event subscription
    onEvent: Subscription

    //
    isReady = true

    ngOnInit() {

        // set as initial data from nav param
        this.data = this.nav.getParams()

        // load screen config - defaults to detail screen
        this.screenConfigs = this.ui.find(["add", "screen"], this.uiElement)
        if (!this.screenConfigs) this.screenConfigs = this.ui.find(["detail", "screen"], this.uiElement)

        // load default header color
        this.headerColor = obj.get(this.config.configuration, 'colors.secondary')

        // setup workflow
        this.loadWorkflow()

        // subscript to event
        this.onEvent = this.event.onEvent.subscribe(
            event => {
                if (event && event.name == "merge-data") {
                    this.data = Object.assign(this.data, event.data)
                }

                else if (event && event.name == "insert-data") {
                    obj.ensureExists(this.data, event.path, [])
                    let data = obj.get(this.data, event.path)

                    if( data.indexOf(event.data) > -1 ) {
                        // if exists then do nothing - it's already there
                    }
                    else if( event.datakey &&
                            data.find(item => item[event.datakey] == event.data[event.datakey])
                    ) {
                        let found = data.find(item => item[event.datakey] == event.data[event.datakey])
                        if( found ) {
                            // item found - replace it
                            let index = data.indexOf(found)
                            data[index] = event.data;
                        }
                    }
                    else {
                        // if not exists then add
                        obj.push(this.data, event.path, event.data)
                        obj.set(this.data, event.path,
                            JSON.parse(JSON.stringify(obj.get(this.data, event.path)))
                        )
                    }

                }

                else if (event && event.name == "delete-data") {
                    if(obj.has(this.data, event.path))
                    {
                        let data = obj.get(this.data, event.path)
                        if(data.indexOf(event.data) > -1 ){
                            // if exists then do nothing - it's already there
                            data.splice(data.indexOf(event.data), 1)
                        }
                    }

                }

                else if (event && event.name == "save") {
                    this.create()
                }

            }
        )

    }

    ngOnDestroy() {
        this.onEvent.unsubscribe()
    }

    loadWorkflow() {

        // setup workflow
        let workflow = this.ui.find(["add", "workflow"], this.uiElement, null)

        // load default workflow
        if (workflow == null) {

            workflow = [
                {
                    name: "Create",
                    icon: "send",
                    action: () => { this.create() }
                }
            ]

        }
        else {
            // when loadin workflow from action then its script needs to be loaded as javascript
            for (let item of workflow) item.action = eval(item.action)
        }

        // send event to the workflow layout
        this.event.send({ name: 'workflow', data: workflow })
    }


    // custom workflow
    back() {
        this.nav.back();
    }

    create() {

        // check if there are not error
        let errorMessage = ''
        for(let screen of this.screenConfigs) {
            for(let ui of screen.screen) {
                let value = this.data[ui.key]
                let error = eval(ui.errorCondition)
                if( error ) {
                    errorMessage += `${ui.label} - ${ui.errorMessage}\n`
                }
            }
        }
        if( errorMessage ) {
            alert(errorMessage)
            return
        }

        // start the splash
        this.event.send("splash-show")

        // upload data
        let src = this.ui.find(["add", "src"], this.uiElement)
        try { src = eval(src) } catch(e) {}
        let method = this.ui.find(["add", "method"], this.uiElement, "put")

        this.rest.request(
            src,
            this.data, // form data
            method
        ).subscribe(response => {
            // hide the splash
            this.event.send("splash-hide")

            // check if error
            if (response && response.error ) {
                this.snackBar.open(response.error, null, {duration: 2000})
                return
            }

            // figure out created item's id
            let id = response._id
            let transform = this.ui.find(["add", "transform"], this.uiElement)
            if (transform) {
                try { id = eval(transform) } catch (e) { console.error(e) }
            }

            // assign new id to the data
            let idField = this.ui.find(["add", "idField"], this.uiElement, '_id')
            this.data[idField] = id

            // send notification email
            this.sendNotification(id)

            // show created item
            this.showCreatedItem(id)

        });

    }

    showCreatedItem(id) {
        // navigate pop
        this.nav.navPopStack()

        // after creating item back to the list
        this.router.navigateByUrl(`${this.nav.currNav.url}/detail/${id}`);
    }

    sendNotification(id) {

        // send notification email
        let notification = this.ui.find(["add", "notification"], this.uiElement)
        if (notification) {
            let src = this.ui.find(["add", "notification", "src"], this.uiElement)
            let data = this.ui.find(["add", "notification", "data"], this.uiElement, {})
            data = Object.assign(data, {
                trigger: this.ui.find(["add", "notification", "trigger"], this.uiElement, 'item.created')
                , currData: this.data
            })

            let method = this.ui.find(["add", "notification", "method"], this.uiElement)

            this.rest.request(src, data, method).subscribe(response => { })
        }
    }

}
