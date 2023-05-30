const net = require("net");
const MongoDB = require("../db/mongodb");
const moment = require("moment");

class ProxyService {
  server = null;
  db = null;

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

    // connect to mongodb
    this.db = new MongoDB(process.env.DATABASE_URI, process.env.DB);
    await this.db.connect();

    //
    this.server = net.createServer();
    this.server.listen({ host: "0.0.0.0", port }, async () => {
      console.log(`Proxy server at port ${port}`);
    });

    this.server.on("close", async () => {
      //
      await this.db.insert("server.log", {
        id: "server",
        incoming: false,
        protocol: "proxy",
        handler: "proxy",
        message: "Proxy host disconnected",
        _created: new Date(),
      });
    });

    this.server.on("error", async (err) => {
      //
      await this.db.insert("server.log", {
        id: "server",
        incoming: false,
        protocol: "proxy",
        handler: "Internal server error",
        message: err,
        _created: new Date(),
      });
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
    //
    await this.db.insert("server.log", {
      id: "server",
      incoming: false,
      protocol: "proxy",
      handler: "Proxy host connected",
      message: "",
      _created: new Date(),
    });

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
      await this.db.insert("server.log", {
        id: "server",
        incoming: false,
        protocol: "proxy",
        handler: "",
        message: {
          token,
          error: "Proxy host does not have valid permission",
        },
        _created: new Date(),
      });

      host.end();
      setTimeout(() => host.destroy(), 5000);
      return;
    }

    //
    // open a server on a random port and create a channel between proxy host and proxy server
    let proxyServer = net.createServer();
    proxyServer.listen({ port: 0, host: "0.0.0.0" });
    await this.db.insert("server.log", {
      id: "server",
      incoming: false,
      protocol: "proxy",
      handler: "",
      message: "Creating reverse proxy server",
      _created: new Date(),
    });
    await {
      then(r, f) {
        proxyServer.on("listening", r);
        proxyServer.on("error", f);
      },
    };

    // when proxy host closes connection the reset all channels
    host.on("close", async () => {
      await this.db.insert("server.log", {
        id: "server",
        incoming: false,
        protocol: "proxy",
        handler: "",
        message: `Proxy host closed`,
        _created: new Date(),
      });

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

    await this.db.insert("server.log", {
      id: "server",
      incoming: false,
      protocol: "proxy",
      handler: "",
      message: `Reverse proxy server port - ${address.port}`,
      _created: new Date(),
    });

    // handle when proxyServer receives a connection
    // when proxy server receives a connection
    proxyServer.on("connection", async (client) => {
      //
      await this.db.insert("server.log", {
        id: "server",
        incoming: false,
        protocol: "proxy",
        handler: "",
        message: "Client connected",
        _created: new Date(),
      });

      // pipe the commnunication channel
      client.pipe(host);
      host.pipe(client);

      client.on("error", async (err) => {
        await this.db.insert("server.log", {
          id: "server",
          incoming: false,
          protocol: "proxy",
          handler: "Client connection error",
          message: err,
          _created: new Date(),
        });
      });

      // when client disconnects then reset the proxy channel
      client.on("close", async () => {
        //
        await this.db.insert("server.log", {
          id: "server",
          incoming: false,
          protocol: "proxy",
          handler: "",
          message: "Client disconnected",
          _created: new Date(),
        });
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
      await this.db.insert("server.log", {
        id: "server",
        incoming: false,
        protocol: "proxy",
        handler: "",
        message: `Invalid json - ${token}`,
        _created: new Date(),
      });

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
        await this.db.insert("server.log", {
          id: "server",
          incoming: false,
          protocol: "proxy",
          handler: "",
          message: `Proxy host not registered - ${token.id}`,
          _created: new Date(),
        });

        host.end();
        setTimeout(() => host.destroy(), 5000);
        return;
      }

      // check if reverse proxy is allowed
      let provision = results[0];
      if (moment(provision.proxy_expiry_date) > moment()) {
        let diff = moment(provision.proxy_expiry_date).diff(moment());
        await this.db.insert("server.log", {
          id: "server",
          incoming: false,
          protocol: "proxy",
          handler: "",
          message: `Proxy host permission granted - ${diff}`,
          _created: new Date(),
        });

        //
        valid = true;

        // close proxy host connection after expiry
        setTimeout(() => {
          // proxy host can be connected for 3 hours max
          host.end();
          setTimeout(() => host.destroy(), 5000);
        }, diff);
      } else {
        await this.db.insert("server.log", {
          id: "server",
          incoming: false,
          protocol: "proxy",
          handler: "",
          message: "Proxy host not allowed to connect",
          _created: new Date(),
        });
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
