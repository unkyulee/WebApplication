// @ts-nocheck
import { Directive, ViewContainerRef, Input } from "@angular/core";

// services
import { EventService } from "../../services/event.service";
import { RestService } from "../../services/rest.service";
import { NavService } from "../../services/nav.service";
import { ConfigService } from "../../services/config.service";
import { UtilService } from "../../services/util.service";
import { AuthService } from "../../services/auth/auth.service";
import { UIService } from "../../services/ui.service";

// components
import { LayoutComponent } from "../layout/layout.component";
import { TypographyComponent } from "../typography/typography.component";
import { InputComponent } from "../input/input.component";
import { ButtonComponent } from "../button/button.component";

@Directive({
  selector: "[ui-element]",
})
export class UIElement {
  @Input() uiElement: any;
  @Input() data: any;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public event: EventService,
    public rest: RestService,
    public nav: NavService,
    public config: ConfigService,
    public ui: UIService,
    public util: UtilService,
    public auth: AuthService
  ) {}

  // register component type
  component_registry = {
    layout: LayoutComponent,
    typography: TypographyComponent,
    input: InputComponent,
    button: ButtonComponent,
  };

  componentRef;
  async ngOnInit() {
    // create component based on the type
    const type = obj.get(
      this.component_registry,
      obj.get(this.uiElement, "type", "")
    );

    // if type exists then create the component
    if (type) {
      this.componentRef = this.viewContainerRef.createComponent(type);
      this.componentRef.instance.data = this.data;
      this.componentRef.instance.uiElement = this.uiElement;
    } else {
      console.error(`missing ui element registry: ${this.uiElement.type}`);
    }
  }

  ngOnDestroy() {
    if (this.componentRef) this.componentRef.destroy();
  }
}
