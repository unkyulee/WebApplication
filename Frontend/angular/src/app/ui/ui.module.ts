import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

//
import { MaterialModule } from '../core/material.module';
import { PrimeNGModule } from '../core/primeng.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxPrintModule } from 'ngx-print';
import { MonacoEditorModule } from 'ngx-monaco-editor';

// validators
import { EvalValidator } from '../core/eval.validator';
import { JsonValidator } from '../core/json.validator';
import { AutofocusDirective } from '../core/autofocus';
import { SafePipe } from '../core/safe.pipe';

// user component
import { UILayoutWrapperComponent } from './ui-layout-wrapper/ui-layout-wrapper.component';
import { UILayoutComponent } from './ui-layout/ui-layout.component';
import { DataTableComponent } from './data-table/data-table.component';
import { InputComponent } from './input/input.component';
import { DateComponent } from './date/date.component';
import { SelectionComponent } from './selection/selection.component';
import { ButtonComponent } from './button/button.component';
import { SignatureComponent } from './signature/signature.component';
import { UploaderComponent } from './uploader/uploader.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TypographyComponent } from './typography/typography.component';
import { FormGeneratorComponent } from './form-generator/form-generator.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DividerComponent } from './divider/divider.component';
import { BaseComponent } from './base.component';
import { PopupMenuComponent } from './popup-menu/popup-menu.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { StepperComponent } from './stepper/stepper.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { TabsComponent } from './tabs/tabs.component';
import { EditorComponent } from './editor/editor.component';
import { ImageComponent } from './image/image.component';

// overlay
import { UIComposerComponent } from './ui-composer/ui-composer.component'
import { UIComposerActionsComponent } from './ui-composer-actions/ui-composer-actions.component'
import { UIComposerDialogComponent } from './ui-composer-dialog/ui-composer-dialog.component'

// calendar modules
import * as moment from 'moment';
import {
	CalendarModule as AngularCalendarModule,
	DateAdapter,
	CalendarDateFormatter,
	CalendarMomentDateFormatter,
	MOMENT,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { IconComponent } from './icon/icon.component';
export function momentAdapterFactory() {
	return adapterFactory(moment);
}

@NgModule({
	declarations: [
		SafePipe,
		UILayoutWrapperComponent,
		UILayoutComponent,
		EvalValidator,
		JsonValidator,
		AutofocusDirective,
		DataTableComponent,
		FormGeneratorComponent,
		InputComponent,
		DateComponent,
		SelectionComponent,
		UploaderComponent,
		ButtonComponent,
		SignatureComponent,
		PaginationComponent,
		TypographyComponent,
		ProgressBarComponent,
		DividerComponent,
		BaseComponent,
		PopupMenuComponent,
		CodeEditorComponent,
		CalendarComponent,
		SideNavComponent,
		StepperComponent,
		BarcodeComponent,
		TabsComponent,
		EditorComponent,
		IconComponent,
		ImageComponent,
		UIComposerComponent,
		UIComposerActionsComponent,
		UIComposerDialogComponent,
	],
	entryComponents: [
		UILayoutWrapperComponent,
		UILayoutComponent,
		DataTableComponent,
		FormGeneratorComponent,
		InputComponent,
		DateComponent,
		SelectionComponent,
		UploaderComponent,
		ButtonComponent,
		SignatureComponent,
		PaginationComponent,
		TypographyComponent,
		ProgressBarComponent,
		DividerComponent,
		BaseComponent,
		PopupMenuComponent,
		CodeEditorComponent,
		CalendarComponent,
		SideNavComponent,
		StepperComponent,
		BarcodeComponent,
		TabsComponent,
		EditorComponent,
		IconComponent,
		ImageComponent,
		UIComposerComponent,
		UIComposerActionsComponent,
		UIComposerDialogComponent,
	],
	exports: [
		UILayoutWrapperComponent,
		UILayoutComponent,
		DataTableComponent,
		FormGeneratorComponent,
		InputComponent,
		DateComponent,
		SelectionComponent,
		ButtonComponent,
		SignatureComponent,
		UploaderComponent,
		PaginationComponent,
		TypographyComponent,
		ProgressBarComponent,
		UILayoutComponent,
		DividerComponent,
		BaseComponent,
		PopupMenuComponent,
		CodeEditorComponent,
		CalendarComponent,
		SideNavComponent,
		StepperComponent,
		BarcodeComponent,
		TabsComponent,
		EditorComponent,
		IconComponent,
		ImageComponent,
		UIComposerComponent,
		UIComposerActionsComponent,
		UIComposerDialogComponent,
		MaterialModule,
		PrimeNGModule,
		FormsModule
	],
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		SignaturePadModule,
		FileUploadModule,
		ScrollingModule,
		MonacoEditorModule,
		AngularCalendarModule.forRoot(
			{
				provide: DateAdapter,
				useFactory: momentAdapterFactory,
			},
			{
				dateFormatter: {
					provide: CalendarDateFormatter,
					useClass: CalendarMomentDateFormatter,
				},
			}
		),
		NgxBarcodeModule,
		NgxPrintModule,
		DragDropModule,
		PrimeNGModule
	],
	providers: [
		{
			provide: MOMENT,
			useValue: moment,
		},
	]
})
export class UIModule {}
