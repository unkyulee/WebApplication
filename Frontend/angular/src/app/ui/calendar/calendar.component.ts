import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
  CalendarView,
  DAYS_OF_WEEK,
} from "angular-calendar";
import * as moment from "moment";
import obj from "object-path";

// user Imports
import { BaseComponent } from "../base.component";

@Component({
  selector: "calendar",
  templateUrl: "calendar.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["calendar.component.scss"],
})
export class CalendarComponent extends BaseComponent {
  constructor(public elRef: ElementRef) {
    super();
  }

  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  locale: string;

  events: CalendarEvent[] = [];

  ngOnInit() {
    super.ngOnInit();

    this.locale = this.config.get("locale");
    // weekStartsOn option is ignored when using moment, as it needs to be configured globally for the moment locale
    moment.updateLocale("locale", {
      week: {
        dow: DAYS_OF_WEEK.MONDAY,
        doy: 0,
      },
    });

    // subscript to event
    this.onEvent = this.event.onEvent.subscribe((event) => {
      if (
        event &&
        event.name == "refresh" &&
        (!event.key || event.key == this.uiElement.key)
      ) {
        setTimeout(() => this.requestDownload(), 0);
      } else if (event && event.name == "viewDate") {
        this.viewDate = moment(event.date).toDate();
      } else if (event && event.name == "events") {
        this.events = event.events;
        this.event.sendAsync({ name: "events-loaded" }, 1000);
      }
    });

    this.requestDownload();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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
        .subscribe((response) => this.responseDownload(response));
    }
  }

  async responseDownload(response) {
    // map data from response
    if (this.uiElement.transform) {
      try {
        let value = await eval(this.uiElement.transform);
        obj.set(this.data, this.uiElement.key, value);
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

  dayClicked(day): void {
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
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    if (`${event.start}` != `${newStart}` || `${event.end}` != `${newEnd}`) {
      // update event
      try {
        eval(this.uiElement.eventTimesChanged);
      } catch (e) {
        console.error(e);
      }
    }

    // move the item
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }


  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    if(this.uiElement.beforeMonthViewRender) {
      try {
        eval(this.uiElement.beforeMonthViewRender);
      } catch(ex) {
        console.error(ex, this.uiElement.beforeMonthViewRender, this.uiElement)
      }
    }
  }
}
