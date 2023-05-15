const path = require("path");
const express = require("express");

// Express Instance
const app = express();

// disable cache
app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// retrieve secret
app.locals.secret = process.env.SECRET;

// initialize encryption
const Encryption = require("./src/lib/encryption");
app.locals.encryption = new Encryption(app.locals.secret);

// Process the static files
app.locals.wwwroot = path.join(__dirname, "/wwwroot");
console.log(app.locals.wwwroot);
app.use(express.static(app.locals.wwwroot));

// process cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// process forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// process multiparts
var busboy = require("connect-busboy");
app.use(busboy());

// default TZ setup
if (process.env.TZ) {
  var moment = require("moment-timezone");
  moment.tz.setDefault(process.env.TZ);
}

// catch all
const router = require("./src/services/router");
const auth = require("./src/services/auth/auth");
const MongoDB = require("./src/db/mongodb");

app.all("*", async (req, res) => {
  handler(req, res);
});

async function handler(req, res) {
  let db = null;
  try {
    // check pre process
    if ((await router.preProcess(db, req, res)) == false) return;

    // connect to mongodb
    db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
    await db.connect();

    // process routing and get navigation
    res.locals.nav = await router.resolveNavigation(db, req, res);
    if (!res.locals.nav) {
      res.status(404);
      res.end();
      return;
    }

    res.locals.module = require(`./src/modules/${res.locals.nav.module}`);
    if (!res.locals.module) {
      res.status(404);
      res.end();
      return;
    }

    // authenticate
    if (await auth.canModuleProcess(db, req, res)) {
      let content = await res.locals.module.process(db, req, res);
      // process the page
      if (!res.finished) res.send(content);
    } else {
      res.end();
    }
  } catch (e) {
    // Respond with 500
    res.status(500);

    // Write to the console
    //console.error(e, req);
    console.error(e);
  } finally {
    // Close MongoDB
    if (db) await db.close();
    res.end();
  }
}

// Initiate the web server
const http = require("http");
const server = http.createServer(app);
server.listen(process.env.PORT, process.env.BIND_IP, () => {
  console.log(`PORT: ${process.env.PORT}, IP: ${process.env.BIND_IP}`);
  console.log(
    `DATABASE_URI: ${process.env.DATABASE_URI}, DB: ${process.env.DB}`
  );
});

// initialize the WebSocket server
if (process.env.WS == 1) {
  (async () => {
    console.log();
    console.log(`WEBSOCKET ON`);
    const webSocketService = require("./src/services/websocket");
    app.wss = await webSocketService.init(server);
  })();
}

// initialize the MQTT Broker
if (process.env.MQTT == 1 && process.env.MQTT_PORT) {
  console.log();
  console.log(`MQTT BROKER ON`);
  const mqttBrokerService = require("./src/services/mqtt");
  app.mqtt = mqttBrokerService.init({
    port: process.env.MQTT_PORT,
  });
}

// initialize Proxy Server
if (process.env.PROXY_PORT) {
  (async () => {
    console.log();
    console.log(`PROXY SERVER ON`);
    const proxyService = require("./src/services/proxy");
    app.proxy = proxyService;
    await proxyService.init(process.env.PROXY_PORT);
  })();
}
