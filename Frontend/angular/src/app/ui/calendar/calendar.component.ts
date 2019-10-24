import { Component } from "@angular/core";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from "angular-calendar";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import * as moment from "moment";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "calendar",
  templateUrl: "calendar.component.html"
})
export class CalendarComponent extends BaseComponent {
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;

  events: CalendarEvent[] = [];
  /*
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: colors.red,
    actions: this.actions,
    allDay: true,
    resizable: {
      beforeStart: true,
      afterEnd: true
    },
    draggable: true
  */

  /*
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent("Deleted", event);
      }
    }
  ];
  */

  ngOnInit() {
    // subscript to event
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (
        event &&
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.requestDownload(), 0);
      } else if (event && event.name == "viewDate") {
        this.viewDate = moment(event.date).toDate();
      }
    });

    this.requestDownload();
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  requestDownload() {
    //
    if (this.uiElement.src) {
      let src = this.uiElement.src;
      try {
        src = eval(src);
      } catch (e) {
        console.error(e);
      }
      let data = this.nav.getParams();
      try {
        eval(this.uiElement.preProcess);
      } catch (e) {
        console.error(e);
      }

      // show splash
      this.event.send("splash-show");

      this.rest
        .request(
          src,
          data,
          this.uiElement.method,
          {},
          typeof this.uiElement.cache === "undefined"
            ? true
            : this.uiElement.cache
        )
        .subscribe(response => this.responseDownload(response));
    }
  }

  async responseDownload(response) {
    // stop the loading indicator
    this.event.send("splash-hide");

    // map data from response
    if (this.uiElement.transform) {
      try {
        this.data[this.uiElement.key] = await eval(this.uiElement.transform);
      } catch (e) {
        console.error(e);
      }
    }
  }

  eventClicked(event: CalendarEvent): void {
    try {
      eval(this.uiElement.eventClicked);
    } catch (e) {
      console.error(e);
    }
  }

  dayClicked(date): void {
    try {
      eval(this.uiElement.dayClicked);
    } catch (e) {
      console.error(e);
    }
  }

  hourSegmentClicked(date): void {
    try {
      eval(this.uiElement.hourSegmentClicked);
    } catch (e) {
      console.error(e);
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    // update event
    try {
      eval(this.uiElement.eventTimesChanged);
    } catch (e) {
      console.error(e);
    }

    // move the item
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }

  handleEventTimesChanged(iEvent) {

  }

}
