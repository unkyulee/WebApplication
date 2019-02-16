import { Component, Input } from "@angular/core";

@Component({
  selector: "calendar",
  templateUrl: "./calendar.component.html"
})
export class CalendarComponent {
  constructor() {}

  // configuration of the ui element
  @Input() uiElement: any;
  @Input() data: any;

  ngOnInit() {
    // setup calendary strategy
    this.data.calendarType = this.uiElement.calendarType;
  }
}
