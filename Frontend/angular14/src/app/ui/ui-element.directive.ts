// @ts-nocheck
import { Directive, ViewContainerRef, Input } from "@angular/core";

// services
import { EventService } from "../services/event.service";
import { RestService } from "../services/rest.service";
import { NavService } from "../services/nav.service";
import { ConfigService } from "../services/config.service";
import { UtilService } from "../services/util.service";
import { AuthService } from "../services/auth/auth.service";
import { UIService } from "../services/ui.service";

// components
import { LayoutComponent } from "./layout/layout.component";
import { TypographyComponent } from "./typography/typography.component";
import { InputComponent } from "./input/input.component";
import { ButtonComponent } from "./button/button.component";
import { TableComponent } from "./table/table.component";
import { FormComponent } from "./form/form.component";
import { DateComponent } from "./date/date.component";
import { SelectionComponent } from "./selection/selection.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { IconComponent } from "./icon/icon.component";

@Directive({
  selector: "[ui-element]",
})
export class UIElement {
  // register component type
  component_registry = {
    layout: LayoutComponent,
    div: LayoutComponent,

    typography: TypographyComponent,
    input: InputComponent,
    button: ButtonComponent,
    table: TableComponent,
    form: FormComponent,
    date: DateComponent,
    selection: SelectionComponent,
    progress: ProgressBarComponent,
    icon: IconComponent,
  };
  componentRef;

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

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.uiElement) return;
    if (this.componentRef) this.componentRef.destroy();

    // preprocess ui-element-id type
    if (obj.get(this.uiElement, "type") == "ui-element-id") {
      //
      let element = await this.ui.get(this.uiElement.uiElementId);
      if (element) {
        //
        this.uiElement = Object.assign({}, this.uiElement, element);
      } else {
        console.error(
          `uiElement missing ${this.uiElement.uiElementId}`,
          this.uiElement
        );
      }
    }

    // create component based on the type
    const type = obj.get(
      this.component_registry,
      obj.get(this.uiElement, "type", "layout")
    );

    // if type exists then create the component
    if (type) {
      this.componentRef = this.viewContainerRef.createComponent(type);
      this.componentRef.instance.data = this.data;
      this.componentRef.instance.uiElement = this.uiElement;
    } else {
      throw `missing ui element registry: ${
        this.uiElement.type
      }${JSON.stringify(this.uiElement, null, 4)}`;
    }
  }

  ngOnDestroy() {
    if (this.componentRef) this.componentRef.destroy();
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
