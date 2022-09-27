const MongoDB = require("../db/mongodb");
const obj = require("object-path");
const util = require("../lib/utility");

class MQTTBrokerService {
    router = {};
    data = {};

    async init({ port }) {
        // 
        // init routers
        await this.init_routers();

        // 
        // setup MQTT
        const aedes = require('aedes')({
            authorizePublish: (client, packet, callback) => this.authorizePublish(client, packet, callback),
            authorizeSubscribe: (client, sub, callback) => this.authorizeSubscribe(client, sub, callback)
        })
        const server = require('net').createServer(aedes.handle)

        // start MQTT server
        server.listen(port, function () {
            console.log('MQTT Broker started and listening on port ', port)
        })
    }

    async init_routers() {
        let db = null;

        try {
            // connect to mongodb
            db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
            await db.connect();

            // load routers from the database
            let routers = await db.find("protocol_router", {
                size: 1000,
                sort: { priority: -1 },
                query: {
                    type: "MQTT"
                }
            });
            if (routers && routers.length > 0) {
                console.log("----------------------------------");
                console.log("MQTT Loading routers ...");
                for (let router of routers) {
                    //
                    console.log(`ROUTER: ${router.id}`);
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

    // hook into Publish Messages
    async authorizePublish(client, packet, callback) {
        
        // hook code here        
        for(let router of Object.keys(this.router)) {            
            if(obj.get(this.router, `${router}.handler.Publish.process`)) {
                try {
                    eval(obj.get(this.router, `${router}.handler.Publish.process`))
                } catch(ex) {
                    console.error(ex.stack)
                }                
            }
        }
        // hook code end

        // always call back in order to flow through
        callback(null);
    }

    // hook into Subscribe Messages
    async authorizeSubscribe(client, sub, callback) {
        
        // hook code here        
        for(let router of Object.keys(this.router)) {            
            if(obj.get(this.router, `${router}.handler.Subscribe.process`)) {
                try {
                    eval(obj.get(this.router, `${router}.handler.Subscribe.process`))
                } catch(ex) {
                    console.error(ex.stack)
                }                
            }
        }
        // hook code end

        // always call back in order to flow through
        callback(null, sub);
    }
}

module.exports = new MQTTBrokerService();
