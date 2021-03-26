const fs = require("fs");
const cron = require("node-cron");

// interval in seconds
function run() {
  console.log("Scheduling starts");

  //
  // load JSON config file  
  let config = JSON.parse(fs.readFileSync(`${__dirname}\\config.json`));
  console.log(config);

  // take time stamps so that no duplicate execution
  // also give reference for the force termination
  let is_running = false;
  let is_running_time = null;

  //
  cron.schedule(config.cron, async () => {
    if (is_running) {
      console.log("Previous function is still running");
      return;
    }

    //
    is_running = true;
    is_running_time = new Date();

    try {
      //
      console.log("running a task every minute");
      await timeout(1000 * 120);
    } catch (ex) {
      console.log(ex);
    }

    //
    is_running = false;
  });
}

async function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}


// 
run();