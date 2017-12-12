var express = require('express');
var router = express.Router();

var activeCards = require('../models/caja');

activeCards.methods(['get', 'put', 'post', 'delete', 'search']);
activeCards.register(router, '/caja');

module.exports = router;