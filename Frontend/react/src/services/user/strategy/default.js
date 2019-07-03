class DefaultUserStrategy {
  // return user login id
  id() {
    return this.get("unique_name");
  }

  name() {
    return this.get("nameid");
  }

  roles() {
    return this.get("roles");
  }

  token() {
    return localStorage.getItem("token");
  }

  get(name) {
    let token = this.token();
    // do jwt decode
    if (token) {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");

      let user = JSON.parse(window.atob(base64));
      if (user) return user[name];
    }
  }
}

export default DefaultUserStrategy;