// @ts-nocheck
import { Component, Input } from "@angular/core";

// user imports
import { BaseComponent } from "../../base.component";

@Component({
  selector: "pagination",
  templateUrl: "./pagination.component.html",
})
export class PaginationComponent extends BaseComponent {
  // pagination
  @Input() key: any;
  @Input() total: any;
  @Input() size: any;
  @Input() page: any;

  ngOnInit() {
    super.ngOnInit();
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
      size: event.pageSize,
    });
  }
}
