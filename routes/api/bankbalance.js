var express = require('express');
var router = express.Router();

var Bankbalance = require('./../../models/bankbalance');

router.get('/', function(req, res) {

	Bankbalance.find({}).exec(function(err, bankbalance) {

		if (err) {
			console.log('db error in GET /balance/ :' + err);
			res.send(err); 
		} else if (!bankbalance) {
			res.status(404).json({
				message: 'No bank balance can not be found.'
			}); //TODO: confgure angular to respond with 404
		} else {
			console.log(bankbalance);
			res.json(bankbalance);
		}

	})

});

router.post('/', function(req, res) {

	Bankbalance.find({}).exec(function(err, bankbalance) {

		if (err) {
			res.json(err);
		} else if (!bankbalance) {
			//If there is no bank balance, let's create one
			Bankbalance.create({

				balance: req.body.balance

			}, function(err, bankbalance) {

				if (err) { 
					res.json(err); 
				} else {
					res.json(bankbalance);
				}
				
			});
		} else if (bankbalance) {
			//If a bankbalance has already been set, don't create new balance, just update existing

			console.log(bankbalance);

			bankbalance[0].balance = req.body.balance;

			bankbalance[0].save(function(err) {
				if (err) { 
					res.json(err); 
				} else {
					res.json(bankbalance);
				}
			})

		}

	});

});

module.exports = router;