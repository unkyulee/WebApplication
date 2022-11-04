import { Component } from "@angular/core";
import { EventService } from "src/app/services/event.service";

@Component({
  selector: "service-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class ServiceRegistrationComponent {
  constructor(private event: EventService) {}
  service_url;
  register() {
    // save service url
    localStorage.setItem("service_url", this.service_url);

    // inform registration of service
    this.event.send({ name: "registration-completed" });
  }
}
