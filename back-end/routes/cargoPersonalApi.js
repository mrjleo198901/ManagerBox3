
var express = require('express');
var router = express.Router();

var TipoProducto = require('../models/cargo_personal');

TipoProducto.methods(['get', 'put', 'post', 'delete', 'search']);
TipoProducto.register(router, '/cargo_personal');

module.exports = router;