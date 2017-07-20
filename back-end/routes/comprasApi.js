
var express= require('express');
var router= express.Router();

var Compras = require('../models/compras');

Compras.methods(['get','put','post','delete','search']);
Compras.register(router,'/compras');

module.exports=router;