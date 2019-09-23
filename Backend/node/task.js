const task = require("./src/services/task");

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    process.exit(-1)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
})

try {
    task.runOnce(process.env.DATABASE_URI, process.env.DB);
} catch (e) {
    console.log(e)
}

