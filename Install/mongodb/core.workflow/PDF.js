var Mustache = require("mustache");
var pdf = require("html-pdf");

(async function () {
    // form values
    let params = Object.assign({}, req.query, req.body);

    // load config
    await res.locals.ds.connect();
    let config = await res.locals.ds.find("core.config", {
        navigation_id: req.headers["x-app-key"],
        pdf: params.pdf
    });

    // transform
    let data = await eval(config.data)

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
