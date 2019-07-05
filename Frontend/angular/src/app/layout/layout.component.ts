import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import {
  MatSidenav,
  MatDialog,
  MatBottomSheet,
  MatDialogRef
} from "@angular/material";
import * as obj from "object-path";

// user component
import { BaseComponent } from "../ui/base.component";
import { UIComposerDialogComponent } from "./ui-composer-dialog/ui-composer-dialog.component";
import { UIComposerActionsComponent } from "./ui-composer-actions/ui-composer-actions.component";

// user import
import { EventService } from "../services/event.service";
import { ConfigService } from "../services/config.service";
import { AuthService } from "../services/auth/auth.service";
import { UIService } from "../services/ui.service";
import { NavService } from "../services/nav.service";
import { CordovaService } from "../services/cordova.service";
import { UserService } from "../services/user/user.service";

// cordova
declare var navigator: any;

@Component({
  selector: "layout",
  templateUrl: "./layout.component.html"
})
export class LayoutComponent extends BaseComponent
  implements OnInit, OnDestroy {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private event: EventService,
    public config: ConfigService,
    private auth: AuthService,
    private ui: UIService,
    private elementRef: ElementRef,
    private nav: NavService,
    private cordova: CordovaService,
    private ref: ChangeDetectorRef,
    public user: UserService,
    private renderer: Renderer2
  ) {
    super();
  }

  // detect window size changes
  isHandset: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.Tablet])
    .pipe(
      map(result => {
        this.isHandset = result.matches;
        return result.matches;
      })
    );

  // receive events
  onEvent: Subscription;

  // authenticated status
  isAuthenticated: boolean;

  // drawer
  @ViewChild("drawer") drawer: MatSidenav;

  async ngOnInit() {
    // check if authenticated
    this.isAuthenticated = await this.auth.isAuthenticated();
  }

  onBackButton(e) {
    e.preventDefault();
    // close dialogs if any exists
    if (this.currDialog && this.dialog.openDialogs.length > 0) {
      this.currDialog.close();
    }
    // check if it is last nav stack
    else if (this.nav.navigationStack.length == 2) {
      // if the drawer is not open then open the drawer
      if (this.drawer.opened == false) this.drawer.open();
      else {
        // if the drawer is still open then ask to close the app
        if (confirm("Do you want to exit the app?")) {
          navigator.app.exitApp();
        }
      }
    } else {
      this.nav.back();
    }
    this.event.send({ name: "changed" });
  }

  ngAfterViewInit() {
    // back button handler
    this.elementRef.nativeElement.ownerDocument.addEventListener(
      "backbutton",
      this.onBackButton.bind(this)
    );

    // event handler
    this.onEvent = this.event.onEvent.subscribe(event => {
      if (event == "drawer-toggle") {
        this.drawer.toggle();
      } else if (event && event.name == "changed") {
        setTimeout(() => {
          this.cordova.detectChanges(this.ref);
        }, 100);
      } else if (event.name == "open-dialog") {
        setTimeout(() => this.openDialog(event), 0);
      } else if (event.name == "open-sheet") {
        setTimeout(() => this.openSheet(event), 0);
      } else if (event.name == "navigation-changed") {
        if (this.isHandset == true && this.drawer) this.drawer.close();
        // scroll back to top when page changes
        try {
          document.getElementById("layout_main_content").scrollTop = 0;
        } catch {}
      } else if (event == "logout") {
        this.isAuthenticated = false;
      } else if (event == "authenticated") {
        this.isAuthenticated = true;
      }
    });
  }

  ngOnDestroy() {
    this.onEvent.unsubscribe();
  }

  currDialog: MatDialogRef<UIComposerDialogComponent>;
  openDialog(event) {
    // do not open another dialog when there is already opened dialog
    if (this.currDialog && this.dialog.openDialogs.length != 0) return;

    // get ui elements
    let uiElement = obj.get(this.ui.uiElements, event.uiElementId);
    uiElement = JSON.parse(JSON.stringify(uiElement));

    // open dialog
    this.currDialog = this.dialog.open(UIComposerDialogComponent, {
      height: event.height,
      width: event.width,
      panelClass: "full-width-dialog"
    });
    this.currDialog.componentInstance.data = event.data ? event.data : {};
    this.currDialog.componentInstance.uiElement = uiElement;

    // apply layout style
    if (uiElement.layoutStyle) {
      for (let key of Object.keys(uiElement.layoutStyle)) {
        this.renderer.setStyle(
          this.currDialog["_containerInstance"]["_elementRef"].nativeElement,
          key,
          uiElement.layoutStyle[key]
        );
      }
    }

    // apply layout class
    if (uiElement.layoutClass) {
      for (let key of Object.keys(uiElement.layoutClass)) {
        this.renderer.addClass(
          this.currDialog["_containerInstance"]["_elementRef"].nativeElement,
          key
        );
      }
    }
  }

  openSheet(event) {
    // get ui elements
    let uiElement = obj.get(this.ui.uiElements, event.uiElementId);
    uiElement = JSON.parse(JSON.stringify(uiElement));

    let sheet = this.bottomSheet.open(UIComposerActionsComponent, {
      data: { data: event.data ? event.data : {}, uiElement: uiElement }
    });

    // apply layout style
    if (uiElement.layoutStyle) {
      for (let key of Object.keys(uiElement.layoutStyle)) {
        this.renderer.setStyle(
          sheet["_containerInstance"]["_elementRef"].nativeElement,
          key,
          uiElement.layoutStyle[key]
        );
      }
    }

    // apply layout class
    if (uiElement.layoutClass) {
      for (let key of Object.keys(uiElement.layoutClass)) {
        this.renderer.addClass(
          sheet["_containerInstance"]["_elementRef"].nativeElement,
          key
        );
      }
    }
  }
}
