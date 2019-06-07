const cron = require("cron-parser");
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require("../db/mongodb");

const timeout = ms => new Promise(res => setTimeout(res, ms));

const log = (db, task, msg) => {
  return new Promise(function(resolve, reject) {
    let logMessage = {
      msg: `${msg}`,
      _created: new Date()
    };
    // remove the user from all the group
    db.db.collection("core.scheduled_task").updateMany(
      { _id: ObjectID(`${task._id}`) },
      { $push: { logs: logMessage } },
      (err, res) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      }
    );
  });
};

class Task {
  // interval in seconds
  async start(sleep) {
    console.log(`scheduler starting with ${sleep}s interval`);
    setInterval(async () => {
      let db = null;
      try {
        // instantiate DB
        db = new MongoDB(process.env.DATABASE_URI, process.env.DB);

        // try to connect to db
        await db.connect();

        // get unscheduled tasks and schedule them
        await this.schedule(db);

        // get scheduled task and run them
        await this.execute(db);

      } catch (e) {
        console.log(`scheduler crashed ${e}`);
      } finally {
        // close connection
        if(db) await db.close();
      }
    }, sleep * 1000);
  }

  async schedule(db) {
    // if the task was running for more than 1 hour then reset
    let deadTasks = await db.find("core.scheduled_task", {
      $and: [
        // is running for more than 1 hour than consider it as a dead task
        {
          _updated: {
            $lte: new Date(new Date().getTime() - 60 * 60 * 1000)
          }
        },
        { last_run_result: "Running" }
      ]
    });
    for (let task of deadTasks) {
      await db.update("core.scheduled_task", {
        _id: task._id,
        next_run_date: null,
        last_run_result: null,
        _updated: new Date()
      });
      console.log(`reset dead task: ${task._id}`);
    }

    // get list of unscheduled tasks
    let tasks = await db.find("core.scheduled_task", {
      next_run_date: null
    });

    for (let task of tasks) {
      if (task.schedule) {
        // find next run date
        let interval = cron.parseExpression(task.schedule);
        task.next_run_date = new Date(interval.next().toString());

        try {
          // log
          await log(
            db,
            task,
            `Next Run - ${task.schedule} - ${task.next_run_date}`
          );

          // update the task
          await db.update("core.scheduled_task", {
            _id: task._id,
            next_run_date: task.next_run_date
          });
        } catch (e) {}
      }
    }
  }

  async execute(db) {
    // get list of unscheduled tasks
    let tasks = await db.find(
      "core.scheduled_task",
      {
        $and: [
          { next_run_date: { $lte: new Date() } },
          { last_run_result: { $ne: "Running" } }
        ]
      },
      { next_run_date: 1 }
    );

    // pick first task and run it
    for (let task of tasks) {
      try {
        // initiate the task
        await db.update("core.scheduled_task", {
          _id: task._id,
          last_run_result: "Running",
          _updated: new Date(),
          logs: []
        });
        await log(db, task, `started`);

        // run task
        let result = await eval(task.script);
        if (result == null) result = "Success";

        // complete the task
        await log(db, task, `completed`);
        await db.update("core.scheduled_task", {
          _id: task._id,
          last_run_result: `${result}`,
          next_run_date: null
        });
      } catch (e) {
        try {
          await log(db, task, e.stack);

          // fail the task
          await log(db, task, `failed`);
          await db.update("core.scheduled_task", {
            _id: task._id,
            last_run_result: "failed",
            next_run_date: null
          });
        } catch (e) {}
      }
    }
  }
}

module.exports = new Task();
