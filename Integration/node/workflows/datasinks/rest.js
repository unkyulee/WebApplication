var SqlString = require('sqlstring');
var rp = require('request-promise-native');
var jsonic = require('jsonic')

class REST_DataSink {
  constructor(context, property) {
    this.context = context
    this.property = property
  }

  async init() {
    //
    console.log(`REST_DataSink::init ${this.property.options.uri}`)

    // create a buffer
    this.buffer = []
    this.count = 0

    // listen to incoming events
    this.context.event.on(
      this.property.id
      , this.property.id
      , async (data, count) => { await this.incoming(data, count); }
    );
  }

  async incoming(data, count) {

    // produce the body content
    if (this.property.transform)
      eval(this.property.transform)

    // insert
    this.count += 1
    this.buffer.push(data)

    // insert when buffer reached its size
    if (!this.property.buffer) {
      await this.sendRequest()
      this.buffer = []
    }

    else if (this.buffer.length >= this.property.buffer) {
      try {
        await this.sendRequest()
      } catch (e) {
        // timeout then try again
        if (e.code == 'ETIMEDOUT')
          await this.sendRequest()
      }
      // clear buffer
      this.buffer = []
    }

  }

  async sendRequest() {

    // send post request
    try {
      console.log(`REST_DataSink::sendRequest current count ${this.count}`)

      //
      if (this.property.beforeRequest) eval(this.property.beforeRequest)

      for (let data of this.buffer) {
        let tryagain = false
        for(let i = 0; i < 3; i++) {          
          try {
            let response = await rp(this.property.options)            
            tryagain = false
          } catch(e) {
            console.log('trying again ...')
            tryagain = true
          }
          // retry when timeout
          if(tryagain == false) break;
        }
      }

    } catch (e) {
      console.error(e)
      process.exit(1)
    }

  }

  async start() {
    // do nothing
  }

  async finish() {

    // flush the buffer if any exists
    if (this.buffer.length > 0) {
      await this.sendRequest()
      this.buffer = []
    }

    // stop listening
    this.context.event.remove(this.property.id)

    //
    console.log(`REST_DataSink::finish - ${this.count} sent`)
  }
}

module.exports = REST_DataSink