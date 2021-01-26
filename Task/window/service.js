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

var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Hello World',
  description: 'The nodejs.org example web server.',
  script: 'C:\\path\\to\\helloworld.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();