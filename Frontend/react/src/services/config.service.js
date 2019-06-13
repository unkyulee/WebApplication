class ConfigService {
  // default configuration
  configuration = {};

  constructor() {
    // load from the config if defined
    this.configuration = Object.assign(this.configuration, window.__CONFIG__);
    console.log('hi')
  }
}

export default new ConfigService()