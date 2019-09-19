import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import * as obj from "object-path";

// user imports
import { NavService } from "../../../services/nav.service";
import { ConfigService } from "../../../services/config.service";
import { EventService } from "../../../services/event.service";
import { UserService } from "../../../services/user/user.service";
import { BaseComponent } from 'src/app/ui/base.component';

@Component({
  selector: "nav-vertical",
  templateUrl: "./nav-vertical.component.html",
  styleUrls: ["./nav-vertical.component.scss"]
})
export class NavVerticalComponent extends BaseComponent {
  constructor(
    public event: EventService,
    public nav: NavService,
    public user: UserService,
    public config: ConfigService
  ) { super() }

  data: any;
  currUrl: string;
  onEvent: Subscription;
  ngOnInit() {
    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "navigation-changed")
        if (event.data.router) this.currUrl = event.data.router.url;
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  /**
   * Check if the given url can be found
   * in one of the given parent's children
   *
   * @param parent
   * @param url
   * @returns {any}
   */
  isUrlInChildren(parent, url) {
    if (url) {
      if (!parent.children) return false;

      for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].children)
          if (this.isUrlInChildren(parent.children[i], url)) return true;

        if (
          parent.children[i].url === url ||
          url.includes(parent.children[i].url)
        )
          return true;
      }
    }

    return false;
  }

  click() {}
}
