
var express= require('express');
var router= express.Router();

var TipoProducto = require('../models/tipo_producto');

TipoProducto.methods(['get','put','post','delete','search']);
TipoProducto.register(router,'/tipo_producto');

module.exports=router;