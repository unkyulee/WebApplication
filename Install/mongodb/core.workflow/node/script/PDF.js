var Mustache = require("mustache");
var pdf = require("html-pdf");
var moment = require("moment-timezone");

(async function() {
  // form values
  let data = Object.assign({}, req.query, req.body);

  // load from the database
  await res.locals.ds.connect();
  data = await res.locals.ds.find(data.collection, {
    _id: ObjectID(data._id)
  });

  // take the first row
  data = data[0]

  // transform
  await eval(res.locals.configuration.transform)

  // prepare html
  var html = Mustache.render(res.locals.configuration.template, data);

  // convert html to pdf
  await new Promise(function(resolve, reject) {
    pdf
      .create(html, res.locals.configuration.options)
      .toBuffer(function(err, buffer) {
        res.setHeader(
          "Content-disposition",
          `inline; filename=${new Date().getTime()}.pdf`
        );
        res.end(buffer, "binary");
        resolve(true);
      });
  });

})();
