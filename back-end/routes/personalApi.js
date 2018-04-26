
var express= require('express');
var passport = require('passport');
//const jwt = require('jsonwebtoken');
var router= express.Router();

var Personal = require('../models/personal');
var Cargo = require('../models/cargo_personal');

Personal.methods(['get','put','post','delete','search'] );

Personal.register(router,'/personal');


router.get('/personalJoinCargo', function (req, res) {
    var ci=req.param('cedula');
    console.log(ci);
    Personal.find({cedula:ci})
        .populate({
            path: 'id_cargo',
            model: Cargo
        })

        .exec(function (err, person) {
            if (err) return handleError(err);
         //   console.log(person);
            res.send(person)

        });



});

module.exports=router;