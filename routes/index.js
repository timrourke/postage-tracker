var express = require('express');
var router = express.Router();

// GET home page with angular view
// This is loaded only after API routes are configured, because this route
// is a catch-all for any browser page request. Navigation in the browser
// should occur exclusively in Angular.
router.get('*', function(req, res) {
	res.sendFile(__dirname + './../public/index.html');
});

module.exports = router;