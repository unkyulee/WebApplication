import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";

// user Imports
import { ConfigService } from "src/app/services/config.service";
import { UserService } from "src/app/services/user/user.service";
import { EventService } from "src/app/services/event.service";
import { RestService } from "src/app/services/rest.service";
import { DBService } from "src/app/services/db/db.service";
import { NavService } from "src/app/services/nav.service";
import { BaseComponent } from "../base.component";

@Component({
  selector: "tree",
  templateUrl: "tree.component.html"
})
export class TreeComponent extends BaseComponent {
  constructor(
    public config: ConfigService,
    public user: UserService,
    public event: EventService,
    public rest: RestService,
    public router: Router,
    public db: DBService,
    public nav: NavService
  ) {
    super();
  }

  @Input() uiElement: any;
  @Input() data: any;

  treeControl = new NestedTreeControl<any>(node => node.children);
  hasChild = (_: number, node: any) =>
    !!node.children && node.children.length > 0;
  ///
  tree;

  // event subscription
  onEvent: Subscription;

  ngOnInit() {
    // initialize the data
    this.tree = new MatTreeNestedDataSource<any>();
    if (!this.uiElement.key) this.uiElement.key = "tree";

    if (this.data && this.uiElement.key) {
      if (this.tree.data != this.data[this.uiElement.key]) {
        this.tree.data = this.data[this.uiElement.key];
      }
      this.tree.data = this.data[this.uiElement.key];
    }

    // if null then assign default
    if (
      (typeof this.tree.data == "undefined" || this.tree.data == null) &&
      this.uiElement.default
    ) {
      this.tree.data = this.uiElement.default;
      try {
        this.tree.data = eval(this.uiElement.default);
      } catch (e) {}

      this.data[this.uiElement.key] = this.tree.data
    }

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event =>
      this.eventHandler(event)
    );

    // run script
    if (this.uiElement.init) {
      try {
        eval(this.uiElement.init);
      } catch (e) {
        console.error(e);
      }
    }
  }

  eventHandler(event) {
    if (this.uiElement.eventHandler) {
      try {
        eval(this.uiElement.eventHandler);
      } catch (e) {
        console.error(e);
      }
    }
  }

  ngOnDestroy() {
    // run destroy
    if (this.uiElement.destroy) {
      try {
        eval(this.uiElement.destroy);
      } catch (e) {
        console.error(e);
      }
    }

    this.onEvent.unsubscribe();
  }
}
