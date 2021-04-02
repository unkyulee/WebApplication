const fs = require("fs");
const cron = require("node-cron");
const cronParser = require("cron-parser");
const axios = require("axios");
const obj = require("object-path");
const moment = require("moment");

//
// load JSON config file
let config = JSON.parse(fs.readFileSync(`${__dirname}\\config.json`));

// interval in seconds
function run() {
  console.log("Scheduling starts");

  // take time stamps so that no duplicate execution
  // also give reference for the force termination
  let is_running = false;

  //
  cron.schedule(config.cron, async () => {
    if (is_running) {
      console.log("Previous function is still running");
      return;
    } else {
      console.log(`${moment().format("L LT")} - check task`);
    }

    //
    is_running = true;

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
  if (response.headers.authorization) {
    config.token = response.headers.authorization;
  } else {
    console.log(`Login failed - ${config.host}/${config.url}`);
    throw "login failed";
  }
}

async function resetDeadTask() {
  // if the task was running for more than 1 hour then reset
  let query = [
    // is running for more than 1 hour than consider it as a dead task
    {
      _updated: {
        $lte: new Date(new Date().getTime() - obj.get(config, 'timeout', 3600) * 1000),
      },
    },
    { status: "Running" },
  ];
  let url = `${config.host}/api/scheduled_task/tasks?$and$=${JSON.stringify(
    query
  )}`;
  let deadTasks = await axios.get(url, {
    headers: {
      Authorization: config.token,
      company_id: config.company_id,
    },
  });
  deadTasks = deadTasks.data;

  for (let task of obj.get(deadTasks, "data", [])) {
    try {
      await axios.post(
        `${config.host}/api/scheduled_task/tasks`,
        {
          _id: task._id,
          next_run_date: null,
          status: null,
          _updated: new Date(),
        },
        {
          headers: {
            Authorization: config.token,
            company_id: config.company_id,
          },
        }
      );
      console.log(`reset task: ${task.name}`);
    } catch (e) {
      console.log(e);
    }
  }
}

async function schedule() {
  let url = `${config.host}/api/scheduled_task/tasks?next_run_date$=null`;
  let tasks = await axios.get(url, {
    headers: {
      Authorization: config.token,
      company_id: config.company_id,
    },
  });
  tasks = tasks.data;

  //
  for (let task of obj.get(tasks, "data", [])) {
    if (task.cron) {
      // find next run
      let interval = cronParser.parseExpression(task.cron);
      task.next_run_date = new Date(interval.next().toString());

      try {
        await axios.post(
          `${config.host}/api/scheduled_task/tasks`,
          {
            _id: task._id,
            next_run_date: task.next_run_date,
            status: "Scheduled",
            _updated: new Date(),
          },
          {
            headers: {
              Authorization: config.token,
              company_id: config.company_id,
            },
          }
        );
        //
        await log(
          task,
          "",
          `scheduled task: ${task.name} - ${moment(task.next_run_date).format("L LT")}`
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}

async function execute() {
  // if the task was running for more than 1 hour then reset
  let url = `${config.host}/api/scheduled_task/tasks?size=100&_sort=next_run_date&$and$=[{"next_run_date":{"$lte": new Date()}},{"$or":[{"status":{"$ne":"Running"}},{"status":{"$ne":"Waiting"}}]}]`;
  let tasks = await axios.get(url, {
    headers: {
      Authorization: config.token,
      company_id: config.company_id,
    },
  });
  tasks = tasks.data;

  // set task to as Waiting
  for (let task of obj.get(tasks, "data", [])) {
    // initiate the task
    try {
      await axios.post(
        `${config.host}/api/scheduled_task/tasks`,
        {
          _id: task._id,
          status: "Waiting",
          _updated: new Date(),
        },
        {
          headers: {
            Authorization: config.token,
            company_id: config.company_id,
          },
        }
      );
      //
      await log(
        task,
        "",
        `initiate task: ${task.name} - ${moment(task.next_run_date).format('L LT')}`
      );
    } catch (e) {
      console.log(e);
    }
  }

  // pick first task and run it
  for (let task of obj.get(tasks, "data", [])) {
    try {
      ////////////////////////////////////////////////
      // initiate the task
      ////////////////////////////////////////////////
      await axios.post(
        `${config.host}/api/scheduled_task/tasks`,
        {
          _id: task._id,
          status: "Running",
          _updated: new Date(),
        },
        {
          headers: {
            Authorization: config.token,
            company_id: config.company_id,
          },
        }
      );

      //
      await log(
        task,
        "",
        `starting task: ${task.name} - ${moment(task.next_run_date).format('L LT')}`
      );

      ////////////////////////////////////////////////
      // run task
      ////////////////////////////////////////////////
      await executeActions(task);

      ////////////////////////////////////////////////
      // finishing task
      ////////////////////////////////////////////////
      await axios.post(
        `${config.host}/api/scheduled_task/tasks`,
        {
          _id: task._id,
          status: "Success",
          _updated: new Date(),
          next_run_date: null,
        },
        {
          headers: {
            Authorization: config.token,
            company_id: config.company_id,
          },
        }
      );
      //
      await log(
        task,
        "",
        `finishing task: ${task.name} - ${moment(task.next_run_date).format('L LT')}`
      );
    } catch (e) {
      ////////////////////////////////////////////////
      // task error
      ////////////////////////////////////////////////
      await axios.post(
        `${config.host}/api/scheduled_task/tasks`,
        {
          _id: task._id,
          status: "Failed",
          _updated: new Date(),
          next_run_date: null,
        },
        {
          headers: {
            Authorization: config.token,
            company_id: config.company_id,
          },
        }
      );

      //
      await log(task, "", e);

      // 
      break;
    }
  }
}

async function executeActions(task) {
  // get list of actions
  let url = `${config.host}/api/scheduled_task/actions?size=100&_sort=order&task_id=${task._id}`;
  let actions = await axios.get(url, {
    headers: {
      Authorization: config.token,
      company_id: config.company_id,
    },
  });
  actions = actions.data;
  
  // go through each action
  let context = {};
  for (let action of obj.get(actions, "data", [])) {
    if (action.enabled != false) {
      await log(task, action, `start ${action.name}`);
      try {
        
        // perform the task
        await eval(action.script);
                
        if (context.stop == true) {
          await log(task, action, `== Stop Processing ==`);
          break;
        }
      } catch (e) {
        await log(task, action, `${e.stack}`);
        throw e;
      }      
      await log(task, action, `finish ${action.name}`);
    }
  }
}

async function log(task, action, msg) {
  await axios.post(
    `${config.host}/api/scheduled_task/history`,
    {
      _created: new Date(),
      task_id: `${task ? task._id : ""}`,
      action_id: `${action ? action._id : ""}`,
      action: action ? action.name : "",
      msg: `${msg}`,
    },
    {
      headers: {
        Authorization: config.token,
        company_id: config.company_id,
      },
    }
  );  
}

/////////////////////////////////////////////
run();
