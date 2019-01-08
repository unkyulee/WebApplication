const cron = require('cron-parser');
const ObjectID = require('mongodb').ObjectID

const timeout = ms => new Promise(res => setTimeout(res, ms))

const log = (app, task, msg) => {
    return new Promise(function (resolve, reject) {
        let logMessage = {
            msg: `${msg}`
            , _created: new Date()
        }
        // remove the user from all the group
        app.locals.db.db.collection('core.scheduled_task').updateMany(
            { _id: ObjectID(`${task._id}`) }
            , { $push: { logs: logMessage } }
            , (err, res) => {
                if (err) {
                    resolve(false)
                    return
                }
                resolve(true)
            }
        )
    })
}

class Task {

    // interval in seconds
    async start(app, sleep) {
        console.log(`scheduler starting with ${sleep}s interval`)
        while (true) {
            await timeout(sleep * 1000)
            try {
                // try to connect to db
                await app.locals.db.connect()

                // get unscheduled tasks and schedule them
                await this.schedule(app)

                // get scheduled task and run them
                await this.execute(app)

            } catch(e) {
                console.log(`scheduler crashed ${e.stack}`)
            }
        }
    }


    async schedule(app) {
        // get list of unscheduled tasks
        let tasks = await app.locals.db.find(
            'core.scheduled_task'
            , { next_run_date: null }
        )

        for (let task of tasks) {
            if (task.schedule) {
                // find next run date
                let interval = cron.parseExpression(task.schedule)
                task.next_run_date = new Date(interval.next().toString())

                // log
                await log(app, task, `Next Run - ${task.schedule} - ${task.next_run_date}`)

                // update the task
                await app.locals.db.update('core.scheduled_task', {_id:task._id, next_run_date: task.next_run_date})
            }
        }
    }


    async execute(app) {
        // get list of unscheduled tasks
        let tasks = await app.locals.db.find(
            'core.scheduled_task'
            , { next_run_date: {$lte: new Date()} }
            , { next_run_date: 1 }
        )

        // pick first task and run it
        for(let task of tasks) {

            // initiate the task
            await app.locals.db.update('core.scheduled_task', {_id: task._id, last_run_result: "Running", logs: []})
            await log(app, task, `started`)

            try {

                // run task
                let result = await eval(task.script)
                if(result == null) result = "Success"

                // complete the task
                await log(app, task, `completed`)
                await app.locals.db.update('core.scheduled_task', {_id: task._id, last_run_result: `${result}`, next_run_date: null})

            } catch(e) {

                await log(app, task, e.stack)

                // fail the task
                await log(app, task, `failed`)
                await app.locals.db.update('core.scheduled_task', {_id: task._id, last_run_result: 'failed', next_run_date: null})
            }

        }

    }

}

module.exports = new Task()