import { Component } from "@angular/core";
import { BaseComponent } from '../base.component';

@Component({
  selector: "tabs",
  templateUrl: "tabs.component.html",
  styleUrls: ["tabs.component.scss"]
})
export class TabsComponent extends BaseComponent {
  // selected index
  selectedIndex = 0

  ngOnInit() {
    super.ngOnInit();
    // subscript to event
		this.onEvent = this.event.onEvent.subscribe(event => this.eventHandler(event));
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // remove the pagination control
    document.getElementsByClassName('mat-tab-header-pagination-before')[0].remove();
    document.getElementsByClassName('mat-tab-header-pagination-after')[0].remove();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
		this.onEvent.unsubscribe();
  }

  eventHandler(event) {
    if (event && event.name == 'open-tab') {
      // find the tab
      let tab = this.uiElement.screens.find(x => x.key == event.key)
      if(tab) {
        this.selectedIndex = this.uiElement.screens.indexOf(tab)
      }
		}
  }

}
