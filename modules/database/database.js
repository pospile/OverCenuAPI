var product = require("./product.js");
var category = require("./category.js");
var metadata = require("./metadata.js");



exports.CreateProduct = function (name, id, category, path, user_id, callback) {
	product.CreateProduct(name, id, category, path, user_id, callback);
	metadata.IncreaseProductCount();
};
exports.SearchById = function (id, callback) {
	product.FindByID(id, callback);
};

exports.CreateCategory = function (name, callback) {
	metadata.GetMetadata(function (data) {
		category.CreateCategory(data.category_count, name, callback);
		metadata.IncreaseCategoryCount();
	})
};
exports.FindByID = function (id, callback) {
	category.FindByID(id, callback);
};