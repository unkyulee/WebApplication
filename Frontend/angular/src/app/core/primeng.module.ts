import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({
	imports: [
		EditorModule,
		ColorPickerModule,
		ChipsModule,
		TableModule,
		VirtualScrollerModule,
		InputTextModule,
		ButtonModule,
		TreeModule,
		PanelMenuModule,
	],
	exports: [
		EditorModule,
		ColorPickerModule,
		ChipsModule,
		TableModule,
		VirtualScrollerModule,
		InputTextModule,
		ButtonModule,
		TreeModule,
		PanelMenuModule,
	],
})
export class PrimeNGModule {}
