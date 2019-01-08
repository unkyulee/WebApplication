var SqlString = require('sqlstring');
var request = require('sync-request');
var jsonic = require('jsonic')

class REST_DataSink {
  constructor(context, property) {
    this.context = context
    this.property = property
  }

  init() {
    //
    console.log(`REST_DataSink::init ${this.property.url}`)

    // create a buffer
    this.buffer = []
    this.count = 0

    // listen to incoming events
    this.context.event.on(
      this.property.id
      , this.property.id
      , async (data , count) => { await this.incoming(data, count); }
    );
  }

  async incoming(count, data) {

    // produce the body content
    let result = eval(this.property.transform)

    // insert
    this.count += 1
    this.buffer.push(result)

    // insert when buffer reached its size
    if (!this.property.buffer) {
      this.sendRequest()
      this.buffer = []
    }

    else if (this.buffer.length >= this.property.buffer) {
      try {
        this.sendRequest()
      } catch(e) {
        // timeout then try again
        if(e.code == 'ETIMEDOUT')
          this.sendRequest()
      }

      this.buffer = []
    }

  }

  sendRequest(data) {

    // send post request
    try {
      console.log(`REST_DataSink::sendRequest current count ${this.count}`)
      let options = eval(this.property.options)

      let response = request(
        this.property.method
        , this.property.url
        , options
      )
      // run transform
      eval(this.property.response)

      if(response.statusCode != 200)
        throw response;

    } catch (e) {
      console.error(e)
      throw e
    }


  }

  start() {
    // do nothing
  }

  finish() {

    // flush the buffer if any exists
    if (this.buffer.length > 0) {
      this.sendRequest({ query: this.buffer.join(' ') })
      this.buffer = []
    }

    // stop listening
    this.context.event.remove(this.property.id)

    //
    console.log(`REST_DataSink::finish - ${this.count} sent`)
  }
}

module.exports = REST_DataSink