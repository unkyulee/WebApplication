var rp = require('request-promise-native');

async function run() {
    
    // read configuration
    let config = res.locals.configuration
    if (!config) return "No Configuration Specified"
    
    // form values
    let data = Object.assign({}, req.query, req.body)
    
    // do something        
    if(config.beforeSending) eval(config.beforeSending)
    let options = eval(config.options)        
    let response = await rp(options)
    if(config.afterSending) eval(config.afterSending)
    
    return response
}

run()
