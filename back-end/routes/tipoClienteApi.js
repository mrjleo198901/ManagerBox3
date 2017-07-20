
var express= require('express');
var router= express.Router();

var TipoCliente = require('../models/tipo_cliente');

TipoCliente.methods(['get','put','post','delete','search']);
TipoCliente.register(router,'/tipo_cliente');

module.exports=router;