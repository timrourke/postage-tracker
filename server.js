// server.js (Express 4.0)
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose	   = require('mongoose');
var favicon 	   = require('serve-favicon');
var ejs 		   = require('ejs');
var app            = express();

mongoose.connect('mongodb://localhost/postagetracker');
var db = mongoose.connection;

db.on('error', function(msg) {
	console.log('Mongoose connection error %s', msg);
});

db.once('open', function() {
	console.log('Mongoose connection established.');
});

// config api routes
var transactions = require('./routes/api/transactions');
var bankbalance = require('./routes/api/bankbalance');

// config index route to load angular view on all browser requests for page
var index = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser.urlencoded({ extended: false }))    // parse application/x-www-form-urlencoded
app.use(bodyParser.json())    // parse application/json
app.use(methodOverride(function(req, res){ // simulate DELETE and PUT
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));                

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users

app.use('/api/transactions', transactions);
app.use('/api/bankbalance', bankbalance);
app.use('/', index);

app.listen(8080);   
console.log('Magic happens on port 8080');          // shoutout to the user