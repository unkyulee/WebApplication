var rp = require('request-promise-native');
var jsonic = require('jsonic')

class REST_Action {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    async init() {
    }

    async finish() {
    }

    async start() {
        console.log(`REST_Action::start ${this.property.name}`)        
        
        // do something        
        let options = eval(this.property.options)        
        let response = await rp(options)
        
        console.log(response)
    }
}

module.exports = REST_Action