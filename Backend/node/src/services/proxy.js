const net = require("net");
const MongoDB = require("../db/mongodb");
const moment = require("moment");

class ProxyService {
  server = null;

  // initialize the proxy server
  // runs a listening port at the startup
  // TERMINOLOGY
  // Server - Startup listening server
  // ------------------
  // Proxy Host - Host computer that wants to proxy a server
  // Proxy Server - Server will channel the proxy host to the proxy server
  // Client - Client computer wants to connect to the host
  async init(port) {
    if (!port) {
      console.error("Proxy Port not defined");
      return;
    }

    //
    this.server = net.createServer();
    this.server.listen({ host: "0.0.0.0", port }, () => {
      console.log(`Proxy server at port ${port}`);
    });

    this.server.on("close", () => {
      //
      console.log("Proxy host disconnected");
    });

    this.server.on("error", (err) => {
      //
      console.error("Internal server error");
      console.error(err);
    });

    // When server receives a connection that is from the host and tunnel is created
    this.server.on("connection", async (host) => {
      // handle the host connection
      await this.onConnection(host);

      // host connection shall have a timeout which is 3 hours
      // after certain amount of time listening close it
      setTimeout(() => {
        // proxy host can be connected for 3 hours max
        host.end();
        setTimeout(() => host.destroy(), 5000);
      }, 3 * 60 * 60 * 1000);
    });
  }

  // Handle host connection
  // Host connection means that the tunnel is created between host computer and this server
  async onConnection(host) {
    console.log("Proxy host connected.");
    // Host computer should send an authorization id
    // Server checks if the id has valid permission
    let token = await {
      then(r, f) {
        host.once("data", r);
        host.on("error", f);
      },
    };

    // Authorization for proxy host
    if (!(await this.checkProxyPermission(host, token))) {
      console.error("Proxy host does not have valid permission");
      host.end();
      setTimeout(() => host.destroy(), 5000);
      return;
    }

    //
    // open a server on a random port and create a channel between proxy host and proxy server
    let proxyServer = net.createServer();
    proxyServer.listen({ port: 0, host: "0.0.0.0" });
    console.log("Creating reverse proxy server");
    await {
      then(r, f) {
        proxyServer.on("listening", r);
        proxyServer.on("error", f);
      },
    };

    // when proxy host closes connection the reset all channels
    host.on("close", async () => {
      console.log(`Proxy host closed`);

      // close proxyServer
      proxyServer.close();

      // deactivate proxy permission
      await this.updateProvisioning({
        _id: host.provision._id,
        proxy_port: 0,
        proxy_expiry_date: new Date(),
      });
    });

    // get the port number of the proxyServer
    let address = proxyServer.address();
    await this.updateProvisioning({
      _id: host.provision._id,
      proxy_port: address.port,
    });
    console.log(`Reverse proxy server port - ${address.port}`);

    // handle when proxyServer receives a connection
    // when proxy server receives a connection
    proxyServer.on("connection", async (client) => {
      //
      console.log("Client connected");

      // pipe the commnunication channel
      client.pipe(host);
      host.pipe(client);

      client.on("error", (err) => {
        console.error(err);
      });

      // when client disconnects then reset the proxy channel
      client.on("close", async () => {
        //
        console.log("Client disconnected");
      });
    });
  }

  // JSON object that contains id which should be check against the database
  async checkProxyPermission(host, token) {
    let valid = false;

    // parse token to JSON format
    try {
      token = JSON.parse(token.toString());
      if (!token.id) throw token;
    } catch (ex) {
      console.error(`Invalid json - ${token}`);

      // close host connection
      host.end();
      setTimeout(() => host.destroy(), 5000);

      return false;
    }

    let db = null;
    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // validate id in iot_provisioning
      let results = await db.find("iot_provisioning", {
        query: {
          id: token.id,
        },
      });

      // if the result doesn't exist then device not registered
      if (!results || results.length == 0) {
        console.error(`Proxy host not registered - ${token.id}`);
        host.end();
        setTimeout(() => host.destroy(), 5000);
        return;
      }

      // check if reverse proxy is allowed
      let provision = results[0];
      if (moment(provision.proxy_expiry_date) > moment()) {
        let diff = moment(provision.proxy_expiry_date).diff(moment());
        console.log(`Proxy host permission allowed - ${diff}`);

        //
        valid = true;

        // close proxy host connection after expiry
        setTimeout(() => {
          // proxy host can be connected for 3 hours max
          host.end();
          setTimeout(() => host.destroy(), 5000);
        }, diff);
      } else {
        console.error("Proxy host not allowed to connect");
        host.end();
        setTimeout(() => host.destroy(), 5000);
        return;
      }

      // save provision
      host.provision = provision;
    } catch (ex) {
      console.error(ex);
      return false;
    } finally {
      if (db) db.close();
    }

    return valid;
  }

  async updateProvisioning(data) {
    if (!data._id) return;

    let db = null;
    try {
      // connect to mongodb
      db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
      await db.connect();

      // save to the provisioning
      await db.update("iot_provisioning", data);
    } catch (ex) {
    } finally {
      if (db) db.close();
    }
  }
}

module.exports = new ProxyService();
