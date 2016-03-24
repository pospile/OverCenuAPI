var db = require('orchestrate')("6c4cda6a-17f3-4e29-90b6-2d0ad15fb146");
var dateFormat = require('dateformat');

var CreateProduct = function (name, id, category, path, user_id, price, discount, oldprice, seller, callback) {
	var now = new Date();
	db.post('product', {
		//type: img/vid
		"category": category,
		"id": id,
		"name": name,
		"date": dateFormat(now, "dd.mm.yyyy"),
		"time": dateFormat(now, "HH:MM"),
		"url": path,
		"user": user_id,
		"price": price,
		"discount": discount,
		"old_price": oldprice,
		"seller": seller,
		"barcode": []
	})
		.then(function (result) {
			callback(result);
		})
		.fail(function (err) {
			callback(err);
		})
}

var FindByID = function (id, callback) {
	db.newSearchBuilder("products")
		.limit(10)
		.query('value.id:'+id)
		.then(function (res) {
			callback(res.body);
		});
}

exports.CreateProduct = function(name, id, category, path, user_id, callback)
{
	CreateProduct(name, id, category,path, user_id, callback);
}
exports.FindByID = function (id, callback) {
	FindByID(id, callback);
}