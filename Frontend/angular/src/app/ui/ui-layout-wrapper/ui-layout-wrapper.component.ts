import { Component, ComponentFactoryResolver, ViewContainerRef, Renderer2 } from "@angular/core";
import * as obj from "object-path";

// UI components
import { InputComponent } from "../input/input.component";
import { SelectionComponent } from "../selection/selection.component";
import { UploaderComponent } from "../uploader/uploader.component";
import { ButtonComponent } from "../button/button.component";
import { SignatureComponent } from "../signature/signature.component";
import { TypographyComponent } from "../typography/typography.component";
import { DataTableComponent } from "../data-table/data-table.component";
import { FormGeneratorComponent } from "../form-generator/form-generator.component";
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";
import { UILayoutComponent } from "../ui-layout/ui-layout.component";
import { DividerComponent } from "../divider/divider.component";
import { DataSheetComponent } from "../data-sheet/data-sheet.component";
import { PopupMenuComponent } from "../popup-menu/popup-menu.component";
import { CodeEditorComponent } from "../code-editor/code-editor.component";
import { TreeComponent } from "../tree/tree.component";
import { BaseComponent } from "../base.component";

@Component({
  selector: "[ui-layout-wrapper]",
  template: ``
  //, styles: [`:host { display: contents; }`]
})
export class UILayoutWrapperComponent extends BaseComponent {
  constructor(
    private cfr: ComponentFactoryResolver,
    public viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {
    super();
  }
  componentRef: any;

  ngOnChanges() {
    // create component
    if (
      !this.componentRef &&
      this.uiElement &&
      this.condition(this.uiElement)
    ) {
      // if type is ui-element-id then load from the uiElement first
      if (this.uiElement.type == "ui-element-id") {
        let element = obj.get(
          this.config.get("uiElements"),
          this.uiElement.uiElementId
        );
        element = JSON.parse(JSON.stringify(element));
        this.uiElement = Object.assign({}, this.uiElement, element);
        // run init script
        if (this.uiElement.uiElementInit) {
          try {
            eval(this.uiElement.uiElementInit);
          } catch (e) {
            console.error(e);
          }
        }
      }

      // find the component
      let componentFactory = this.findComponentFactory(this.uiElement.type);

      // create the component
      this.componentRef = this.viewContainerRef.createComponent(
        componentFactory
      );
    }

    // apply changes
    if (this.componentRef) {      
      this.componentRef.instance.uiElement = this.uiElement;
      this.componentRef.instance.data = this.data;

      // apply layout style
      if (this.uiElement.layoutStyle) {
        for (let key of Object.keys(this.uiElement.layoutStyle)) {
          this.renderer.setStyle(
            this.componentRef.location.nativeElement,
            key,
            this.uiElement.layoutStyle[key]
          );
        }
      }

      // apply layout class
      if (this.uiElement.layoutClass) {
        for (let key of Object.keys(this.uiElement.layoutClass)) {
          this.renderer.addClass(this.componentRef.location.nativeElement, key);
        }
      }
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.componentRef) this.componentRef.destroy();
  }

  findComponentFactory(type) {
    let componentFactory = null;
    switch (type) {
      case "tree":
        componentFactory = this.cfr.resolveComponentFactory(TreeComponent);
        break;
      case "code-editor":
        componentFactory = this.cfr.resolveComponentFactory(
          CodeEditorComponent
        );
        break;
      case "popup-menu":
        componentFactory = this.cfr.resolveComponentFactory(PopupMenuComponent);
        break;
      case "data-sheet":
        componentFactory = this.cfr.resolveComponentFactory(DataSheetComponent);
        break;
      case "div":
      case "layout":
        componentFactory = this.cfr.resolveComponentFactory(UILayoutComponent);
        break;
      case "divider":
        componentFactory = this.cfr.resolveComponentFactory(DividerComponent);              
        break;
      case "progress-bar":
        componentFactory = this.cfr.resolveComponentFactory(
          ProgressBarComponent
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
      case "selection":
        componentFactory = this.cfr.resolveComponentFactory(SelectionComponent);
        break;
      case "input":
      default:
        componentFactory = this.cfr.resolveComponentFactory(InputComponent);
    }

    return componentFactory;
  }

}
