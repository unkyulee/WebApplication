const proxy = require("../src/services/proxy");
const net = require("net");

async function test() {
  // init
  await proxy.init(8888);

  // try to connect to port 8888 and send id
  let proxy_client = net.createConnection(
    {
      host: "localhost",
      port: 8888,
    },
    async () => {
      console.log("Client connected");

      // send id to authorization
      proxy_client.write(JSON.stringify({ id: "IOT-PRINTER-20230420" }));

      // establish connection to tunnel
      let client = net.createConnection(
        {
          host: "localhost",
          port: 27017,
        },
        () => {
          console.log("Connected to 27017 localhost");
          // pipe the commnunication channel
          client.pipe(proxy_client);
          proxy_client.pipe(client);
        }
      );

      // closing condition
      // proxy_client close
      proxy_client.on("close", () => {
        console.log("Proxy client disconnected");
        proxy_client.destroy();
        client.destroy();
      });

      // client closure
      client.on("close", () => {
        console.log("Proxy client disconnected");
        proxy_client.destroy();
        client.destroy();
      });

      // timeout
      setTimeout(() => {
        console.log("Timeout proxy");
        proxy_client.destroy();
        client.destroy();
      }, 60 * 1000);
    }
  );
}

test();
