import axios from "axios";
import ConfigService from "./config.service.js";

class RestService {
  async request(url, data, method, options) {
    // pass if url is not specified
    if (!url) return null;

    // convert url to full qualified name
    if (url.startsWith("http") === false) {
      if (url.startsWith("/") === false) url = `/${url}`;
      url = `${ConfigService.get("rest")}${url}`;
    }

    ////////////////////////////////////
    switch (method) {
      case "post":
        return await axios.post(url, data, options);

      case "put":
        return await axios.put(url);

      case "delete":
        return await axios.delete(url);

      default:
        return await axios.get(url);
    }
  }
};

// export an instance so that it stays singletone
export default new RestService()
