var Service = require('node-windows').Service;

// Create a new service object
// Create a new service object
var svc = new Service({
  name: "YesBut Task Scheduler",  
  script: `${__dirname}\\task.js`
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();