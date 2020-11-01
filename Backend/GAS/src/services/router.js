function route(e) {
	// api
	if (e && e.queryString && e.queryString.startsWith('api')) {
		return apiProcess(e);
	}

	return pageProcess(e);
}
