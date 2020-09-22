const cron = require("node-cron");
const task = require("./task");

/*
cron.schedule('* * * * *', async () => {
  task.run(process.env.HOST, process.env.TOKEN)
})
*/
console.log(process.env.HOST);
console.log(process.env.TOKEN);
console.log(process.env.COMPANY_ID);

(async () => {
  try {
    await task.run(process.env.HOST, process.env.COMPANY_ID, process.env.TOKEN)
  } catch(ex) {
    console.log(ex)
  }
})()
