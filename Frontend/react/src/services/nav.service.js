// user imports
import ConfigService from "./config.service";

class NavService {
  constructor() {
    // save as services
    this.config = ConfigService;

    // get navigation configuration
    /*
    let navigation = this.config.get("navigation");
    console.log(window.__CONFIG__);
    */
  }
}

// export an instance so that it stays singletone
export default new NavService();
