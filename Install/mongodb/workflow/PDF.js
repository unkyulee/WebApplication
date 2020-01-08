var Mustache = require("mustache");
var pdf = require("html-pdf");
var obj = require("object-path");

(async function () {
    // form values
    let params = Object.assign({}, req.query, req.body);

    // load config
    await res.locals.ds.connect();
    let config = await res.locals.ds.find("config", {
        navigation_id: req.cookies["x-app-key"],
        pdf: params.pdf
    });
    if (config.length == 0) {
        res.send(`configuration does not exist for ${req.cookies["x-app-key"]} of pdf ${params.pdf}`);
        res.end();
        return;
    }
    config = config[0];

    // transform
    let data = await eval(config.data);

    // prepare html
    var html = Mustache.render(config.template, data);

    // convert html to pdf
    await new Promise(function (resolve, reject) {
        pdf
            .create(html, config.options)
            .toBuffer(function (err, buffer) {
                res.setHeader(
                    "Content-disposition",
                    `inline; filename=${new Date().getTime()}.pdf`
                );
                res.end(buffer, "binary");
                resolve(true);
            });
    });

})();
