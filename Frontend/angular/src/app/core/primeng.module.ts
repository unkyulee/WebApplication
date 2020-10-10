import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		EditorModule,
		ColorPickerModule,
		ChipsModule,
		TableModule,
		VirtualScrollerModule,
		MenuModule,
		MenubarModule,
		InputTextModule,
		ButtonModule,
	],
	exports: [
		EditorModule,
		ColorPickerModule,
		ChipsModule,
		TableModule,
		VirtualScrollerModule,
		MenuModule,
		MenubarModule,
		InputTextModule,
		ButtonModule,
	],
})
export class PrimeNGModule {}
