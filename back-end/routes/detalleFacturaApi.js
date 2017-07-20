
var express= require('express');
var router= express.Router();

var DetalleFactura = require('../models/detalle_factura');

DetalleFactura.methods(['get','put','post','delete','search']);
DetalleFactura.register(router,'/detalle_factura');

module.exports=router;