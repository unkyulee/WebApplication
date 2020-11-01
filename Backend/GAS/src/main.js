function doGet(e) {
	// open db
	if(!e) e = {};
	e.DB = connectDB("DB");

	//
	e.method = 'get';

	// route navigation
	return route(e);
}
