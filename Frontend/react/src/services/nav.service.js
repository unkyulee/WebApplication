// user imports
import ConfigService from "./config.service";
import UserService from "./user/user.service";

class NavService {
  constructor() {
    // save as services
    this.config = ConfigService;
    this.user = UserService;

    // get navigation configuration
    this.set()
  }

  set() {
    this.navigation = this.config.get("angular_navigation")
    if(!this.navigation) {
      // if index.js doesn't contain angular_navigation then get it from the cache
      this.navigation = JSON.parse(localStorage.getItem("angular_navigation"));
    }

    // Set the settings from the given object
    this.navigation = this.accessConrol(this.navigation);
  }

  accessConrol(navigation) {
    let resultNav = [];

    // get roles from user
    let roleIds = this.user.roles();

    // fitler navigations with ACL
    if (navigation) {
      for (let navItem of navigation) {
        if (navItem.ACL) {
          if (navItem.ACL.find(value => -1 !== roleIds.indexOf(value)))
            resultNav.push(navItem);
        } else {
          resultNav.push(navItem);
        }
      }
    }

    return resultNav;
  }
}

// export an instance so that it stays singletone
export default new NavService();
