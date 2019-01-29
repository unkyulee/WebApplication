var Mustache = require('mustache');
var pdf = require('html-pdf');
var moment = require('moment')

async function run() {
    // form values
    let data = Object.assign({}, req.query, req.body)

    // step 1. convert html template with data
    if (res.locals.configuration.transform) {        
        eval(res.locals.configuration.transform)
    }
        
    var html = Mustache.render(res.locals.configuration.template, data);

    // step 2. convert to pdf    
    await (new Promise(function (resolve, reject) {        
        pdf.create(html, res.locals.configuration.options).toBuffer(
            function (err, buffer) {
                res.setHeader('Content-disposition', `inline; filename=${(new Date()).getTime()}.pdf`);
                res.end(buffer, 'binary')
                resolve(true)
            }
        );
    }))
}

run()

