class MQTTBrokerService {
    async init({ port }) {
        // setup MQTT
        const aedes = require('aedes')({
            
            authorizePublish: function (client, packet, callback) {
                console.log(`authorize publish ${packet.topic}`);
                console.log(packet.payload.toString('utf8'))
                callback(null);
            },
            
            authorizeSubscribe: function (client, sub, callback) {
                console.log(`authorize subscribe: ${sub.topic}`);
                callback(null, sub);
            }
            

        })
        const server = require('net').createServer(aedes.handle)

        server.listen(port, function () {
            console.log('MQTT Broker started and listening on port ', port)
        })

        server.on("client", async (client) => {
            console.log("client?");
            console.log(client)
        });

    }
}

module.exports = new MQTTBrokerService();
