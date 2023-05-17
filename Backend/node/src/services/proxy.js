const net = require("net");
const MongoDB = require("../db/mongodb");
const moment = require("moment");

class ProxyService {
  server = null;

  async init(port) {
    if (!port) {
      console.error("Proxy Port not defined");
      return;
    }
    //
    this.server = net.createServer();
    this.server.listen({ host: "0.0.0.0", port }, () => {
      console.log(`Starting proxy server at port ${port}`);
    });

    this.server.on("close", () => {
      console.log("Client disconnected");
    });
    this.server.on("error", (err) => {
      console.error("Internal server error");
      console.error(err);
    });
    this.server.on("connection", async (client) => {
      await this.onConnection(client);

      // after certain amount of time listening close it
      setTimeout(() => {
        client.destroy();
      }, 3 * 60 * 60 * 1000); // proxy server can be alive for 3 hours max
    });
  }

  async onConnection(client) {
    console.log("Client connected. Waiting for authorization request.");

    // receive bootstrap info once
    client.once("data", async (data) => {
      // receive {id: ""}
      let db = null;
      try {
        let json = JSON.parse(data.toString());
        if (!json.id) {
          console.error(json);
          console.error("invalid format");
          client.destroy();
          return;
        }
        // connect to mongodb
        db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
        await db.connect();

        // validate id in iot_provisioning
        let results = await db.find("iot_provisioning", {
          query: {
            id: json.id,
          },
        });
        if (!results || results.length == 0) {
          console.error(`invalid id: ${json.id}`);
          client.destroy();
          return;
        }
        // check if reverse proxy is allowed
        let provision = results[0];
        if (moment(provision.proxy_expiry_date) > moment()) {
          console.log("Opening proxy server");
        } else {
          console.error("Proxy not allowed");
          client.destroy();
          return;
        }

        // open a server on a random port and redirect the data to the client
        let proxy_server = net.createServer();
        proxy_server.listen({ port: 0, host: "0.0.0.0" });
        console.log("Creating reverse proxy server");
        await {
          then(r, f) {
            proxy_server.on("listening", r);
            proxy_server.on("error", f);
          },
        };

        // get the port number
        let address = proxy_server.address();
        // save to the provisioning
        await db.update("iot_provisioning", {
          _id: provision._id,
          proxy_port: address.port,
          proxy_expiry_date: moment().add(3, "hours").toDate(),
        });
        console.log(`Reverse proxy server port assigned to ${address.port}`);

        // when proxy server receives a connection
        proxy_server.on("connection", async (proxy_client) => {
          //
          console.log("Reverse proxy client connected");

          // pipe the commnunication channel
          client.pipe(proxy_client);
          proxy_client.pipe(client);

          proxy_client.on("error", (err) => {
            console.error(err);
          });

          // closing detection
          proxy_client.on("close", () => {
            //
            console.log("Proxy client disconnected");
          });
        });

        // close condition
        proxy_server.on("close", () => {
          console.log(`Closing reverse proxy server ${address.port}`);
        });

        // close condition
        client.on("close", () => {
          console.log("Client Closed");
          client.end();
          setTimeout(() => {
            client.destroy();
            proxy_server.close();
          }, 10000);
        });
      } catch (ex) {
        // json parse error
        console.error(ex);
        client.destroy();
      } finally {
        if (db) db.close();
      }
    });
  }
}

module.exports = new ProxyService();
