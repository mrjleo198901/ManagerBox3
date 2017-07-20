
var express= require('express');
var router= express.Router();

var Producto = require('../models/producto');

Producto.methods(['get','put','post','delete','search']);
Producto.register(router,'/producto');

module.exports=router;