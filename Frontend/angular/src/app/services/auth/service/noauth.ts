import { EventService } from "../../event.service";

export class NoAuthStrategy {
  constructor(private event: EventService) {}

  async login(data) {
    return;
  }

  async logout() {}

  async isAuthenticated() {    
    return true;
  }

  async refreshAuthentication() {
    return;
  }
}
