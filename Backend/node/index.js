const express = require('express')
const app = express();
const path = require('path')

// connect to mongodb
const MongoDB = require('./src/db/mongodb')
app.locals.db = new MongoDB(process.env.DATABASE_URI, process.env.DB)

// retrieve secret
app.locals.secret = process.env.SECRET

// initialize encryption
const Encryption = require('./src/lib/encryption')
app.locals.encryption = new Encryption(app.locals.secret)

// process cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Process the static files
app.locals.wwwroot = path.join(__dirname, 'wwwroot')
app.use(express.static(app.locals.wwwroot))

// process multiparts
var busboy = require('connect-busboy')
app.use(busboy())

// process forms
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// default TZ setup
if(process.env.TZ) {
  var moment = require("moment-timezone");
  moment.tz.setDefault(process.env.TZ);
}

// catch all
const router = require('./src/services/router')
const auth = require('./src/services/auth')
app.all('*', async (req, res) => {

  try {
    // try to connect to db
    await app.locals.db.connect()

    // check pre process
    if( await router.preProcess(req, res) == false)
      return;

    // process routing and get navigation
    res.locals.nav = await router.resolveNavigation(req, res)
    if( !res.locals.nav ) { res.status(404); res.end(); return; }

    res.locals.module = await router.resolveModule(req, res)
    if( !res.locals.module ) { res.status(404); res.end(); return; }

    // authenticate
    if (await auth.canModuleProcess(req, res))
      // process the page
      res.send(await res.locals.module.process(req, res))
    else
      res.end()

  } catch (e) {
    res.send(`${e.stack}`)
    res.status(500)
  }

});

// Initiate the task scheduler
if(process.env.TASK) {
  const task = require('./src/services/task');
  (async () => {
    try {
      await task.start(app, process.env.TASK || 5)
    } catch(err) {
      console.log(err)
    }
  })();
}

// Initiate the server
app.listen(process.env.PORT, () => {
  console.log(`PORT: ${process.env.PORT}, IP: ${process.env.BIND_IP}`)
});
