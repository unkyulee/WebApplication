import { Component } from "@angular/core";
import obj from 'object-path';

// user imports
import { BaseComponent } from 'src/app/ui/base.component';

@Component({
  selector: "nav-vertical",
  templateUrl: "./nav-vertical.component.html",
  styleUrls: ["./nav-vertical.component.scss"]
})
export class NavVerticalComponent extends BaseComponent {
  currUrl: string;
  ngOnInit() {
    // detect configuration changes
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event.name == "navigation-changed") {
        this.currUrl = obj.get(event, "data.url");
      }
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
}
