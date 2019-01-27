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
        
        //         
        if(this.property.beforeRequest)
            eval(this.property.beforeRequest)

        // do something                
        let response = await rp(this.property.options)                

        // 
        if(this.property.afterResponse)
            eval(this.property.afterResponse)
    }
}

module.exports = REST_Action