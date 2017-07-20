
var express= require('express');
var router= express.Router();

var TipoPromocion = require('../models/tipo_promocion');

TipoPromocion.methods(['get','put','post','delete','search']);
TipoPromocion.register(router,'/tipo_promocion');

module.exports=router;