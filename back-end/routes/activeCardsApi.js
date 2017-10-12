var express = require('express');
var router = express.Router();

var activeCards = require('../models/active_cards');

activeCards.methods(['get', 'put', 'post', 'delete', 'search']);
activeCards.register(router, '/active_cards');

module.exports = router;