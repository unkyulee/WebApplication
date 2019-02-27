export class NoAuthStrategy {
  constructor(
  ) {}

  async login(data) {
    return;
  }

  async logout() {
  }

  async isAuthenticated() {
    return true;
  }

  async refreshAuthentication() {
    return;
  }
}
