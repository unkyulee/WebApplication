export class NoAuthStrategy {
  constructor() {}

  async login() {
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
