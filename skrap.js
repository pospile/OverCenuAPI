console.log("Preparing for gathering resources");
var akcniceny = require("./modules/skrapes/akcniceny.js");

akcniceny.skrap(function (data) {
	var fs = require('fs');
	fs.writeFile("database.json", JSON.stringify(data), function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});
});