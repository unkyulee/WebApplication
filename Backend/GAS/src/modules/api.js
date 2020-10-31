function api(context) {
  // load from Core.company
  let db = connectDB("Core");
  let company = find(db, "company")
  
  context.res = company
}