import { Component, OnInit, OnDestroy } from "@angular/core";
import { EventService } from "../../services/event.service";
import { Subscription, Subject } from "rxjs";

// user services
import { ConfigService } from "../../services/config.service";
import { NavService } from "../../services/nav.service";
import { UIService } from "src/app/services/ui.service";
import { BaseComponent } from "src/app/ui/base.component";

@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    public event: EventService,
    public config: ConfigService,
    public nav: NavService,
    public uis: UIService
  ) {
    super()
  }

  // toolbar title
  title: string;

  // isTopNavigation
  isTopNav: boolean = true;

  // showLoadingBar
  showLoadingBar: boolean = false;

  //
  actions: any[];
  data: any;

  //
  onEvent: Subscription;
  ngOnInit() {
    // load global actions
    this.actions = this.config.get("toolbar.actions");

    // handle events
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "navigation-changed") {
        //
        if (this.nav.currNav) {
          this.title = this.nav.currNav.name;

          // top or sub nav
          this.nav.currNav.type == "sub"
            ? (this.isTopNav = false)
            : (this.isTopNav = true);
        }
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
}
