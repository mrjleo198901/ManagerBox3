
var express= require('express');
var passport = require('passport');
var router= express.Router();

var Clientes = require('../models/tarjeta');

Clientes.methods(['get','put','post','delete','search'] );

Clientes.register(router,'/tarjeta');

module.exports=router;