const axios = require("axios");
const obj = require("object-path");

class Task {
  host
  token
  company_id

  async run(host, company_id, token) {
    this.host = host;
    this.company_id = company_id;
    this.token = token;

    try {
      // reset dead tasks
      await this.resetDeadTasks();

      // get unscheduled tasks and schedule them
      //await this.schedule(db);

      // get scheduled task and run them
      //await this.execute(db);
    } catch (ex) {
      console.log(ex);
    }
  }

  async resetDeadTasks() {
    // if the task was running for more than 1 hour then reset
    let query = [
      // is running for more than 1 hour than consider it as a dead task
      {
        _updated: {
          $lte: new Date(new Date().getTime() - 60 * 60 * 1000)
        }
      },
      { status: "Running" }
    ]
    let url = `${this.host}/api/sync/task?$and$=${JSON.stringify(query)}`;
    console.log(url)
    let deadTasks = await axios.get(
      url,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'company_id': this.company_id
        }
      }
    )
    deadTasks = deadTasks.data;

    for (let task of obj.get(deadTasks, 'data', [])) {
      /*
      await db.update("task", {
        _id: task._id,
        next_run_date: null,
        status: null,
        _updated: new Date()
      });
      */
      console.log(`reset dead task: ${task.name}`);
    }
  }

  async schedule(db) {
    // get list of unscheduled tasks
    let tasks = await db.find("task", {
      query: {
        next_run_date: null
      }
    });

    for (let task of tasks) {
      if (task.cron) {
        // find next run
        let interval = cron.parseExpression(task.cron);
        task.next_run_date = new Date(interval.next().toString());

        try {
          // update the task
          await db.update("task", {
            _id: task._id,
            next_run_date: task.next_run_date,
            status: "Scheduled",
            _updated: new Date()
          });
          console.log(`scheduled task: ${task.name} - ${task.next_run_date}`);
        } catch (e) {}
      }
    }
  }

  async execute(db) {
    // get list of unscheduled tasks
    let tasks = await db.find("task", {
      query: {
        $and: [
          { next_run_date: { $lte: new Date() } },
          {
            $or: [
              { status: { $ne: "Running" } },
              { status: { $ne: "Waiting" } }
            ]
          }
        ]
      },
      sort: { next_run_date: 1 },
      size: 1000
    });

    // set task to as Waiting
    for (let task of tasks) {
      // initiate the task
      await db.update("task", {
        _id: task._id,
        status: "Waiting",
        _updated: new Date()
      });
    }

    // pick first task and run it
    for (let task of tasks) {
      console.log(`Running Task: ${task.name}`);
      let taskInstanceId = null;
      try {
        // initiate the task
        await db.update("task", {
          _id: task._id,
          status: "Running",
          _updated: new Date()
        });

        // create a task instance
        taskInstanceId = await db.update("task.instance", {
          task_id: `${task._id}`,
          started: new Date()
        });

        // run task
        await this.executeActions(db, task, taskInstanceId);

        // finish a task instance
        await db.update("task.instance", {
          _id: taskInstanceId,
          ended: new Date(),
          status: "Success"
        });

        // complete the task
        await db.update("task", {
          _id: task._id,
          status: "Success",
          _updated: new Date(),
          next_run_date: null
        });
      } catch (e) {
        console.log(e);
        try {
          // fail the task
          if (taskInstanceId) {
            await db.update("task.instance", {
              _id: taskInstanceId,
              ended: new Date(),
              status: "Failed"
            });
          }
        } catch {}
        try {
          await db.update("task", {
            _id: task._id,
            status: "Failed",
            _updated: new Date(),
            next_run_date: null
          });
        } catch {}
      }
    }
  }

  async executeActions(db, task, taskInstanceId) {
    // get list of actions
    let actions = await db.find("task.action", {
      query: { task_id: `${task._id}` },
      sort: { order: 1 },
      size: 1000
    });

    // go through each action
    let context = {};
    for (let action of actions) {
      if (action.enabled != false) {
        console.log(action.name);
        try {
          // perform the task
          await eval(action.script);
          if (context.stop == true) {
            log(db, task, taskInstanceId, action, `== Stop Processing ==`);
            break;
          }
        } catch (e) {
          log(db, task, taskInstanceId, action, `${e.stack}`);
          throw e;
        }
      }
    }
  }
}

module.exports = new Task();


const log = async (db, task, taskInstanceId, action, msg) => {
  await db.update("task.log", {
    _created: new Date(),
    task_id: `${task ? task._id : ""}`,
    task_instance_id: `${taskInstanceId}`,
    action_id: `${action ? action._id : ""}`,
    action: action ? action.name : "",
    msg: `${msg}`
  });
};
