var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');
var dateFormat = require('dateformat');
var mime = require('mime');
var multer  = require('multer');
var upload = multer({ dest: '././uploads/' });
var log = require('single-line-log').stdout;
var Jimp = require("jimp");
var database = require('./database/database.js');
var fs = require('fs');

var accessed = 0;

var Start = function () {

	var app = express();
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use('/api/file', express.static('././uploads/converted'));

	console.log("\n");

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		/*console.log(req);*/
		next();
	});

	var port = process.env.port || 80;


	var server = app.listen(port, function () {

		require('./util.js').clear();
		var now = new Date();
		console.log('\n  DONE: OverCenu is running at http://localhost:'.magenta + colors.green(port) + "   " + colors.green(dateFormat(now, "dd.mm.yyyy - HH:MM:ss")));

	});

	app.use(function (req, res, next) {
		accessed += 1;
		var now = Date.now();
		console.log('  Time:', dateFormat(now, "dd.mm.yyyy - HH:MM:ss"), colors.green(req.originalUrl), accessed);
		next();
	});

	Api(app);

}


var Api = function (app) {

	app.get('/api/version', function(req, res) {
		res.json({"version": 0});
	});

	/*
	app.get('/api/update.apk', function(req, res) {
		res.setHeader("Content-Type", mime.lookup("/system.apk"));
		res.sendFile('/home/pi/projects/porngram2/system.apk');
	});
	*/

	app.get('/api/status', function (req, res) {
		res.json({"api": "ok"});
	});


	app.get('/api/product/:id', function (req, res) {
		console.log("Returning 5 post from page: " + req.params.id);
		database.SearchById(req.params.id, function (data) {
			res.json(data);
		});
	});


	app.post('/api/create', upload.single('photos'), function (req, res) {

		var name = req.body.name;
		var code = req.body.code;
		var category = req.body.category;
		var image = req.file;


		if (!name || !code || !category || !image)
		{
			res.json({"error": 1, "details": "data_error"});
		}

		var now = new Date();


		fs.rename(image.path, image.destination + "/converted/" + image.originalname, function (err) {
			if (!err){
				console.log(image.originalname);
				var resulted = new Jimp(image.destination + "/converted/" + image.originalname, function (err, result) {
					console.log(result.bitmap.width + " " + result.bitmap.height);
					if (result.bitmap.width > 4000){
						result.resize( 2048, Jimp.AUTO ).write(image.destination + "/converted/" + image.originalname);
					}
					else if (result.bitmap.height > 4000)
					{
						result.resize( Jimp.AUTO, 2048 ).write(image.destination + "/converted/" + image.originalname);
					}
				});
			}
			else
			{
				res.send(err);
			}
		});



		//TODO: Assign user_id to real user who created this article
		database.CreateProduct(name, code, category, "http://skrap.xyz/api/file/" + image.originalname, 0, function(data){
			res.send(now);
		});


	});

}


exports.Initialize = function () {
	console.log("Initialize process started");
	Start();
}