
var express= require('express');
var router= express.Router();

var Factura = require('../models/factura');

Factura.methods(['get','put','post','delete','search']);
Factura.register(router,'/factura');

module.exports=router;