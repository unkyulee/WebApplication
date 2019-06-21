class NoAuthStrategy {
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

// export an instance so that it stays singletone
export default NoAuthStrategy;
