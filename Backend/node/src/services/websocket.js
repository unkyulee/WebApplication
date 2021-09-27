const MongoDB = require("../db/mongodb");
const obj = require('object-path');
const moment = require('moment-timezone');

class WebSocketService {
  routers = [];
  handler = {};

  async run(wss) {
    // init
    await this.init();

    // listen to connections
    this.listen(wss, this.routers, this.handler);
  }

  async init() {
    let db = null;

    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // load routers from the database
      this.routers = await db.find("protocol_router", { size: 1000, sort: {priority: -1} });
      if(this.routers && this.routers.length > 0) {
        console.log('Loading routers ...')
        for(let router of this.routers) {
          // 
          console.log(router.id);

          // load handlers
          let handlers = await db.find("protocol_handler", { size: 1000, query: {protocol: router.id} });
          if(handlers && handlers.length > 0) {
            for(let handler of handlers) {
              console.log(` - ${handler.handler}`);
              this.handler[`${router.id}-${handler.handler}`] = handler;
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
    wss.on("connection", function connection(ws) {
      ws.on("message", async function message(msg) {
        // find the matching router and handler        
        let handled = false;
        for(let router of routers) {
          let result = eval(router.router);
          if(result && result.handler && handler[`${router.id}-${result.handler}`]) {
            //
            handled = true;

            // process the request            
            await eval(handler[`${router.id}-${result.handler}`].process);
            
            break;
          }
        }

        // handler not found
        if(handled == false) console.error(`Handler not found`, `${msg}`);
      });
    });
  }
}

module.exports = new WebSocketService();
