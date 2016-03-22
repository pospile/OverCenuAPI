var Xray = require('x-ray');
var x = Xray();


var skrap = function (callback) {
	x('http://www.akcniceny.cz/zbozi/hledej/sk-potraviny/p/1', {
		urls: x('.zboziVypis', [{
			url: '.zboziImg@href'
		}])
	})(function(err, obj) {
		console.log(err);
		console.log(obj);

		obj.urls.forEach(function (data) {
			skrap_detail(data.url, function (product) {
				console.log(product);
			});
		})

	})
};

var skrap_detail = function (url, callback) {
	x(url, {
		product: x('.zboziDetail', [{
			name: '.infoBox h2',
			image: '.in img@src',
			seller: '.prodejnaName span'
		}])
	})(function(err, obj) {
		console.log(obj);
	})
}

exports.skrap = function (callback) {
	skrap(callback);
};
