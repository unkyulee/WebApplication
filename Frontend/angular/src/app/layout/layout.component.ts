import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2
} from "@angular/core";

import { MatSidenav, MatDialog, MatBottomSheet } from "@angular/material";
import * as obj from "object-path";

// user component
import { BaseComponent } from "../ui/base.component";
import { UIComposerDialogComponent } from "./ui-composer-dialog/ui-composer-dialog.component";
import { UIComposerActionsComponent } from "./ui-composer-actions/ui-composer-actions.component";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "layout",
  templateUrl: "./layout.component.html"
})
export class LayoutComponent extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private elementRef: ElementRef,
    private ref: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    super();
  }

  // drawer
  @ViewChild("drawer") drawer: MatSidenav;

  ngOnInit() {
    super.ngOnInit();
    // is authenticated?
    this.auth.isAuthenticated();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // back button handler
    this.elementRef.nativeElement.ownerDocument.addEventListener(
      "backbutton",
      this.onBackButton.bind(this)
    );

    // expose event service to window.__CONFIG__
    obj.set(window, "__CONFIG__.event", this.event);

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => {
      console.log(event)
      if (event.name == "drawer-toggle") {
        this.drawer.toggle();
      } else if (event.name == "drawer-close") {
        this.drawer.close();
      } else if (event.name == "drawer-open") {
        this.drawer.open();
      } else if (event.name == "changed") {
        setTimeout(() => {
          this.cordova.detectChanges(this.ref);
        }, 100);
      } else if (event.name == "open-dialog") {
        setTimeout(() => this.openDialog(event), 0);
      } else if (event && event.name == "close-dialog") {
        if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0)
          this.dialog.openDialogs[this.dialog.openDialogs.length - 1].close();
        setTimeout(() => {
          this.cordova.detectChanges(this.ref);
        }, 100);
      } else if (event && event.name == "close-all-dialog") {
        if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0)
          for (let dialog of this.dialog.openDialogs) {
            dialog.close();
          }
        setTimeout(() => {
          this.cordova.detectChanges(this.ref);
        }, 100);
      } else if (event.name == "open-sheet") {
        setTimeout(() => this.openSheet(event), 0);
      } else if (event.name == "navigation-changed") {
        if (this.drawer) this.drawer.close();
        // scroll back to top when page changes
        try {
          document.getElementById("layout_main_content").scrollTop = 0;
        } catch {}
      } else if(event.name == "authenticated" || event.name == "logout") {
        this.auth.isAuthenticated()
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  onBackButton(e) {
    e.preventDefault();

    // close dialogs if any exists
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.openDialogs[this.dialog.openDialogs.length - 1].close();
    } else if (
      !obj.get(this.currSheet, "containerInstance._destroyed", false)
    ) {
      this.bottomSheet._openedBottomSheetRef.dismiss();
    }
    // check if it is last nav stack
    else if (this.nav.navigationStack.length == 2) {
      // if the drawer is not open then open the drawer
      if (this.drawer.opened == false) this.drawer.open();
      else {
        // if the drawer is still open then ask to close the app
        if (confirm("Do you want to exit the app?")) {
          this.cordova.navigator.app.exitApp();
        }
      }
    } else {
      this.nav.back();
    }
    this.event.send({ name: "changed" });
  }

  openDialog(event) {
    // get ui elements
    let uiElement = obj.get(this.config.get("uiElements"), event.uiElementId);
    uiElement = { ...uiElement };
    if (event.uiElement) uiElement = Object.assign(uiElement, event.uiElement);
    if (event.uiElementInit) {
      try {
        eval(event.uiElementInit);
      } catch (e) {
        console.error(e);
      }
    }

    // open dialog
    let currDialog = this.dialog.open(UIComposerDialogComponent, {
      height: event.height,
      minHeight: event.minHeight,
      maxHeight: event.maxHeight,
      width: event.width,
      minWidth: event.minWidth,
      maxWidth: event.maxWidth,
      panelClass:
        typeof event.panelClass == "undefined" ? "full-width-dialog" : null
    });
    currDialog.componentInstance.data = event.data ? event.data : {};
    currDialog.componentInstance.uiElement = uiElement;

    // apply layout style
    if (uiElement.layoutStyle) {
      for (let key of Object.keys(uiElement.layoutStyle)) {
        this.renderer.setStyle(
          currDialog["_containerInstance"]["_elementRef"].nativeElement,
          key,
          uiElement.layoutStyle[key]
        );
      }
    }

    // apply layout class
    if (uiElement.layoutClass) {
      for (let key of Object.keys(uiElement.layoutClass)) {
        this.renderer.addClass(
          currDialog["_containerInstance"]["_elementRef"].nativeElement,
          key
        );
      }
    }
  }

  currSheet;
  openSheet(event) {
    // get ui elements
    let uiElement = obj.get(this.config.get("uiElements"), event.uiElementId);
    if (!uiElement) {
      console.error(`${event.uiElementId} is missing`);
    } else {
      uiElement = JSON.parse(JSON.stringify(uiElement));

      this.currSheet = this.bottomSheet.open(UIComposerActionsComponent, {
        data: { data: event.data ? event.data : {}, uiElement: uiElement }
      });
    }
  }
}
