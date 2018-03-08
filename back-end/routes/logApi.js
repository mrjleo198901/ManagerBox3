
var express= require('express');
var router= express.Router();

var Log = require('../models/log');

Log.methods(['get','put','post','delete','search']);
Log.register(router,'/log');

module.exports=router;