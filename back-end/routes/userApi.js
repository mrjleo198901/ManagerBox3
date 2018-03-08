var express = require('express');
var passport = require('passport');
//const jwt = require('jsonwebtoken');
var router = express.Router();

var User = require('../models/userRF');

User.methods(['get', 'put', 'post', 'delete', 'search']);

User.register(router, '/userRF');

module.exports = router;