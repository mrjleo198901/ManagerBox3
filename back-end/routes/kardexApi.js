var express = require('express');
var router = express.Router();

var kardex = require('../models/kardex');

kardex.methods(['get', 'put', 'post', 'delete', 'search']);
kardex.register(router, '/kardex');

module.exports = router;