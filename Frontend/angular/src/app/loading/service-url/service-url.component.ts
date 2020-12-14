import { Component } from "@angular/core";
import obj from "object-path";

// user imports
import { BaseComponent } from "../../ui/base.component";

// get config from index.html
declare var window: any;

@Component({
  selector: "service-url",
  templateUrl: "./service-url.component.html",
  styleUrls: ["./service-url.component.scss"],
})
export class ServiceUrlComponent extends BaseComponent {
  service_url;
  register() {
	localStorage.setItem('service_url', this.service_url);
	this.event.send({name: 'initialize'});
  }
}
