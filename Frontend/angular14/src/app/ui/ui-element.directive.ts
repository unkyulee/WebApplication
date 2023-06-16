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
import { ButtonComponent } from "./button/button.component";
import { CodeComponent } from "./code/code.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { DateComponent } from "./date/date.component";
import { DropGroupComponent } from "./drop-group/drop-group.component";
import { EditorComponent } from "./editor/editor.component";
import { FormComponent } from "./form/form.component";
import { GridComponent } from "./grid/grid.component";
import { IconComponent } from "./icon/icon.component";
import { ImageComponent } from "./image/image.component";
import { InputComponent } from "./input/input.component";
import { LayoutComponent } from "./layout/layout.component";
import { MenuComponent } from "./menu/menu.component";
import { ProgressComponent } from "./progress/progress.component";
import { SelectionComponent } from "./selection/selection.component";
import { TableComponent } from "./table/table.component";
import { TreeComponent } from "./tree/tree.component";
import { TypographyComponent } from "./typography/typography.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { ChartComponent } from "./chart/chart.component";

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
    calendar: CalendarComponent,
    code: CodeComponent,
    chart: ChartComponent,
    date: DateComponent,
    dropgroup: DropGroupComponent,
    editor: EditorComponent,
    form: FormComponent,
    grid: GridComponent,
    icon: IconComponent,
    image: ImageComponent,
    menu: MenuComponent,
    progress: ProgressComponent,
    selection: SelectionComponent,
    table: TableComponent,
    tree: TreeComponent,
    uploader: UploaderComponent,
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
        let parentElement = { ...this.uiElement };
        delete parentElement.type;

        this.uiElement = Object.assign({}, element, parentElement);
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
