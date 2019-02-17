import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { EventService } from "../../services/event.service";
import { Subscription, Subject } from "rxjs";
import * as obj from "object-path";
import { ConfigService } from "../../services/config.service";
import { NavService } from "../../services/nav.service";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit, OnDestroy {
  constructor(
    private event: EventService,
    private config: ConfigService,
    private nav: NavService
  ) {}

  // toolbar title
  title: string;

  // isTopNavigation
  isTopNav: boolean = true;

  // showLoadingBar
  showLoadingBar: boolean = false;

  //
  action: any;

  //
  onEvent: Subscription;
  ngOnInit() {
    // handle events
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "navigation-changed") {
        //
        if (this.nav.currNav) this.title = this.nav.currNav.name;
        // reset to top navigation
        this.isTopNav = true;
        //
        this.action = null;
      } else if (event == "sub-navigation") {
        //
        this.isTopNav = false;
      } else if (event == "splash-show") {
        this.showLoadingBar = true;
      } else if (event == "splash-hide") {
        this.showLoadingBar = false;
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  drawerToggle() {
    this.event.send("drawer-toggle");
  }

  back() {
    //
    this.nav.back();
  }

  refresh() {
    this.event.send({ name: "refresh" });
  }
}
