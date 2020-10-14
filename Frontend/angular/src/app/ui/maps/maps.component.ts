import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

// user Imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'maps',
	template: `
		<google-map
			[height]="safeGet(uiElement, 'style.height')"
			[width]="safeGet(uiElement, 'style.width')"
			[center]="uiElement.center"
			[zoom]="safeGet(uiElement, 'zoom')"
			[options]="safeGet(uiElement, 'options')"
		>
			<map-marker
				*ngFor="let marker of safeGet(uiElement, 'markers', [])"
				[position]="marker.position"
				[label]="marker.label"
				[title]="marker.title"
				[options]="marker.options"
			>
			</map-marker>
		</google-map>
	`,
})
export class MapsComponent extends BaseComponent {
	@ViewChild(GoogleMap, { static: false }) map: GoogleMap;

	ngAfterViewInit() {
		super.ngAfterViewInit();

		if(this.uiElement.mapInit) {
			try {
				eval(this.uiElement.mapInit)
			} catch(ex) {
				console.error(ex, this.uiElement.mapInit)
			}
		}
	}
}
