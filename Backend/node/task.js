const task = require("./src/services/task");
task.runOnce(process.env.DATABASE_URI, process.env.DB);
