import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import obj from 'object-path';

// user component
import { BaseComponent } from '../ui/base.component';
import { UIComposerDialogComponent } from '../ui/ui-composer-dialog/ui-composer-dialog.component';
import { UIComposerActionsComponent } from '../ui/ui-composer-actions/ui-composer-actions.component';

@Component({
	selector: 'layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends BaseComponent implements OnInit, OnDestroy {
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
	@ViewChild('drawer') drawer: MatSidenav;

	ngOnInit() {
		super.ngOnInit();
		// is authenticated?
		this.auth.isAuthenticated();
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();

		// back button handler
		this.elementRef.nativeElement.ownerDocument.addEventListener('backbutton', this.onBackButton.bind(this));

		// event handler
		this.onEvent = this.event.onEvent.subscribe(async (event) => {
			switch (event.name) {
				case 'drawer-toggle':
					this.drawer.toggle();
					break;
				case 'drawer-close':
					this.drawer.close();
					break;
				case 'drawer-open':
					this.drawer.open();
					break;
				case 'changed':
					//
					// FORCE ZONE UPDATE ANGULAR
					//
					setTimeout(() => {
						this.cordova.detectChanges(this.ref);
					}, 100);
					break;
				case 'open-dialog':
					await this.openDialog(event);
					this.event.send({ name: 'changed' });
					break;
				case 'close-dialog':
					// close dialog
					if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) {
						obj.set(this.dialog.openDialogs[this.dialog.openDialogs.length - 1], 'componentInstance.data.closing', true)
						this.dialog.openDialogs[this.dialog.openDialogs.length - 1].close();
					}
					this.event.send({ name: 'changed' });
					break;
				case 'close-all-dialog':
					// close all dialog
					if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0)
						for (let dialog of this.dialog.openDialogs) {
							obj.set(dialog, 'componentInstance.data.closing', true)
							dialog.close();
						}
					this.event.send({ name: 'changed' });
					break;
				case 'open-sheet':
					this.openSheet(event);
					this.event.send({ name: 'changed' });
					break;
				case 'navigation-changed':
					// close drawer and scroll back to top when page changes
					if (this.drawer) this.drawer.close();
					try {
						document.getElementById('layout_main_content').scrollTop = 0;
					} catch {}
					break;
				case 'login-success':
					this.nav.loadNavigation();
					break;
			}
		});
	}

	ngOnDestroy() {
		super.ngOnDestroy();
	}

	onBackButton(e) {
		e.preventDefault();

		// close dialogs if any exists
		if (this.dialog.openDialogs.length > 0) {
			this.dialog.openDialogs[this.dialog.openDialogs.length - 1].close();
		} else if (!obj.get(this.currSheet, 'containerInstance._destroyed', false)) {
			this.bottomSheet._openedBottomSheetRef.dismiss();
		}
		// check if it is last nav stack
		else if (this.nav.navigationStack.length == 2) {
			// if the drawer is not open then open the drawer
			if (this.drawer.opened == false) this.drawer.open();
			else {
				// if the drawer is still open then ask to close the app
				if (confirm('Do you want to exit the app?')) {
					this.cordova.navigator.app.exitApp();
				}
			}
		} else {
			this.nav.back();
		}
		this.event.send({ name: 'changed' });
	}

	async openDialog(event) {
		// get ui elements
		let uiElement = event.uiElement;
		if(event.uiElementId) uiElement = await this.ui.get(event.uiElementId);
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
		let currDialog = this.dialog.open(UIComposerDialogComponent, event.option);
		currDialog.componentInstance.data = event.data ? event.data : {};
		currDialog.componentInstance.uiElement = uiElement;

		// apply layout style
		if (uiElement.layoutStyle) {
			for (let key of Object.keys(uiElement.layoutStyle)) {
				this.renderer.setStyle(
					currDialog['_containerInstance']['_elementRef'].nativeElement,
					key,
					uiElement.layoutStyle[key]
				);
			}
		}

		// apply layout class
		if (uiElement.layoutClass) {
			for (let key of Object.keys(uiElement.layoutClass)) {
				this.renderer.addClass(currDialog['_containerInstance']['_elementRef'].nativeElement, key);
			}
		}
	}

	currSheet;
	async openSheet(event) {
		// get ui elements
		let uiElement = await this.ui.get(event.uiElementId);
		if (!uiElement) {
			console.error(`${event.uiElementId} is missing`);
		} else {
			uiElement = JSON.parse(JSON.stringify(uiElement));

			let data = { data: event.data ? event.data : {}, uiElement: uiElement, event: event.event };
			this.currSheet = this.bottomSheet.open(UIComposerActionsComponent, { data });
		}
	}
}
