
var express = require('express');
var router = express.Router();

var TipoProducto = require('../models/tipo_producto');

TipoProducto.methods(['get', 'put', 'post', 'delete', 'search']);
TipoProducto.register(router, '/tipo_producto');

/*
router.post('/tipo_producto', (req, res, next) => {
    let newTipoProducto = new User({
        desc_tipo_producto: req.body.desc_tipo_producto
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to register user' });
        } else {
            res.json({ success: true, msg: 'User registered' });
        }
    });
});
*/

module.exports = router;