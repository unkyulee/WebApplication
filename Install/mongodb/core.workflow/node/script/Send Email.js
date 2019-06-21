var nodemailer = require("nodemailer");

async function run() {
  // get navigation_id
  let navigation_id = req.headers["x-app-key"];
  if (!navigation_id) return "No X-App-Key specified";

  // form values
  let data = Object.assign({}, req.query, req.body);

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return { error: "No data service instantiated" };

  // connect to database
  await ds.connect();

  // get email configuration
  let config = await ds.find("core.config", { _id: ObjectID(navigation_id) });
  if (config.length == 0) return { error: "Config doesn't exist" };
  config = config[0];

  //
  let user = config.smtp_user_name;
  if (!user) return { error: "Username not specified" };

  let pass = req.app.locals.encryption.decrypt(config.smtp_password);
  if (!pass) return { error: "Password not specified" };

  // prepare server
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: user, pass: pass }
  });

  // prepare email context
  var mailOptions = {
    from: user,
    to: data.to ? data.to.join() : "",
    bcc: data.bcc ? data.bcc.join() : "",
    subject: data.title,
    html: data.body
  };

  // see if there is a template
  if (data.trigger && config.notification_templates) {
    let template = config.notification_templates.find(
      x => x.trigger == data.trigger
    );
    if (template) {
      if (template.to) mailOptions.to = eval(template.to);
      if (template.title) mailOptions.subject = eval(template.title);
      if (template.body) mailOptions.html = eval(template.body);
    }
  }

  // send email
  if (mailOptions.to || mailOptions.bcc)
    return await sendemail(transporter, mailOptions);
}

async function sendemail(transporter, mailOptions) {
  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(error);
      resolve(info);
    });
  });
}

run();
