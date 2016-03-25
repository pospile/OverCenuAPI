var Xray = require('x-ray');
var x = Xray();

var database = require("../database/database.js");

var skrap = function (callback) {
	var product_id = 0;
	var category_id;
	database.CreateCategory("food", function (data) {
		//console.log(data);
		category_id = data;
		for (var i = 1; i < 292; i++)
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
						var product = product.product;
						if (product.alt)
						{
							// Výpoèet staré ceny z procenta
							// (cena / %) * 100
							product.price = parseFloat(product.price);
							product.sale = parseFloat(product.sale);
							product.old_price = (product.price / product.sale) * 100;
						}
						else
						{
							product.price = parseFloat(product.price);
							product.old_price = parseFloat(product.old_price);
							// Výpoèet procenta z cen
							product.sale = product.price / product.old_price * 100;
						}
						//console.log(product);


						database.CreateProduct(product.name, product_id, category_id, product.image, 0,product.price,product.sale, product.old_price, product.seller, function () {
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
			obj.product.sale = obj.product.sale.split("-")[1].split("%")[0];
			obj.product.alt = true;
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
				obj.product.alt = false;
				callback(obj);
			}
		})
	}
}

exports.skrap = function (callback) {
	console.log("Loading skrap library");
	skrap(callback);
};
