var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
	date: { type: Date, required: true },
	jobNumber: Number,
	description: { type: String },
	salesRep: { type: String, uppercase: true },
	numPieces: { type: Number },
	amount: { type: Number, required: true }
});

var Transaction = mongoose.model('Transactions', transactionSchema);

module.exports = Transaction;