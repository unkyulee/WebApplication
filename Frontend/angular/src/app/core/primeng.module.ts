import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SliderModule } from 'primeng/slider';

@NgModule({
	imports: [
		EditorModule,
		ColorPickerModule,
		TableModule,
		VirtualScrollerModule,
		InputTextModule,
		ButtonModule,
		TreeModule,
		PanelMenuModule,
		SliderModule,
	],
	exports: [
		EditorModule,
		ColorPickerModule,
		TableModule,
		VirtualScrollerModule,
		InputTextModule,
		ButtonModule,
		TreeModule,
		PanelMenuModule,
		SliderModule,
	],
})
export class PrimeNGModule {}
