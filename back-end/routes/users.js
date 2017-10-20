const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const emailjs = require('emailjs/email');
const bcrypt = require('bcryptjs');

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'No se pudo registrar este usuario! ' + err });
        } else {
            res.json({ success: true, msg: 'Usuario Registrado!' });
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'Usuario no encontrado!' });
        }
        console.log(user)
        User.comparePass(password, user.password, (err, isMatch) => {

            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //1 semana
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        password: user.password
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Contraseña incorrecta!' });
            }
        })
    })
});

//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

//Send Email
router.post('/sendmail', (req, res, next) => {
    var sujeto = req.body.username.toUpperCase();
    var server = emailjs.server.connect({
        user: "mrjleo1989@gmail.com",
        password: "00000889",
        host: "smtp.gmail.com",
        ssl: true,
        port: 465
    });

    server.send({
        text: "",
        from: "ManagerBox App <managerbox@riobytes.com>",
        to: req.body.email,
        subject: "Recuperación de contraseña",
        attachment:
        [
            { data: "<html>Estimado(a), " + sujeto + " </html>", alternative: true }
        ]
    }, function (err, message) {
        if (err)
            console.log(err);
        else
            res.json({ success: true, msg: 'sent' });
    });
});

//updateUser
router.post('/updateUser', (req, res, next) => {
    const username = req.body.username;
    const npass = req.body.npass;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'Usuario no encontrado!' });
        }
        user.password = npass;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                User.updateUserById(user, (err, user) => {
                    if (err) throw err;
                    if (user) {
                        return res.json({ success: true, msg: 'Cambio exitoso' });
                    }
                })
            });
        });
    })
})

module.exports = router;