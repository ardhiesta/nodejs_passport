var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('halaman students');
});

router.get('/add', function(req, res, next) {
  res.send('halaman add students');
});

module.exports = router;