function apiProcess(e) {
	// load from Core.company
	let data = sheetData('appointment');

  // insert a row in appointment
  sheetInsert("appointment", {
    appointment_date: new Date(),
    appointment_end_date: moment().add(1, 'hours').toDate(),
    assignee: "John",
    title: "Test Insert"
  })

	return HtmlService.createHtmlOutput(`<pre>${JSON.stringify(data, null, 4)}</pre>`);
}
