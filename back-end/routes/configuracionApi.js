
var express= require('express');
var router= express.Router();

var Configuracion = require('../models/configuracion');

Configuracion.methods(['get','put','post','delete','search']);
Configuracion.register(router,'/configuracion');

module.exports=router;