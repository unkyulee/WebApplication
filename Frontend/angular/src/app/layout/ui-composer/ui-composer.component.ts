import { Component, OnInit, OnDestroy } from "@angular/core";
import * as obj from "object-path";
import { Subscription, Observable } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";

// user imports
import { ConfigService } from "../../services/config.service";
import { EventService } from "../../services/event.service";
import { NavService } from "../../services/nav.service";
import { BaseComponent } from "src/app/ui/base.component";
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: "ui-composer",
  templateUrl: "./ui-composer.component.html"
})
export class UIComposerComponent extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    private breakpointObserver: BreakpointObserver,
    public config: ConfigService,
    private event: EventService,
    private nav: NavService,
    public user: UserService
  ) {
    super();
  }

  // where source of truth for the screen
  data: any = {};

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

  onEvent: Subscription;
  ngOnInit() {
    //
    this.isHandset$.subscribe(r => (this.isHandset = r));

    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );
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
        if (this.nav.currNav.onLoad) {
          try {
            eval(this.nav.currNav.onLoad);
          } catch (e) {
            console.error(e);
          }
        }
        this.loadUI(this.nav.currNav.uiElementIds);
      }
    } else if (event.name == "ui-updated") {
      // load UI when navigation changes
      if (this.nav.currNav) this.loadUI(this.nav.currNav.uiElementIds);
      // send refresh event after some time so that the screen gets cleared
      setTimeout(() => {
        this.event.send({ name: "refresh" });
      }, 5000);
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
      let element = obj.get(this.config.get('uiElements'), id);
      if (element) ui.push(element);
    }
    this.uiElements = [...ui];
  }
}
