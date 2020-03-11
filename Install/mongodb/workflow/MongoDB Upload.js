const Binary = require('mongodb').Binary;

// global context
context = {};

async function run() {
  // initialize
  await initialize();

  // get uploaded filestream
  context.file = await fileContent();

  // save to mongo db
  let data = { _id: ObjectID(context.data._id) };
  data[context.config.column] = new Binary(context.file.contents);
  await context.ds.update(context.config.collection, data)

  return [context.file.filename];
}

///
async function initialize() {
	// get configuration
	context.config = res.locals.configuration;
	if (!context.config) {
		throw new Error('No Configuration Specified');
	}

	// convert to json object
	context.config = jsonic(context.config);
	if (!obj.get(context, 'config.collection')) {
		throw new Error('No Collection Specified');
  }
  if (!obj.get(context, 'config.column')) {
		throw new Error('No column Specified');
	}

	// retrieve questring and form values
  context.data = Object.assign({}, req.query, req.body);

  // check if _id is passed
  if(!context.data._id) {
    throw new Error('_id missing');
  }

	// retrieve data service
	context.ds = res.locals.ds;
	if (!context.ds) {
		throw new Error('No data service initialized');
	}

	// connect to database
	await context.ds.connect();
}


async function fileContent() {
  return new Promise(function(resolve, reject) {
    let _filename;
    var MemoryStream = require("memorystream");
    var memStream = new MemoryStream(null, { readable: false });

    req.busboy.on("file", function(
      fieldname,
      file,
      filename,
      encoding,
      mimetype
    ) {
      // save filename
      _filename = filename;

      // write to the memory buffer
      file.pipe(memStream);
    });

    req.busboy.on("finish", function() {
      resolve({
        filename: _filename,
        contents: Buffer.concat(memStream.queue)
      });
    });

    req.pipe(req.busboy);
  });
}

//
run();
