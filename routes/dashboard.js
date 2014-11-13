var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');

router.get('/', stormpath.loginRequired, function(req, res) {
  res.render('dashboard', { title: 'Bandit Sign Boss', user: res.locals.user });
});

module.exports = router;
