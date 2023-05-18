const proxy = require("../src/services/proxy");
const net = require("net");

async function test() {
  // init
  await proxy.init(8888);

  // try to connect to port 8888 and send id
  let proxyHost = net.createConnection(
    {
      host: "localhost",
      port: 8888,
    },
    async () => {
      console.log("[TEST] Host established channel with Proxy Server");

      // send id to authorization
      proxyHost.write(JSON.stringify({ id: "TEST" }));

      // establish connection to tunnel
      let targetHost = net.createConnection(
        {
          host: "localhost",
          port: 27017,
        },
        () => {
          console.log(
            "[TEST] Target Host connected to port 27017 in localhost"
          );
          // pipe the commnunication channel
          targetHost.pipe(proxyHost);
          proxyHost.pipe(targetHost);
        }
      );

      // closing condition
      // proxyHost close
      proxyHost.on("close", () => {
        console.log("[TEST] Proxy targetHost disconnected");
      });

      // targetHost closure
      targetHost.on("close", () => {
        console.log("[TEST] targetHost disconnected");
      });

      // timeout
      setTimeout(() => {
        console.log("[TEST] Timeout proxy");
        proxyHost.end();
        targetHost.end();
        setTimeout(() => {
          proxyHost.destroy();
          targetHost.destroy();
        }, 10000);
      }, 60 * 60 * 1000);
    }
  );
}

test();
