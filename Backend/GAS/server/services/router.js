function resolveNavigation(context) {
  // context.req must exist to process
  if(!context || !context.req) return;
  
  // api
  if(context.req.queryString.startsWith("/api")) {
    api(context);
  }
  
  // index.js
  else {
    // return index.js script
    indexJS(context);    
  }
}


//////////////////
function indexJS(context) {
  // load from Core.company
  let db = connectDB("Core");
  let company = find(db, "company")
  
  let config = {
    host: ScriptApp.getService().getUrl(),
    ...company[0]
  }
  
  context.res = `window.__CONFIG__ = ${JSON.stringify(config)}`
}


//////////////////
function loginScreen(context) {
}

function navigation(context) {
}

function uiElement(context) {
}
