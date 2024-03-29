const MongoDB = require("../db/mongodb");
const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const moment = require("moment-timezone");
const util = require("../lib/utility");
const axios = require("axios");
const path = require("path");
const email = require("../lib/email/email");
const calendar = require("../lib/calendar/calendar");
const storage = require("../lib/storage/storage");
const contact = require("../lib/contact/contact");

class WebSocketService {
  router = {};
  wss = null;

  async init(server) {
    const WebSocket = require("ws");
    this.wss = new WebSocket.Server({ server });

    // initialize db and load server configuration
    await this.init_routers();

    // listen to connections
    this.listen(this.wss, this.routers);

    return this.wss;
  }

  async init_routers() {
    let db = null;

    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // load routers from the database
      let routers = await db.find("server.router", {
        size: 1000,
        sort: { priority: -1 },
        query: {
          type: "WS",
        },
      });

      if (routers && routers.length > 0) {
        console.log("----------------------------------");
        console.log("WS Loading routers ...");
        for (let router of routers) {
          //
          console.log(`ROUTER: ${router.id}`);
          this.router[router.id.toLowerCase()] = router;

          // load handlers
          let handlers = await db.find("server.handler", {
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
      let urls = req.url.split("/");

      // if the router name is not passed then close the connection
      if (urls.length <= 1) {
        console.log(`router missing ${req.url}`);
        ws.close();
        return;
      }

      // find the router
      if (!this.router[urls[1].toLowerCase()]) {
        console.log(`router doesn't exists ${urls[1].toLowerCase()}`);
        ws.close();
        return;
      }

      // assign unique id
      ws.id = urls[2];

      // save the request object
      ws.req = req;

      ws.on("error", (err) => {
        console.error(ws.router.id, err);
        ws.close();
        console.log("connection closed");
        return;
      });

      ws.on("close", async () => {
        // handler not found
        await log(ws.id, "", "connection close", ``);
      });

      // listen to connection
      ws.on("message", async (msg) => {
        // relocate router on every message
        let urls = req.url.split("/");
        ws.router = this.router[urls[1].toLowerCase()];

        // see if there is a hook
        if (ws.hook) {
          try {
            if (await ws.hook(msg)) {
              return;
            }
          } catch (ex) {
            console.error(ex);
          }
        }

        // find the matching handler
        try {
          let handler = await eval(ws.router.router);
          if (handler) {
            if (!obj.get(handler, "skiplog", false)) {
              // register the transaction
              await log(ws.id, ws.router.id, handler.handler, `${msg}`);
            }

            // process the request
            try {
              await eval(handler.process).catch((e) => {
                throw e;
              });
            } catch (ex) {
              await log(
                ws.id,
                ws.router.id,
                handler.handler,
                `${ex} ${ex.stack}`
              );
            }
          } else {
            // handler not found
            await log(ws.id, ws.router.id, "NOT HANDLED", `${msg}`);
          }
        } catch (ex) {
          console.error(ex);
          return;
        }
      });

      // register the connection
      await log(ws.id, urls[1], "connection", req.url);

      // control connection
      ws.router = this.router[urls[1].toLowerCase()];
      if (ws.router.connect) {
        if (!(await eval(ws.router.connect))) {
          ws.close();
        }
      }
    });

    console.log("Web Socket server started listening");
  }

  async log(id, protocol, handler, message, incoming = true) {
    let db = null;
    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // load routers from the database
      await db.insert("server.log", {
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
