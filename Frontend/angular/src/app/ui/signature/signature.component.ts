import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

// user imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'signature',
	templateUrl: './signature.component.html',
})
export class SignatureComponent extends BaseComponent {
	constructor(private container: ElementRef) {
		super();
	}

	_data;
	@Input() get data() {
		return this._data;
	}

	set data(v) {
		this._data = v;
		if (this._data && this.uiElement.key && this.signaturePad) {
			this.signaturePad.fromDataURL(this._data[this.uiElement.key]);
		}
	}

	@ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;

	options: Object = {};

	// this.signaturePad is now available
	ngAfterViewInit() {
		super.ngAfterViewInit();

		this.signaturePad.set('canvasWidth', this.container.nativeElement.clientWidth);
		this.signaturePad.set('canvasHeight', this.container.nativeElement.clientHeight);

		// set background color
		if (this.uiElement.backgroundColor) this.signaturePad.set('backgroundColor', this.uiElement.backgroundColor);
		else this.signaturePad.set('backgroundColor', '#E2E2E2');

		// set pen color
		if (this.uiElement.penColor) this.signaturePad.set('penColor', this.uiElement.penColor);
		else this.signaturePad.set('penColor', 'rgb(0, 0, 255)');

		// clear to apply the background color
		this.signaturePad.clear();

		// load signature
		if (this._data && this.uiElement.key) {
			this.signaturePad.fromDataURL(this._data[this.uiElement.key]);
		}
	}

	drawStart() {}
	drawComplete() {}

	clear() {
		this.signaturePad.clear();
	}

	save() {
		//
		if (this.uiElement.save) {
			try {
				eval(this.uiElement.save);
			} catch (e) {
				console.error(e);
			}
		}
		// save signature
		else if (this._data && this.uiElement.key) {
			this._data[this.uiElement.key] = this.signaturePad.toDataURL();
			this.event.send({ name: 'save' });
		}
	}

	toFile(filename) {
		let data = this.signaturePad.toDataURL();
		data = data.split(',')[1];

		var byteCharacters = atob(data);
		var byteNumbers = new Array(byteCharacters.length);
		for (var i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		var byteArray = new Uint8Array(byteNumbers);

		let blob: any = new Blob([byteArray], { type: 'image/png' });
		blob.name = filename;
		blob.lastModified = Date.now();

		return blob;
	}

	// set the dimensions of the signature pad canvas
	beResponsive() {
		this.size();
	}

	size() {
		this.signaturePad.set('canvasWidth', this.container.nativeElement.clientWidth);
		this.ngAfterViewInit();
	}
}
