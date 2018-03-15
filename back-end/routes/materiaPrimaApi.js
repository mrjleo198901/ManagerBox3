
var express = require('express');
var router = express.Router();

var materiaPrima = require('../models/materia_prima');

materiaPrima.methods(['get', 'put', 'post', 'delete', 'search']);
materiaPrima.register(router, '/materia_prima');

module.exports = router;