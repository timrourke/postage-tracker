var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var balanceSchema = new Schema({
	balance: { type: Number, required: true }
});

var Balance = mongoose.model('Bankbalance', balanceSchema);

module.exports = Balance;