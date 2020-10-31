function doGet(e) {
  
  // save context
  var context = {
    req: e
  };  
  
  // resolve navigation
  resolveNavigation(context);
  
  //
  Logger.log(context);
  
  // debug
  return HtmlService.createHtmlOutput(`<pre>${JSON.stringify(context, null, 4)}</pre>`);
  
  // production
  // return ContentService.createTextOutput(context.res);    
}
