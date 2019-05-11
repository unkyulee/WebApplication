import { Component, OnInit, OnDestroy } from "@angular/core";
import * as obj from "object-path";
import { Subscription, Observable } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";

// user imports
import { ConfigService } from "../../services/config.service";
import { EventService } from "../../services/event.service";
import { UIService } from "../../services/ui.service";
import { NavService } from "../../services/nav.service";

@Component({
  selector: "ui-composer",
  templateUrl: "./ui-composer.component.html"
})
export class UIComposerComponent implements OnInit, OnDestroy {
  constructor(
    private breakpointObserver: BreakpointObserver,
    public config: ConfigService,
    private event: EventService,
    private uis: UIService,
    private nav: NavService
  ) {}

  // detect window size changes
  isHandset: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        this.isHandset = result.matches;
        return result.matches;
      })
    );

  // where source of truth for the screen
  data: any = {};

  onEvent: Subscription;
  ngOnInit() {
    //
    this.isHandset$.subscribe(r => (this.isHandset = r));

    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(event => this.eventHandler(event));
  }

  eventHandler(event) {
    if (event.name == "navigation-changed") {
      // reset data
      this.data = {
        _params_: this.nav.getParams()
      };

      // load UI when navigation changes
      if (this.nav.currNav) {
        // check if there are any replication setup
        if(this.nav.currNav.onLoad) {
          try {
            eval(this.nav.currNav.onLoad)
          } catch(e) {
            console.error(e)
          }
        }
        this.loadUI(this.nav.currNav.uiElementIds);
      }

    } else if (event.name == "ui-updated") {
      // load UI when navigation changes
      if (this.nav.currNav) this.loadUI(this.nav.currNav.uiElementIds);
    }
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  uiElements: any[];
  loadUI(uiElements) {
    // load ui
    let ui = [];
    for (let id of uiElements) {
      let element = obj.get(this.uis.uiElements, id);
      if (element) ui.push(element);
    }
    this.uiElements = JSON.parse(JSON.stringify(ui));
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
