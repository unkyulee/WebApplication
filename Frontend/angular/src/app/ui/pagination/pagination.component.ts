import { Component, Input } from "@angular/core";

// user imports
import { NavService } from "../../services/nav.service";
import { EventService } from "src/app/services/event.service";
import { ConfigService } from "src/app/services/config.service";

@Component({
  selector: "pagination",
  templateUrl: "./pagination.component.html"
})
export class PaginationComponent {
  // Init
  constructor(
    private event: EventService,
    public config: ConfigService
  ) {}

  // pagination
  @Input() key: any;
  @Input() total: any;
  @Input() size: any;
  @Input() page: any;

  ngOnInit() {
    // default page is 1
    this.page = this.page || 1;

    // if the page size is determined in the url then use that otherwise use the one from the uiElement
    this.size = this.size || 10;
  }

  changePage(event) {
    this.event.send({
      name: "pagination",
      key: this.key,
      page: event.pageIndex + 1,
      size: event.pageSize
    });
  }
}
