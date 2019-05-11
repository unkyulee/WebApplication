import {
  Component,
  OnInit,
  OnDestroy
} from "@angular/core";
import { EventService } from "../../services/event.service";
import { Subscription, Subject } from "rxjs";
import * as obj from "object-path";
import { ConfigService } from "../../services/config.service";
import { NavService } from "../../services/nav.service";
import { UIService } from 'src/app/services/ui.service';


@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit, OnDestroy {
  constructor(
    private event: EventService,
    public config: ConfigService,
    private nav: NavService,
    public uis: UIService
  ) {}

  // toolbar title
  title: string;

  // isTopNavigation
  isTopNav: boolean = true;

  // showLoadingBar
  showLoadingBar: boolean = false;

  //
  actions: any[]
  data: any

  //
  onEvent: Subscription;
  ngOnInit() {
    // load global actions
    this.actions = obj.get(this.config.configuration, "toolbar.actions")

    // handle events
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "navigation-changed") {
        //
        if (this.nav.currNav) {
          this.title = this.nav.currNav.name;

          // top or sub nav
          this.nav.currNav.type == 'sub' ? this.isTopNav = false : this.isTopNav = true;
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

  condition(uiElement) {
    let result = true;
    if (uiElement && uiElement.condition) {
      try {
        result = eval(uiElement.condition);
      } catch (e) {
        console.error(uiElement.condition, e);
        result = false;
      }
    }
    return result;
  }
}
