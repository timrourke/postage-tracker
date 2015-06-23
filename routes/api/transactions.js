var express = require('express');
var router = express.Router();

var Transaction = require('./../../models/transaction');

router.get('/', function(req, res) {

	Transaction.find({}).exec(function(err, transactions) {

		if (err) {
			console.log('db error in GET /transactions/ :' + err);
			res.send(err); 
		} else if (!transactions) {
			res.status(404).json({
				message: 'No transactions can not be found.'
			}); //TODO: confgure angular to respond with 404
		} else {
			res.json(transactions);
		}

	});

});

router.post('/', function(req, res) {

	Transaction.create({

		date: req.body.date,
		jobNumber: req.body.jobNumber,
		description: req.body.description,
		salesRep: req.body.salesRep,
		numPieces: req.body.numPieces,
		amount: req.body.amount

	}, function(err, transaction) {

		if (err) { 
			res.json(err); 
		} else {
			res.json(transaction);
		}
		
	});

});

router.get('/:id', function(req, res) {

	console.log(req.params.id);

	Transaction.findById(req.params.id).exec(function(err, transaction) {
		
		if (err) { 
			console.log('db error in GET /transactions/' + req.params.id + ' : ' + err);
			res.json(err); 
		} else if (!transaction) {
			res.status(404).json({
				message: 'Transaction with id ' + id + ' can not be found.'
			}); //TODO: confgure angular to respond with 404
		} else if (transaction) {
			res.json(transaction);
		}
	});

});

router.put('/:id', function(req, res) {

	Transaction.findById(req.params.id).exec(function(err, transaction) {
		
		if (err) { 
			console.log('db error in PUT /transactions/' + req.params.id + ' : ' + err);
			res.send(err); 
		} else if (!transaction) {
			res.status(404).json({
				message: 'Transaction with id ' + id + ' can not be found.'
			}); //TODO: confgure angular to respond with 404
		} else if (transaction) {
			
			transaction.update(req.body, function(err, transaction) {
				if (err) {
					console.log('db error in updating record from PUT /transactions/' + req.params.id + ' : ' + err);
					res.send(err);
				} else {
					res.json(transaction);		
				}
			})
			
		}
	});

});

router.delete('/:id', function(req, res) {

	Transaction.findByIdAndRemove(req.params.id, function(err, transaction) {
		if (err) {
			console.log('db error in DELETE /transactions/' + req.params.id + ' : ' + err);
			res.send(err);
		} else if (!transaction) {
			res.status(404).json({
				message: 'Transaction with id ' + id + ' can not be found.'
			}); //TODO: confgure angular to respond with 404
		} else {
			res.json(transaction);		
		}
	});

});

module.exports = router;