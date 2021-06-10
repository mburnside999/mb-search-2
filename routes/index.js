var express = require('express');
const { render } = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //res.redirect('/kbsearch');
});

module.exports = router;
