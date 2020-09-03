import { Component, ComponentFactoryResolver, ViewContainerRef, Renderer2, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppInjector } from 'src/app/app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as obj from "object-path"

// services
import { EventService } from 'src/app/services/event.service';
import { RestService } from 'src/app/services/rest.service';
import { NavService } from 'src/app/services/nav.service';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user/user.service';
import { DBService } from 'src/app/services/db/db.service';
import { UtilService } from 'src/app/services/util.service';
import { CordovaService } from 'src/app/services/cordova.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UIService } from 'src/app/services/ui.service';
import { PermissionService } from 'src/app/services/permission.service';

// UI components
import { InputComponent } from '../input/input.component';
import { SelectionComponent } from '../selection/selection.component';
import { UploaderComponent } from '../uploader/uploader.component';
import { ButtonComponent } from '../button/button.component';
import { SignatureComponent } from '../signature/signature.component';
import { TypographyComponent } from '../typography/typography.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { UILayoutComponent } from '../ui-layout/ui-layout.component';
import { DividerComponent } from '../divider/divider.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { TreeComponent } from '../tree/tree.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { StepperComponent } from '../stepper/stepper.component';
import { BarcodeComponent } from '../barcode/barcode.component';
import { TabsComponent } from '../tabs/tabs.component';
import { EditorComponent } from '../editor/editor.component';
import { IconComponent } from '../icon/icon.component';
import { ImageComponent } from '../image/image.component';

@Component({
	selector: '[ui-layout-wrapper]',
	template: ``,
})
export class UILayoutWrapperComponent {
	constructor(
		private cfr: ComponentFactoryResolver,
		public viewContainerRef: ViewContainerRef,
		private renderer: Renderer2
	) {
		// dependency injection
		this.event = AppInjector.get(EventService);
		this.rest = AppInjector.get(RestService);
		this.nav = AppInjector.get(NavService);
		this.config = AppInjector.get(ConfigService);
		this.user = AppInjector.get(UserService);
		this.db = AppInjector.get(DBService);
		this.router = AppInjector.get(Router);
		this.snackBar = AppInjector.get(MatSnackBar);
		this.cordova = AppInjector.get(CordovaService);
		this.auth = AppInjector.get(AuthService);
		this.ui = AppInjector.get(UIService);
		this.permission = AppInjector.get(PermissionService);
		this.util = AppInjector.get(UtilService);
	}

	// global services
	public event: EventService;
	public rest: RestService;
	public nav: NavService;
	public config: ConfigService;
	public user: UserService;
	public db: DBService;
	public router: Router;
	public snackBar: MatSnackBar;
	public cordova: CordovaService;
	public auth: AuthService;
	public ui: UIService;
	public permission: PermissionService;
	public util: UtilService;

	componentRef: any;

	// configuration of the ui element
	@Input() uiElement: any;
	@Input() data: any;

	async ngOnChanges(changes: SimpleChanges) {
		// create component
		if (!this.componentRef && this.uiElement && this.condition(this.uiElement) && !changes.data.previousValue) {
			// if type is ui-element-id then load from the uiElement first
			if (this.uiElement.type == 'ui-element-id') {
				let element = await this.ui.get(this.uiElement.uiElementId);
				if (element) {
					element = JSON.parse(JSON.stringify(element));
					this.uiElement = Object.assign({ _processed: true }, this.uiElement, element);
					// run init script
					if (this.uiElement.uiElementInit) {
						try {
							eval(this.uiElement.uiElementInit);
						} catch (e) {
							console.error(e);
						}
					}
				} else {
					console.error(`uiElement missing ${this.uiElement.uiElementId}`);
				}
			}

			// init
			if (obj.has(this, 'uiElement.init')) {
				try {
					await eval(this.uiElement.init);
				} catch (e) {
					console.error(e);
				}
			}

			// find the component
			let componentFactory = this.findComponentFactory(this.uiElement.type);

			// create the component
			this.componentRef = this.viewContainerRef.createComponent(componentFactory);
		}

		// apply changes
		if (this.componentRef) {
			this.componentRef.instance.uiElement = JSON.parse(JSON.stringify(this.uiElement));
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
			case 'image':
				componentFactory = this.cfr.resolveComponentFactory(ImageComponent);
				break;
			case 'icon':
				componentFactory = this.cfr.resolveComponentFactory(IconComponent);
				break;
			case 'editor':
				componentFactory = this.cfr.resolveComponentFactory(EditorComponent);
				break;
			case 'tabs':
				componentFactory = this.cfr.resolveComponentFactory(TabsComponent);
				break;
			case 'barcode':
				componentFactory = this.cfr.resolveComponentFactory(BarcodeComponent);
				break;
			case 'stepper':
				componentFactory = this.cfr.resolveComponentFactory(StepperComponent);
				break;
			case 'side-nav':
				componentFactory = this.cfr.resolveComponentFactory(SideNavComponent);
				break;
			case 'calendar':
				componentFactory = this.cfr.resolveComponentFactory(CalendarComponent);
				break;
			case 'tree':
				componentFactory = this.cfr.resolveComponentFactory(TreeComponent);
				break;
			case 'code-editor':
				componentFactory = this.cfr.resolveComponentFactory(CodeEditorComponent);
				break;
			case 'popup-menu':
				componentFactory = this.cfr.resolveComponentFactory(PopupMenuComponent);
				break;
			case 'div':
			case 'layout':
				componentFactory = this.cfr.resolveComponentFactory(UILayoutComponent);
				break;
			case 'divider':
				componentFactory = this.cfr.resolveComponentFactory(DividerComponent);
				break;
			case 'progress-bar':
			case 'progress':
				componentFactory = this.cfr.resolveComponentFactory(ProgressBarComponent);
				break;
			case 'form-generator':
				componentFactory = this.cfr.resolveComponentFactory(FormGeneratorComponent);
				break;
			case 'data-table':
				componentFactory = this.cfr.resolveComponentFactory(DataTableComponent);
				break;
			case 'typography':
				componentFactory = this.cfr.resolveComponentFactory(TypographyComponent);
				break;
			case 'signature':
				componentFactory = this.cfr.resolveComponentFactory(SignatureComponent);
				break;
			case 'button':
				componentFactory = this.cfr.resolveComponentFactory(ButtonComponent);
				break;
			case 'uploader':
				componentFactory = this.cfr.resolveComponentFactory(UploaderComponent);
				break;
			case 'selection':
				componentFactory = this.cfr.resolveComponentFactory(SelectionComponent);
				break;
			case 'input':
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
