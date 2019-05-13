import {
  Component,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  Renderer2
} from "@angular/core";

import { InputComponent } from "../input/input.component";
import { SelectionComponent } from "../selection/selection.component";
import { AutoCompleteComponent } from "../autocomplete/autocomplete.component";
import { UploaderComponent } from "../uploader/uploader.component";
import { ButtonComponent } from "../button/button.component";
import { SignatureComponent } from "../signature/signature.component";
import { TypographyComponent } from "../typography/typography.component";
import { DataTableComponent } from "../data-table/data-table.component";
import { FormGeneratorComponent } from "../form-generator/form-generator.component";
import { FilterGroupComponent } from "../filter/filter-group.component";
import { CalendarComponent } from "../calendar/calendar.component";
import { ProgressBarComponent } from "@swimlane/ngx-datatable";
import { ScriptBoxComponent } from "../script-box/script-box.component";
import { UILayoutComponent } from '../ui-layout/ui-layout.component';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: "[ui-layout-wrapper]",
  template: ``
  //, styles: [`:host { display: contents; }`]
})
export class UILayoutWrapperComponent {
  constructor(
    public viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private renderer: Renderer2
  ) {
  }

  @Input() uiElement: any;
  @Input() data: any;

  ngOnInit() {
    if (this.uiElement && this.condition(this.uiElement)) {
      // find the component
      let componentFactory = this.findComponentFactory(this.uiElement.type);

      // create the component
      let componentRef: any = this.viewContainerRef.createComponent(
        componentFactory
      );

      // configure the component
      componentRef.instance.uiElement = this.uiElement;
      componentRef.instance.data = this.data;

      // apply layout style
      if (this.uiElement.layoutStyle) {
        for (let key of Object.keys(this.uiElement.layoutStyle)) {
          this.renderer.setStyle(
            componentRef.location.nativeElement,
            key,
            this.uiElement.layoutStyle[key]
          );
        }
      }

      // apply layout class
      if (this.uiElement.layoutClass) {
        for (let key of Object.keys(this.uiElement.layoutClass)) {
          this.renderer.addClass(
            componentRef.location.nativeElement,
            key
          );
        }
      }

    }
  }

  findComponentFactory(type) {
    let componentFactory = null;
    switch (type) {
      case "div":
      case "layout":
        componentFactory = this.cfr.resolveComponentFactory(UILayoutComponent);
        break;
      case "divider":
        componentFactory = this.cfr.resolveComponentFactory(DividerComponent);
        break;
      case "script-box":
        componentFactory = this.cfr.resolveComponentFactory(ScriptBoxComponent);
        break;
      case "progress-bar":
        componentFactory = this.cfr.resolveComponentFactory(
          ProgressBarComponent
        );
        break;
      case "calendar":
        componentFactory = this.cfr.resolveComponentFactory(CalendarComponent);
        break;
      case "filter-group":
        componentFactory = this.cfr.resolveComponentFactory(
          FilterGroupComponent
        );
        break;
      case "form-generator":
        componentFactory = this.cfr.resolveComponentFactory(
          FormGeneratorComponent
        );
        break;
      case "data-table":
        componentFactory = this.cfr.resolveComponentFactory(DataTableComponent);
        break;
      case "typography":
        componentFactory = this.cfr.resolveComponentFactory(
          TypographyComponent
        );
        break;
      case "signature":
        componentFactory = this.cfr.resolveComponentFactory(SignatureComponent);
        break;
      case "button":
        componentFactory = this.cfr.resolveComponentFactory(ButtonComponent);
        break;
      case "uploader":
        componentFactory = this.cfr.resolveComponentFactory(UploaderComponent);
        break;
      case "autocomplete":
        componentFactory = this.cfr.resolveComponentFactory(
          AutoCompleteComponent
        );
        break;
      case "selection":
        componentFactory = this.cfr.resolveComponentFactory(SelectionComponent);
        break;
      case "input":
      default:
        componentFactory = this.cfr.resolveComponentFactory(InputComponent);
    }

    return componentFactory;
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
