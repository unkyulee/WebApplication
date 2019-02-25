import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { MatSidenav, MatDialog, MatBottomSheet } from "@angular/material";
import * as obj from "object-path";

// user import
import { EventService } from "../services/event.service";
import { ConfigService } from "../services/config.service";
import { AuthService } from "../services/auth/auth.service";
import { UIService } from "../services/ui.service";
import { UIComposerOverlayComponent } from "./ui-composer-overlay/ui-composer-overlay.component";
import { UIComposerActionsComponent } from "./ui-composer-actions/ui-composer-actions.component";

// cordova
declare var navigator: any;

@Component({
  selector: "layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"]
})
export class LayoutComponent implements OnInit, OnDestroy {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private event: EventService,
    public config: ConfigService,
    private auth: AuthService,
    private ui: UIService,
    private elementRef: ElementRef
  ) {}

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
    if (confirm("Do you want to exit the app?")) navigator.app.exitApp();
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

  openDialog(event) {
    // get ui elements
    let uiElement = obj.get(this.ui.uiElements, event.uiElementId);
    uiElement = JSON.parse(JSON.stringify(uiElement));

    // open dialog
    let dlg = this.dialog.open(UIComposerOverlayComponent, {
      height: event.height,
      width: event.width,
      panelClass: "full-width-dialog"
    });
    dlg.componentInstance.data = event.data ? event.data : {};
    dlg.componentInstance.uiElement = uiElement;
  }

  openSheet(event) {
    // get ui elements
    let uiElement = obj.get(this.ui.uiElements, event.uiElementId);
    uiElement = JSON.parse(JSON.stringify(uiElement));

    let sheet = this.bottomSheet.open(UIComposerActionsComponent, {
      data: { data: event.data ? event.data : {}, uiElement: uiElement }
    });
  }
}
