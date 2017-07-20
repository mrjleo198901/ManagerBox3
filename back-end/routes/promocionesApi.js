
var express= require('express');
var router= express.Router();

var Promociones = require('../models/promociones');

Promociones.methods(['get','put','post','delete','search']);
Promociones.register(router,'/promociones');

module.exports=router;