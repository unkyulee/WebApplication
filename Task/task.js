const fs = require("fs");
const cron = require("node-cron");
const axios = require("axios");

//
// load JSON config file
let config = JSON.parse(fs.readFileSync(`${__dirname}\\config.json`));
console.log(config);

// interval in seconds
function run() {
  console.log("Scheduling starts");

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
      ///////////////////////////////////
      // step 1. login to get auth token
      await login();

      // step 2. reset dead tasks
      await resetDeadTask();

      // step 3. perform scheduling
      await schedule();

      // step 4. execute task
      await execute();
      ///////////////////////////////////
    } catch (ex) {
      console.log(ex);
    }

    //
    is_running = false;
  });
}

/////////////////////////////////////////////
// Schedule Workflow

async function login() {
  // login
  let response = await axios.post(
    `${config.host}/${config.url}`,
    {
      id: config.id,
      password: config.password,
    },
    {
      headers: {
        company_id: config.company_id,
      },
    }
  );

  // capture authorization
  if(response.headers.authorization) {
    config.auth = response.headers.authorization;    
  } else {
    throw "login failed"
  }  
}

async function resetDeadTask() {}

async function schedule() {}

async function execute() {}

/////////////////////////////////////////////
run();
