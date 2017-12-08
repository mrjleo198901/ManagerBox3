
var express= require('express');
var passport = require('passport');
//const jwt = require('jsonwebtoken');
var router= express.Router();

var Cover = require('../models/cover');

Cover.methods(['get','put','post','delete','search'] );

Cover.register(router,'/Cover');

module.exports=router;