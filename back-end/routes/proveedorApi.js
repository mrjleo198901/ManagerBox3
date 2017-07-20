
var express= require('express');
var router= express.Router();

var Proveedor = require('../models/proveedor');

Proveedor.methods(['get','put','post','delete','search']);
Proveedor.register(router,'/proveedor');

module.exports=router;