import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { NgxImageCompressService } from 'ngx-image-compress';
var obj = require('object-path');

// user imports
import { BaseComponent } from '../base.component';

@Component({
	selector: 'uploader',
	templateUrl: './uploader.component.html',
})
export class UploaderComponent extends BaseComponent {
	constructor(private imageCompress: NgxImageCompressService) {
		super();
	}

	@ViewChild('fileInput', { static: false }) fileInput: ElementRef;
	@ViewChild('cameraInput', { static: false }) cameraInput: ElementRef;

	get value() {
		if (obj.has(this.data, this.uiElement.key) && obj.get(this.data, this.uiElement.key).constructor === Array)
			return obj.get(this.data, this.uiElement.key);
		else if (this.data && obj.get(this.data, this.uiElement.key)) return [obj.get(this.data, this.uiElement.key)];

		return [];
	}

	set value(v: any) {
		if (this.data && this.uiElement.key) {
			obj.set(this.data, this.uiElement.key, v);
		}
	}

	//
	public uploader: FileUploader;

	// event subscription
	onResume: Subscription;

	//
	timer: any;
	ngOnInit() {
		super.ngOnInit();

		// onresume - cordova requires constant montoring on the change detection
		// otherwise it doesn't update its screen .. this happens when coming from camera
		this.onResume = this.cordova.resume.subscribe((event) => {
			if (this.timer) clearInterval(this.timer);

			this.timer = setInterval(() => {
				// check changes until the queue is empty
				if (this.uploader && this.uploader.queue.length > 0) {
					this.event.send({ name: 'changed' });
				} else if (this.uploader && this.uploader.queue.length == 0) {
					clearInterval(this.timer);
				}
			}, 300);
		});

		// subscript to event
		this.onEvent = this.event.onEvent.subscribe(async (event) => {
			if (event && (event.key == this.uiElement.key || event.key == this.uiElement.name)) {
				if (event.name == 'upload-file') {
					// in case of uploading files open file selection dialog
					// in android open gallery
					if (this.cordova.navigator.camera) {
						let file = await this.cordova.openGallery();
						this.uploadFile(file);
					} else {
						// desktop: initiate file select dialog
						this.fileInput.nativeElement.click();
					}
				} else if (event.name == 'upload-camera') {
					// in case of uploading pictures then try to open camera
					if (this.cordova.navigator.camera) {
						let file = await this.cordova.openCamera();
						this.uploadFile(file);
					} else {
						// desktop: initiate image select dialog
						this.cameraInput.nativeElement.click();
					}
				} else if (event.name == 'upload') {
					// upload the file sent through the event
					await this.uploadFile(event.file);
				}
			}
		});
	}

	ngOnDestroy() {
		super.ngOnDestroy();

		this.onEvent.unsubscribe();
		this.onResume.unsubscribe();
		clearInterval(this.timer);
	}

	// refresh the table
	async fileSelected(e) {
		// for each selected file perform upload
		for (let f of e.target.files) {
			await this.uploadFile(f);
		}
	}

	async uploadFile(file) {
		// set uploader
		this.setUploader();

		if (this.uiElement.image) {
			// process the image if image options exists
			file = await this.processImage(file);
		}

		// upload the file
		if (file) {
			this.uploader.addToQueue([file]);
			this.uploader.uploadAll();
		}
	}

	// if it is an image then
	async toBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	async getImageDimensions(file) {
		return new Promise(function (resolved, rejected) {
			var i = new Image();
			i.onload = function () {
				resolved({ w: i.width, h: i.height });
			};
			i.src = file;
		});
	}

	dataURItoFile(dataURI, filename) {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		var byteString = atob(dataURI.split(',')[1]);
		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);
		var dw = new DataView(ab);
		for (var i = 0; i < byteString.length; i++) {
			dw.setUint8(i, byteString.charCodeAt(i));
		}
		// write the ArrayBuffer to a blob, and you're done
		let b: any = new Blob([ab], { type: mimeString });
		b.name = filename;
		return b;
	}

	image_progress = false;
	async processImage(file) {
		if (obj.has(this.uiElement, 'image.resizeMaxHeight') && obj.has(this.uiElement, 'image.resizeMaxWidth')) {
			this.image_progress = true; // show splash
			return new Promise(async (resolve) => {
				try {
					let image = await this.toBase64(file);
					let dimension: any = await this.getImageDimensions(image);
					let ratioHeight = this.uiElement.image.resizeMaxHeight / dimension.h;
					let ratioWidth = this.uiElement.image.resizeMaxWidth / dimension.w;
					let ratio = ratioHeight > ratioWidth ? ratioWidth : ratioHeight;
					if (ratio > 1) ratio = 1;

					this.imageCompress.compressFile(image, null, ratio * 100, 75).then(
						(result) => {
							let content = this.dataURItoFile(result, file.name);
							resolve(content);
						},
						(error) => {
							//something went wrong
							//use result.compressedFile or handle specific error cases individually
							console.error(error);
						}
					);
				} catch (e) {
					console.error(e);
					this.snackBar.open(e.reason, null, { duration: 2000 });
					resolve(null); // image processing failed
				} finally {
					this.image_progress = false; // hide splash
				}
			});
		}
	}

	// run setUploader when data is ready
	setUploader() {
		// set uploader for
		let url = this.uiElement.upload.url;
		try {
			url = eval(url);
		} catch (e) {}
		let method = this.uiElement.method;

		// option
		let options = {
			url: url,
			method: method,
			authToken: eval(this.uiElement.upload.authToken),
			authTokenHeader: eval(this.uiElement.upload.authTokenHeader),
			headers: eval(this.uiElement.upload.headers),
			autoUpload: this.uiElement.autoUpload ? this.uiElement.autoUpload : true,
		};

		// set uploader
		if (!this.uploader) {
			this.uploader = new FileUploader(options);
			// when upload is finished
			this.uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) =>
				this.onSuccessUpload(item, response, status, headers);
		} else {
			//
			this.uploader.setOptions(options);
		}
	}

	onSuccessUpload(item: any, response: any, status: any, headers: any): any {
		// try to convert to object
		try {
			response = JSON.parse(response);
		} catch (e) {
			console.error(e);
			return;
		}

		// try to get download path
		let downloadPath = response;
		if (this.uiElement.upload.downloadPathTransform)
			downloadPath = eval(this.uiElement.upload.downloadPathTransform);

		// try to get id
		let id = response;
		if (this.uiElement.upload.idTransform) id = eval(this.uiElement.upload.idTransform);

		// save id of the file
		let currentValue = this.value;
		currentValue.push({
			id: id,
			url: downloadPath,
			type: item.file.type,
			filename: item.file.name,
			size: item.file.size,
			_created: new Date(),
			_createdBy: this.user.id(),
		});
		this.value = currentValue;

		// hide splash
		this.event.send({ name: 'splash-hide' });

		// save if there are no others in the queue
		let index = this.uploader.queue.indexOf(item);
		if (index == this.uploader.queue.length - 1) {
			if (this.uiElement.saveAction) {
				try {
					eval(this.uiElement.saveAction);
				} catch (e) {
					console.error(e);
				}
			} else {
				this.event.send({ name: 'save' });
			}
		}

		// remove from the queue
		item.remove();
	}
}
