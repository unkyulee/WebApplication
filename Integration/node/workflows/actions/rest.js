var request = require('sync-request');
var jsonic = require('jsonic')

class REST_Action {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    init() {
    }

    finish() {
    }

    start() {
        console.log(`REST_Action::start ${this.property.name}`)
        console.log(`REST_Action::start ${this.property.url}`)
        // do something        
        let options = eval(this.property.options)        
        let response = request(
            this.property.method
            , this.property.url
            , options
        )
        // run transform
        eval(this.property.transform)
        console.log(`REST_Action::start status ${response.statusCode}`)
    }
}

module.exports = REST_Action