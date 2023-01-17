// @ts-nocheck
import { LOCALE_ID, Inject, Injectable } from "@angular/core";
import { CalendarEventTitleFormatter, CalendarEvent } from "angular-calendar";
import { formatDate } from "@angular/common";

@Injectable()
export class CalendarTitleProvider extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    if (event.monthFormat) {
      return eval(event.monthFormat);
    }
    return event.title;
  }

  week(event: CalendarEvent): string {
    if (event.weekFormat) {
      return eval(event.weekFormat);
    }
    return event.title;
  }

  day(event: CalendarEvent): string {
    if (event.dayFormat) {
      return eval(event.dayFormat);
    }
    return event.title;
  }
}
