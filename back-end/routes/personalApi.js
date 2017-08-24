
var express= require('express');
var passport = require('passport');
//const jwt = require('jsonwebtoken');
var router= express.Router();

var Personal = require('../models/personal');

Personal.methods(['get','put','post','delete','search'] );

Personal.register(router,'/personal');

module.exports=router;