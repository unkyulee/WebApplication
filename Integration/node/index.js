
// main context
let context = {}

// create eventEmitter
const EventEmitter = require('./lib/EventEmitterAsync');
context.event = new EventEmitter()
context.timeout = ms => new Promise(res => setTimeout(res, ms))

// workflow manager
const Workflow = require('./workflows/workflow')
let wp = new Workflow(context);

// load package
let filepath = 'index.json'
if(process.argv.length > 2) filepath = process.argv[2]
wp.start(filepath)
