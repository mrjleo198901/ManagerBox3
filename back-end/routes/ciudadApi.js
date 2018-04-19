var express= require('express');
var passport = require('passport');

var router= express.Router();

var Ciudad = require('../models/ciudad');

Ciudad.methods(['get','put','post','delete','search'] );

Ciudad.register(router,'/ciudad');

module.exports=router;