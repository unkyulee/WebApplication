function doGet(e) {

  // save context
  var context = {
    req: e
  };

  // route navigation
  route(context);

  // debug
  return HtmlService.createHtmlOutput(`<pre>${JSON.stringify(context, null, 4)}</pre>`);

  // production
  // return ContentService.createTextOutput(context.res);
}
