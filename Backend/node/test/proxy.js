const proxy = require("../src/services/proxy");
const net = require("net");

async function test() {
  // init
  await proxy.init(8888);

  // try to connect to port 8888 and send id
  let testClient = net.createConnection(
    {
      host: "localhost",
      port: 8888,
    },
    () => {
      console.log("Client connection established");
      // send id
      testClient.write(JSON.stringify({ id: "IOT-PRINTER-20230420" }));
    }
  );

  // 10 seconds later close
  setTimeout(() => {
    console.log("closing from client");
    testClient.destroy();
  }, 5000);
}

test();
