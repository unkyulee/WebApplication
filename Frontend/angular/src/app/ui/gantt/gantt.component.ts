import { Component, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
import "dhtmlx-gantt";
declare var gantt: any
import { Subscription } from "rxjs";
import { EventService } from "src/app/services/event.service";
import * as moment from 'moment';

@Component({
    selector: 'gantt'
    , templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {
    constructor(
        private event: EventService
    ) {}

    @ViewChild("gantt_container") ganttContainer: ElementRef;

    // configuration of the ui element
    @Input() uiElement: any;
    @Input() parent: HTMLElement;

    // event subscription
    eventSubscription: Subscription

    ngOnInit() {
        // event handler
        this.eventSubscription = this.event.onEvent.subscribe(
            event => {
                if (
                    event &&
                    this.uiElement.listen &&
                    event.name == "data-loaded" &&
                    this.uiElement.listen == event._id
                ) {
                    let response = event.data
                    if (this.uiElement.transformData) {
                        try { this.tasks.data = eval(this.uiElement.transformData) } catch (e) { }
                        if (!this.tasks.data) this.tasks.data = []
                    }
                    if (this.uiElement.transformLink) {
                        try { this.tasks.links = eval(this.uiElement.transformLink) } catch (e) { }
                        if (!this.tasks.links) this.tasks.links = []
                    }
                    this.loadGantt()
                }
            }
        )

    }

    ngOnDestroy() {
        this.eventSubscription.unsubscribe()
    }

    ngAfterViewInit() {
        if (this.uiElement.config) {
            Object.assign(gantt.config, this.uiElement.config)
        }

        //
        gantt.locale.labels['section_parent'] = "Parent Task";
        gantt.config.lightbox.sections = [
            {
                name: "type",
                height: 22,
                map_to: "type",
                type: "select",
                options: [
                    { key: gantt.config.types.project, label: "Project" },
                    { key: gantt.config.types.milestone, label: "Milestone" },
                    { key: gantt.config.types.task, label: "Task" }
                ]
            },
            {
                name: "parent",
                height: 22,
                map_to: "parent",
                type: "select",
                options: this.tasks.data.map(x => { return { key: x.id, label: x.text } })
            },
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", type: "duration", map_to: "auto" }
        ];

        // drop event handler - onChange
        let that = this
        gantt.attachEvent("onAfterTaskDrag", function (id, mode) {
            var task = gantt.getTask(id);
            if (mode == gantt.config.drag_mode.progress) {
            } else {
                that.onChange(task)
            }
        });

        // on task selected - onSelect
        gantt.attachEvent("onTaskClick", function (id, e) {
            //any custom logic here
            var task = gantt.getTask(id);
            that.onSelect(task)
            return true;
        });
    }

    loadGantt() {
        // load gantt
        if (this.tasks.data.length > 0) {
            // calculate the total height
            this.ganttContainer.nativeElement.style.height = `${this.tasks.data.length * 35 + gantt.config.scale_height + 10}px`

            gantt.init(this.ganttContainer.nativeElement);
            gantt.clearAll();
            gantt.parse(this.tasks);
            zoomToFit()
        }
    }

    onChange(task) {
        // calculate the total height
        this.ganttContainer.nativeElement.style.height = `${this.tasks.data.length * 35 + gantt.config.scale_height + 10}px`
        zoomToFit()

        if (this.uiElement.onChange) {
            try {
                eval(this.uiElement.onChange)
            } catch (e) {
                console.error(e)
            }
        }
    }

    onSelect(task) {
        if (this.uiElement.onSelect) {
            try {
                eval(this.uiElement.onSelect)
            } catch (e) {
                console.error(e)
            }
        }
    }

    tasks: any = {
        data: [],
        links: []
    }

}

function applyConfig(config, dates) {
    gantt.config.scale_unit = config.scale_unit;
    if (config.date_scale) {
        gantt.config.date_scale = config.date_scale;
        gantt.templates.date_scale = null;
    }
    else {
        gantt.templates.date_scale = config.template;
    }

    gantt.config.step = config.step;
    gantt.config.subscales = config.subscales;

    if (dates) {
        gantt.config.start_date = gantt.date.add(dates.start_date, -1, config.unit);
        gantt.config.end_date = gantt.date.add(gantt.date[config.unit + "_start"](dates.end_date), 2, config.unit);
    } else {
        gantt.config.start_date = gantt.config.end_date = null;
    }
}

function zoomToFit() {
    var project = gantt.getSubtaskDates(),
        areaWidth = gantt.$task.offsetWidth;

    for (var i = 0; i < scaleConfigs.length; i++) {
        var columnCount = getUnitsBetween(project.start_date, project.end_date, scaleConfigs[i].unit, scaleConfigs[i].step);
        if ((columnCount + 2) * gantt.config.min_column_width <= areaWidth) {
            break;
        }
    }

    if (i == scaleConfigs.length) {
        i--;
    }

    applyConfig(scaleConfigs[i], project);
    gantt.render();
}

// get number of columns in timeline
function getUnitsBetween(from, to, unit, step) {
    var start = new Date(from),
        end = new Date(to);
    var units = 0;
    while (start.valueOf() < end.valueOf()) {
        units++;
        start = gantt.date.add(start, step, unit);
    }
    return units;
}

//Setting available scales
var scaleConfigs = [
    // minutes
    {
        unit: "minute", step: 1, scale_unit: "hour", date_scale: "%H", subscales: [
            {unit: "minute", step: 1, date: "%H:%i"}
        ]
    },
    // hours
    {
        unit: "hour", step: 1, scale_unit: "day", date_scale: "%j %M",
        subscales: [
            {unit: "hour", step: 1, date: "%H:%i"}
        ]
    },
    // days
    {
        unit: "day", step: 1, scale_unit: "month", date_scale: "%F",
        subscales: [
            {unit: "day", step: 1, date: "%j"}
        ]
    },
    // weeks
    {
        unit: "week", step: 1, scale_unit: "month", date_scale: "%F",
        subscales: [
            {
                unit: "week", step: 1, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%d %M");
                    var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }
            }
        ]
    },
    // months
    {
        unit: "month", step: 1, scale_unit: "year", date_scale: "%Y",
        subscales: [
            {unit: "month", step: 1, date: "%M"}
        ]
    },
    // quarters
    {
        unit: "month", step: 3, scale_unit: "year", date_scale: "%Y",
        subscales: [
            {
                unit: "month", step: 3, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%M");
                    var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }
            }
        ]
    },
    // years
    {
        unit: "year", step: 1, scale_unit: "year", date_scale: "%Y",
        subscales: [
            {
                unit: "year", step: 5, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%Y");
                    var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }
            }
        ]
    },
    // decades
    {
        unit: "year", step: 10, scale_unit: "year", template: function (date) {
            var dateToStr = gantt.date.date_to_str("%Y");
            var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
        },
        subscales: [
            {
                unit: "year", step: 100, template: function (date) {
                    var dateToStr = gantt.date.date_to_str("%Y");
                    var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                }
            }
        ]
    }
];
