var Xray = require('x-ray');
var x = Xray();

var database = require("../database/database.js");

var skrap = function (callback) {
	var product_id = 0;
	var category_id;
	database.CreateCategory("food", function (res) {
		//console.log(res);
		category_id = res.body.id;
		for (var i = 1; i < 400; i++)
		{
			x('http://www.akcniceny.cz/zbozi/hledej/sk-potraviny/p/' + i, {
				urls: x('.zboziVypis', [{
					url: '.zboziImg@href'
				}])
			})(function(err, obj) {
				if (err)
				{
					console.log(err);
				}

				obj.urls.forEach(function (data) {
					console.log(data.url);
					skrap_detail(data.url, false, function (product) {
						database.CreateProduct(product.product.name, product_id, category_id, product.product.image, 0, function () {
							//console.log(product);
						});
						product_id++;
					});
				});
			});
		}
	});
};

var skrap_detail = function (url, alternative, callback) {
	if (alternative)
	{
		x(url, {
			product: x('.zboziDetail', {
				name: '.infoBox h1',
				image: '.in img@src',
				seller: '.produkty a[itemprop="url"]@title',
				price: '.produkty tr[itemprop="offers"] .alCenter .price',
				sale: '.produkty tr[itemprop="offers"] .alCenter .discount'
			})
		})(function(err, obj) {
			obj.product.sale = obj.product.sale.split("-")[1];
			//console.log(obj);
			callback(obj);
		})
	}
	else
	{
		x(url, {
			product: x('.zboziDetail', {
				name: '.infoBox h2',
				image: '.in img@src',
				seller: '.prodejnaName span',
				price: '.akcniCena span[itemprop="price"]@content',
				old_price: '.puvCena .preskrt'
			})
		})(function(err, obj) {
			if (obj.product.name == undefined)
			{
				skrap_detail(url, true, callback);
				return;
			}
			else
			{
				//console.log(obj);
				callback(obj);
			}
		})
	}
}

exports.skrap = function (callback) {
	console.log("Loading skrap library");
	skrap(callback);
};
