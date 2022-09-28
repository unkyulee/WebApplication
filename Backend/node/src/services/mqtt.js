const MongoDB = require("../db/mongodb");
const obj = require("object-path");
const util = require("../lib/utility");

class MQTTBrokerService {
    router = {};
    config = {};
    data = {};

    async init({ port }) {
        // 
        // init routers
        await this.init_routers();

        // 
        // setup MQTT
        const aedes = require('aedes')({
            authorizePublish: (client, packet, callback) => this.authorizePublish(client, packet, callback),
            authorizeSubscribe: (client, sub, callback) => this.authorizeSubscribe(client, sub, callback),
            authenticate: (client, username, password, callback) => this.authenticate(client, username, password, callback)
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

            // load config 
            let serverConfig = await db.find("server");
            if (!serverConfig && serverConfig.length > 1) {
                console.log("server config load failed");
                return;
            }
            this.config = obj.get(serverConfig, '0.mqtt', {});

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
        for (let routerId of Object.keys(this.router)) {
            if (obj.get(this.router, `${routerId}.handler.Publish.process`)) {
                try {
                    // current router to be referenced in the business logic
                    let router = obj.get(this.router, routerId);
                    eval(obj.get(this.router, `${routerId}.handler.Publish.process`))
                } catch (ex) {
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
        for (let routerId of Object.keys(this.router)) {
            if (obj.get(this.router, `${routerId}.handler.Subscribe.process`)) {
                try {
                    // current router to be referenced in the business logic
                    let router = obj.get(this.router, routerId);
                    eval(obj.get(this.router, `${routerId}.handler.Subscribe.process`))
                } catch (ex) {
                    console.error(ex.stack)
                }
            }
        }
        // hook code end

        // always call back in order to flow through
        callback(null, sub);
    }

    async authenticate(client, username, password, callback) {        
        if (
            obj.get(this.config, 'username', '') == username &&
            obj.get(this.config, 'password', '') == password
        ) {            
            await this.log("login", "mqtt", "authenticate", `login success: ${username}`)            
            callback(null, true);
        } else {            
            var error = new Error('Auth error')
            error.returnCode = 4
            callback(error, null)
            client.close();
            console.error(`login failed: ${username}`)
        }        
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

module.exports = new MQTTBrokerService();
