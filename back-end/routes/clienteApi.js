
var express= require('express');
var passport = require('passport');
//const jwt = require('jsonwebtoken');
var router= express.Router();

var Clientes = require('../models/cliente');

Clientes.methods(['get','put','post','delete','search'] );

Clientes.register(router,'/cliente');

module.exports=router;