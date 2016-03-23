var db = require('orchestrate')("6c4cda6a-17f3-4e29-90b6-2d0ad15fb146");



var CreateCategory = function (id, name, callback) {
	console.log("Creating category: " + name);
	db.post('category', {
		"id": id,
		"name": name
	})
		.then(function (result) {
			callback(result);
		})
		.fail(function (err) {
			callback(err);
		})
}

var FindByID = function (id, callback) {
	db.newSearchBuilder("category")
		.limit(1)
		.query('value.id:'+id)
		.then(function (res) {
			callback(res.body);
		});
}

exports.CreateCategory = function (id, name, callback) {
	CreateCategory(id, name, callback);
}
exports.FindByID = function (id, callback) {
	FindByID(id, callback);
}