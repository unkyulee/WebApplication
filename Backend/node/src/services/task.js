const cron = require("cron-parser");
const ObjectID = require("mongodb").ObjectID;

const timeout = ms => new Promise(res => setTimeout(res, ms));

const log = (app, task, msg) => {
  return new Promise(function(resolve, reject) {
    let logMessage = {
      msg: `${msg}`,
      _created: new Date()
    };
    // remove the user from all the group
    app.locals.db.db
      .collection("core.scheduled_task")
      .updateMany(
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
  async start(app, sleep) {
    console.log(`scheduler starting with ${sleep}s interval`);
    setInterval(async () => {
      try {
        // try to connect to db
        await app.locals.db.connect();

        // get unscheduled tasks and schedule them
        await this.schedule(app);

        // get scheduled task and run them
        await this.execute(app);
      } catch (e) {
        console.log(`scheduler crashed ${e.stack}`);
      }
    }, sleep * 1000);
  }

  async schedule(app) {
    // if the task was running for more than 1 hour then reset
    let deadTasks = await app.locals.db.find(
      "core.scheduled_task",
      {
        $and: [
          // is running for more than 1 hour than consider it as a dead task
          {
            _updated: {
              $lte: new Date(new Date().getTime() - 60 * 60 * 1000)
            }
          },
          { last_run_result: "Running" }
        ]
      }
    );
    for(let task of deadTasks) {
      await app.locals.db.update("core.scheduled_task", {
        _id: task._id,
        next_run_date: null,
        last_run_result: null,
        _updated: new Date()
      });
      console.log(`reset dead task: ${task._id}`)
    }

    // get list of unscheduled tasks
    let tasks = await app.locals.db.find("core.scheduled_task", {
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
            app,
            task,
            `Next Run - ${task.schedule} - ${task.next_run_date}`
          );

          // update the task
          await app.locals.db.update("core.scheduled_task", {
            _id: task._id,
            next_run_date: task.next_run_date
          });
        } catch (e) {}
      }
    }
  }

  async execute(app) {
    // get list of unscheduled tasks
    let tasks = await app.locals.db.find(
      "core.scheduled_task",
      {
        $and: [
          { next_run_date: { $lte: new Date() } }
          , { last_run_result: { $ne: "Running" } }
        ]
      },
      { next_run_date: 1 }
    );

    // pick first task and run it
    for (let task of tasks) {
      try {
        // initiate the task
        await app.locals.db.update("core.scheduled_task", {
          _id: task._id,
          last_run_result: "Running",
          _updated: new Date(),
          logs: []
        });
        await log(app, task, `started`);

        // run task
        let result = await eval(task.script);
        if (result == null) result = "Success";

        // complete the task
        await log(app, task, `completed`);
        await app.locals.db.update("core.scheduled_task", {
          _id: task._id,
          last_run_result: `${result}`,
          next_run_date: null
        });
      } catch (e) {
        try {
          await log(app, task, e.stack);

          // fail the task
          await log(app, task, `failed`);
          await app.locals.db.update("core.scheduled_task", {
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
