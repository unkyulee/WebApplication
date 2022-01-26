const MongoDB = require("../db/mongodb");
const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const moment = require("moment-timezone");
const util = require('../lib/utility');
const axios = require('axios');

class WebSocketService {
  router = {};
  db = null;

  async run(wss) {
    // init
    await this.init();

    // listen to connections
    this.listen(wss, this.routers);
  }

  async init() {
    let db = null;

    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // load routers from the database
      let routers = await db.find("protocol_router", {
        size: 1000,
        sort: { priority: -1 },
      });
      if (routers && routers.length > 0) {
        console.log("Loading routers ...");
        for (let router of routers) {
          //
          console.log(router.id);
          this.router[router.id.toLowerCase()] = router;

          // load handlers
          let handlers = await db.find("protocol_handler", {
            size: 1000,
            query: { protocol: router.id },
          });
          if (handlers && handlers.length > 0) {
            // index handlers to the router
            router.handler = {};

            for (let handler of handlers) {
              console.log(` - ${handler.handler}`);
              router.handler[handler.handler] = handler;
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Close MongoDB
      if (db) await db.close();
    }
  }

  listen(wss, routers, handler) {
    const log = this.log;
    
    // wait connection
    wss.on("connection", async (ws, req) => {
      // assign unique id
      ws.id = req.headers["sec-websocket-key"];

      // save the request object
      ws.req = req;

      // parse out router from the url
      let urls = req.url.split("/");

      // if the router name is not passed then close the connection
      if (urls.length <= 1) {
        console.log(`router missing ${req.url}`);
        ws.close();
        return;
      }

      // find the router
      if (!this.router[urls[1].toLowerCase()]) {
        console.log(`router doesn't exists ${req.url}`);
        ws.close();
        return;
      }

      ws.router = this.router[urls[1].toLowerCase()];

      ws.on('error', (err) => {
        console.error(ws.router.id, err);
        ws.close();
        console.log("connection closed");
        return;
      });

      ws.on("close", async () => {
        // handler not found        
        await log(ws.id, '', "connection close", ``);
      });

      // listen to connection
      ws.on("message", async (msg) => {
        // see if there is a hook
        if(ws.hook) {
          try {
            if(await ws.hook(msg)) {
              return;
            }
          } catch(ex) {
            console.error(ex);
          }
        }

        // find the matching handler
        let handler = eval(ws.router.router);
        if (handler) {
          // register the transaction
          await log(ws.id, ws.router.id, handler.handler, `${msg}`);

          // process the request
          await eval(handler.process);
        } else {
          // handler not found
          await log(ws.id, ws.router.id, "NOT HANDLED", `${msg}`);
        }
      });

      // register the connection
      await log(ws.id, ws.router.id, "connection", req.url);
    });
  }

  async log(id, protocol, handler, message, incoming = true) {
    let db = null;
    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // load routers from the database
      await db.insert("protocol_log", {
        id,
        incoming,
        protocol,
        handler,
        message,
        _created: new Date(),
      });
    } catch (e) {
      console.error(e);
    } finally {
      // Close MongoDB
      if (db) await db.close();
    }
  }
}

module.exports = new WebSocketService();
