var express = require('express');
var router = express.Router();
var fs = require('fs');

var svgIconDefs;

fs.readFile('./public/svg/defs/svg/sprite.defs.svg', 'utf8', function(err, data) {
	svgIconDefs = data;
});

// GET home page with angular view
// This is loaded only after API routes are configured, because this route
// is a catch-all for any browser page request. Navigation in the browser
// should occur exclusively in Angular.
router.get('*', function(req, res) {
	res.render('index', { svgIconDefs: svgIconDefs });
});

module.exports = router;