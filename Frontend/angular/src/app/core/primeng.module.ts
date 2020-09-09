import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

@NgModule({
	imports: [EditorModule, ColorPickerModule, ChipsModule, TableModule, VirtualScrollerModule],
	exports: [EditorModule, ColorPickerModule, ChipsModule, TableModule, VirtualScrollerModule],
})
export class PrimeNGModule {}
