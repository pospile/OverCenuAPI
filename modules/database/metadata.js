var metadata;


var GetMetadata = function () {
	metadata = require("./metadata.json");
};

GetMetadata();

var IncreaseProductCount = function () {
	metadata.product_count += 1;
};

var IncreaseCategoryCount = function () {
	metadata.category_count += 1;
};

var SaveMetadata = function () {
	 var fs = require('fs');
	 fs.writeFile("metadata.json", JSON.stringify(data), function(err) {
	 if(err) {
	 return console.log(err);
	 }
	 console.log("Metadata saved succesfully.");
	 });
}


exports.GetMetadata = function (callback) {
	callback(metadata);
};
exports.IncreaseProductCount = function () {
	IncreaseProductCount();
	SaveMetadata();
};
exports.IncreaseCategoryCount = function () {
	IncreaseCategoryCount();
	SaveMetadata();
};