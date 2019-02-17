import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router } from '@angular/router';
import { Subscription, EMPTY, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as obj from 'object-path'

// user imports
import { UIService } from '../../../services/ui.service';
import { RestService } from '../../../services/rest.service';
import { NavService } from '../../../services/nav.service';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../../services/config.service';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'data-table-detail',
    templateUrl: './data-table-detail.component.html',
    styleUrls: ['./data-table-detail.component.scss']
})
export class DataTableDetailComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router
        , private nav: NavService
        , private ui: UIService
        , private rest: RestService
        , private event: EventService
        , public snackBar: MatSnackBar
        , public config: ConfigService
        , public user: UserService
        , private breakpointObserver: BreakpointObserver
    ) { }

    @Input() uiElement: any;

    // data
    id: string
    prevData: any
    data: any
    screenConfigs: any[]

    //
    isReady = false

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

    ngOnInit() {

        // load screen config
        this.screenConfigs = this.ui.find(["detail", "screen"], this.uiElement)

        // load default header color
        this.headerColor = obj.get(this.config.configuration, 'colors.secondary')

        // load workflow
        this.loadWorkflow()

        // fetch id
        let paths = this.nav.currUrl.split("?")[0].split("/");
        this.id = paths[paths.length - 1];

        // download data
        this.requestDownload();

        // subscript to event
        this.onEvent = this.event.onEvent.subscribe(
            event => {
                if (event && event.name == "refresh") {
                    // remove null fields
                    for (let key of Object.keys(this.prevData)) if (this.prevData[key] == null || this.prevData[key] == '') delete this.prevData[key]
                    for (let key of Object.keys(this.data)) if (this.data[key] == null || this.data[key] == '') delete this.data[key]

                    // check if the data has not been changed
                    if (JSON.stringify(this.prevData) == JSON.stringify(this.data)) {
                        // refresh only if the record has not been changed
                        setTimeout(() => { this.requestDownload() }, 100);
                    }

                }

                else if (event && event.name == "merge-data") {
                    this.data = Object.assign(this.data, event.data)
                }

                else if (event && event.name == "insert-data") {
                    obj.ensureExists(this.data, event.path, [])
                    let data = obj.get(this.data, event.path)
                    if(!data) data = []

                    if (data.indexOf(event.data) > -1) {
                        // if exists then do nothing - it's already there
                    }
                    else if (event.datakey &&
                        data.find(item => item[event.datakey] == event.data[event.datakey])
                    ) {
                        let found = data.find(item => item[event.datakey] == event.data[event.datakey])
                        if (found) {
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
                    if (obj.has(this.data, event.path)) {
                        let data = obj.get(this.data, event.path)
                        if (data.indexOf(event.data) > -1) {
                            // if exists then do nothing - it's already there
                            data.splice(data.indexOf(event.data), 1)
                        }
                    }
                }

                else if (event && event.name == "save") {
                    this.save(event.showSplash)
                }

            }
        )

    }

    ngOnDestroy() {
        // remove null fields
        for (let key of Object.keys(this.prevData)) if (this.prevData[key] == null || this.prevData[key] == '') delete this.prevData[key]
        for (let key of Object.keys(this.data)) if (this.data[key] == null || this.data[key] == '') delete this.data[key]

        // check if the data has been changed
        if (JSON.stringify(this.prevData) != JSON.stringify(this.data)) {
            let willSave = confirm("Do you want to save before leaving this page?")
            if (willSave) this.save()
        }

        this.onEvent.unsubscribe()
    }


    loadWorkflow() {

        // setup workflow
        let workflow = this.ui.find(["detail", "workflow"], this.uiElement, null)

        // load default workflow
        if (workflow == null) {

            workflow = [
                {
                    name: "Save",
                    icon: "save",
                    action: () => { this.save() }
                },
                {
                    name: "Add",
                    icon: "edit",
                    action: () => { this.add() }
                },
                {
                    name: "Delete",
                    icon: "delete",
                    action: () => { this.delete() }
                }
            ]

        }
        else {
            // when loadin workflow from action then its script needs to be loaded as javascript
            for (let item of workflow)
                try { item.action = eval(item.action) }
                catch (e) { console.error(e) }
        }

        // send event to the workflow layout
        this.event.send({ name: 'workflow', data: workflow })
    }

    requestDownload() {
        // start the splash
        this.event.send("splash-show")

        // retrieve REST information
        let src = this.ui.find(["detail", "src"], this.uiElement)
        try { src = eval(src) } catch (e) { }
        let method = this.ui.find(["detail", "method"], this.uiElement)

        let data = this.ui.find(["detail", "data"], this.uiElement)
        try { data = eval(data) } catch (e) { }

        // download data through rest web services
        this.rest.request(src, data, method)
            .pipe(
                catchError(err => {
                    // hide the splash
                    this.event.send("splash-hide")
                    //
                    let errorAction = this.ui.find(["detail", "errorAction"], this.uiElement)
                    if (errorAction) { try { eval(errorAction) } catch (e) { console.error(e) } }
                    else alert(JSON.stringify(err));

                    return EMPTY;
                })
            )
            .subscribe(response => this.responseDownload(response));
    }

    responseDownload(response) {
        this.isReady = true
        // hide the splash
        this.event.send("splash-hide")

        // go through data transformation
        let transform = this.ui.find(["detail", "transform"], this.uiElement)
        if (transform) { try { this.data = eval(transform) } catch (e) { console.error(e) } }
        else this.data = response

        // save copy of unchanged data
        this.prevData = JSON.parse(JSON.stringify(this.data))
    }

    save(showSplash?) {
        // check if there are not error
        let errorMessage = ''
        for (let screen of this.screenConfigs) {
            for (let ui of screen.screen) {
                let value = this.data[ui.key] // used by the evaluation script
                let error = eval(ui.errorCondition)
                if (error) {
                    errorMessage += `${ui.label} - ${ui.errorMessage}\n`
                }
            }
        }
        if (errorMessage) {
            alert(errorMessage)
            return
        }

        // check if there are any changelogs to be made
        let changelogKey = this.ui.find(["edit", "changelogKey"], this.uiElement)
        if (changelogKey) {
            let changelogs = this.ui.find(["edit", "changelogs"], this.uiElement)
            if (changelogs) {
                for (let changelog of changelogs) {
                    // run condition
                    let condition = false
                    try { condition = eval(changelog.condition) } catch (e) { }
                    if (condition) {
                        // make a log
                        obj.ensureExists(this.data, changelogKey, [])
                        let logs = obj.get(this.data, changelogKey)

                        let message
                        try { message = eval(changelog.message) } catch (e) { }
                        if (message) {
                            logs.unshift({
                                _created: new Date(),
                                _createdBy: this.user.id(),
                                _createdBy_name: this.user.name(),
                                message: message
                            })
                        }
                    }
                }
            }
        }

        // start the splash
        if (showSplash != false) this.event.send("splash-show")

        // retrieve REST information
        let src = this.ui.find(["detail", "src"], this.uiElement)
        try { src = eval(src) } catch (e) { }
        let method = this.ui.find(["edit", "method"], this.uiElement, 'post')

        // update data through rest web services
        this.rest.request(src, this.data, method)
            .pipe(
                catchError((err) => {
                    // hide the splash
                    this.event.send("splash-hide")

                    // save failed
                    let errorAction = this.ui.find(["edit", "errorAction"], this.uiElement)
                    if (errorAction) { try { eval(errorAction) } catch (e) { console.error(e) } }
                    else alert(JSON.stringify(err));

                    return EMPTY;
                })
            )
            .subscribe(
                response => {
                    // hide the splash
                    this.event.send("splash-hide")

                    // send notification
                    if (JSON.stringify(this.prevData) != JSON.stringify(this.data)) {
                        this.sendNotification()
                    }

                    // reset dirty state
                    this.prevData = Object.assign({}, this.data)

                    let saveAction = this.ui.find(["edit", "saveAction"], this.uiElement)
                    if (saveAction) try { eval(saveAction) } catch (e) { console.error(e) }
                    else {
                        // check if the response has error
                        if (response && response.error) {
                            this.snackBar.open(response.error, null, { duration: 2000 })
                        } else {
                            this.snackBar.open('Saved', null, { duration: 2000 })
                        }

                    }
                }
            );

    }

    //
    add() {
        // navigate to add page
        this.router.navigateByUrl(`${this.nav.currNav.url}/add`);
    }

    //
    delete() {

        let confirmMessage = `Are you sure you want to delete?`
        let result = confirm(confirmMessage)
        if (result) {
            // service setup
            let src = this.ui.find(["delete", "src"], this.uiElement)
            let method = this.ui.find(["delete", "method"], this.uiElement, "delete")

            // interpolate the web service url providing the id
            // {id} will be replaced with value of this.id
            try { src = eval(src) } catch (e) { }

            // form id data
            let idField = this.ui.find(["delete", "idField"], this.uiElement, "_id")
            let data = {}; data[idField] = this.data[idField]

            // download data through rest web services
            this.rest.request(src, data, method).subscribe(
                (response) => {
                    // back to list
                    this.nav.back()
                }
            )
        }

    }

    sendNotification(trigger?: string) {
        // send notification email
        let notification = this.ui.find(["edit", "notification"], this.uiElement)
        if (notification) {
            let src = this.ui.find(["edit", "notification", "src"], this.uiElement)
            try { src = eval(src) } catch (e) { }
            let data = {
                trigger: this.ui.find(["edit", "notification", "trigger"], this.uiElement, 'item.updated')
                , prevData: this.prevData
                , currData: this.data
            }
            let method = this.ui.find(["edit", "notification", "method"], this.uiElement)

            this.rest.request(src, data, method).subscribe(response => { })
        }
    }

}
