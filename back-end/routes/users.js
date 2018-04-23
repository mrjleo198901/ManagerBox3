const express = require('express');
const passport = require('passport');
const router = express.Router();
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
        password: req.body.password,
        estado:req.body.estado
        
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
    var sujeto = req.body.name;
    var randomPass = req.body.npass;
    var username = req.body.username;
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
            {
                data: " <table cellpadding='0' cellspacing='0' style='padding:0;margin:0;border:0;width:500px'>"
                + "<tbody>"
                + "<tr>"
                + "<td colspan='2' style='vertical-align:bottom'><img border='0' src='https://lh3.googleusercontent.com/j2NtFJliuTc1f3WBKkqoF249CKQcmvutxR8mdnnSFOCVn_XNByfPTaazQdo8Uu2a_S7beezIESfXx4XruWh8QRbssUte1Rsq6SmybfQn2mNvqAHc5hN8eqtHSScmX-B0DqnZ92XY7ynL6bF2bNRdaKU69HIobonZ6dkfhtZcSMa7Towds206IENp97XU61R5atv9MpQmuyaIcT9lhQ03IjOpv0eJ4Wpbb-OaCioaBSFhBdd-UNfMqkOSHR11q9nvrUSq6TCjK4LL6TWsJJb_UyIrc0EMIpVQ5rOsk_s88PsiMeu5eJUwY3oMBg6jNCA2gGQYs6Zv0jPiIrZU4H2dAmzPo-i26micpoMi46z4RR2uzKgumWSEmytWhy0t6nsRTQAaKGCNYJj6I7krOzctMnOiwaJIGdAZhuSSHMEODoHJK_XbSzp-gasRbeYrzYbizI26NEQm4w8UThzJZRFCxbFjQ7DrtZMM6te3_gQKNdLlEtkmijLbcEc97ikNvOXfh75Nu7SMP7xFsiDo8UH8E3N9xeyJBIBe0CpGX3EYqb2MzhjcL-JMu02zhPeW2Xc6Ns8Ry_GqU1BDlRm2_hT-1ArcyqtaF5b2swXqP9o1qA=w1366-h199-no' style='width:120%' class='CToWUd'>"
                + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td>"
                + "<br>"
                + "<span style='font-family:calibri;font-size:14px'><strong>Estimado(a), " + sujeto + " </strong></span>"
                + "<br><br><span style='font-family:calibri;font-size:12px'>Tu antigua clave ha sido reseteada, se ha generado una nueva clave provisional con éxito.<br><b>Usuario: </b>" + username + "<br> <b>Contraseña: </b>" + randomPass + " "
                + "<br><br>Accede con estas credenciales al siguiente link <a href='http://localhost:4200/login' target='_blank' data-saferedirecturl='http://localhost:4200/login'>http://www.managerbox.riobytes.com/login</a> para completar el proceso."
                + "<br></span><br><br><span style='font-family:calibri;font-size:12px'>Recuerda que puedes cambiar esta clave accediendo a la opcion 'Mi perfil', en el menu principal.</span>"
                + "</td>"
                + "</tr>"
                + "<tr>"
                + "<td colspan='2'>"
                + "<p>"
                + "<img src='https://lh3.googleusercontent.com/FK5iAIqq7iEyblqGHwOpQNtl_vSI6RSsiow_FJ0LRaXaBpO4qMlhmjSG9CZ_mbDunTSQI8E8gSyd8HGCXDlWFlIsyU9BDQ1X6A5YS9-83ybXZGKECFcMfVxk_73994bhL2bKlbgIavMTZHDj_KWvXZBK_Vz0NLwZo7QQDeCWB2FYqNlzyxmkvKRwGYbJM4_NmQLhTSC3O_Qjv_5quUMuMDhYBv3qOW5nF9I56AfRtJfiyG0D7XLMGUOHCnMECCnlIo_oizEnNAa1ItDa5RAkGr9rBUJ-TEBlmbV7lRXijesEb22uH2nApGqjGjq67x9crWJ1ZgfwfYLkTkG0-1MeosoVkkp6i55lBxsPRWC36wyFCehWozuEceNWcrU3hLcCxSRLcfdiMg5vR9Iz3xyq_VvF7WXSQdphQwdFsRFSnvwpgXsvpUF9QOvPQ0hUOjSwcj9iRTbct68zR9A_uTFO1XWv93bQRS6y4nSgJADkElGGG0NMoVMvaCx0_kBLz02onYwBhXggpNkSuKywk-sw9r_oRZNmMTA15x4IJ4NgITvLoVgbPxA0UXa87ypCg2sx9CS6mFEexH4jCTYON-tE7aoPrwebAPYQhBgm7kJHVA=w1366-h199-no' style='width:120%' class='CToWUd'></p>"
                + "</td>"
                + "</tr>"
                + "</tbody>"
                + "</table>", alternative: true
            }
        ]
    }, function (err, message) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'not sent' });
        }
        else {
            res.json({ success: true, msg: 'sent' });
        }
    });
});

//Send Corte
router.post('/sendcorte', (req, res, next) => {
    var sujeto = req.body.name;
    var randomPass = req.body.npass;
    var username = req.body.username;
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
        subject: "Corte de Caja",
        attachment:
        [
            {
                data: "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'>" +
                "</head>" +
                "<body>" +
                "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>" +
                "<div style='text-align:center;background-color: #f5f5f5;'>" +
                "<h2 style='padding-top:70px; padding-bottom:70px'>Mundo Cocoa</h2>" +
                "</div>" +
                "<div style='text-align:center'>" +
                "<h3 style='color:#1F5DD1'>Corte de caja</h3>" +
                "<p><b>Desde: </b>12/12/2017 20:52:00 <b>Hasta:</b> 13/12/2017 02:49:13</p>" +
                "<p><b>Cajero: </b>" + username + "</p><br>" +
                "</div>" +
                "<div style='text-align:center'>" +
                "<h3 style='text-align:center;color:#1F5DD1'>Dinero en Caja</h3>" +
                "<div class='col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1'>" +
                "<table style='width: 70%;margin-left: 15%'>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd;' bgcolor='#f5f5f5'>Fondo de caja</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd;' bgcolor='#f5f5f5'>$450,00</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd;'>Ventas en efectivo</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd;'><p style='color:#3EAB1D'>+ $159,00</p></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd;' bgcolor='#f5f5f5'>Abonos</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd;' bgcolor='#f5f5f5'><p style='color:#3EAB1D'>+ $159,00</p></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd;'>Entradas</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd;'><p style='color:#3EAB1D'>+ $159,00</p></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd;' bgcolor='#f5f5f5'>Salidas</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd;' bgcolor='#f5f5f5'><p style='color:#EA2424'>+ $159,00</p></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd;'>Total esperado</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd;'><h4 style='color:#1F5DD1'>$159,00</h4></td>" +
                "</tr>" +
                "</table>" +
                "</div>" +
                "</div>" +
                "<div class='row'>" +
                "<h3 style='text-align:center;color:#1F5DD1'>Ventas</h3>" +
                "<div class='col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1'>" +
                "<table style='width: 70%;margin-left: 15%;'>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>Efectivo</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>$ 450,00</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd'>Cheque</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd'>$ 159,00</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>Tarjeta de crédito</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>$ 159,00</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd'>Crédito directo</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd'>$ 159,00</td>" +
                "</tr>" +
                "</table>" +
                "</div>" +
                "</div>" +
                "<div class='row'>" +
                "<h3 style='text-align:center;color:#1F5DD1'>Resúmen</h3>" +
                "<div class='col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1'>" +
                "<table style='width: 70%;margin-left: 15%;'>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>Ventas Totales</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'><h4 style='color:#1F5DD1'>$1020,00</h4></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd'>Ganancia</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd'>$ 159,00</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>Producto más vendido</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd' bgcolor='#f5f5f5'>Pilsener 350ml</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align:left;padding: 8px;border: 1px solid #dddddd'>Número total de ventas</td>" +
                "<td style='text-align: right;padding: 8px;border: 1px solid #dddddd'>850</td>" +
                "</tr>" +
                "</table>" +
                "</div>" +
                "</div>" +
                "<br>" +
                "<footer class='footer' style='position: absolute;width: 100%; background-color: #f5f5f5;'>" +
                "<div class='container' style='text-align:center;'><br>" +
                "<p>Generado por <a href='http://www.riobytes.com' target='_blank' data-saferedirecturl='http://www.riobytes.com'>© Managerbox</a> gestor de comercios. Versión 1.15</p>" +
                "<p class='text-muted' style='font-size:11px'>Si deseas dejar de recibir estos reportes, por favor desactiva el envío desde el módulo de Configuración.</p>" +
                "<p class='text-muted'>© Riobytes Solutions. Todos los derechos reservados 2018.</p>" +
                "<p class='text-muted'>Visita nuestro sitio, para más información <a href='http://localhost:4200/login' target='_blank' data-saferedirecturl='http://www.riobytes.com'>www.riobytes.com</a></p><br>" +
                "</div>" +
                "</footer>" +
                "</body>" +
                "</html>", alternative: true
            }
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

//getAll
router.get('/usersList', function (req, res) {
    User.find({}, function (err, users) {
        var userMap = {};

        users.forEach(function (user) {
            userMap[user._id] = user;
        });

        res.send(users);
    });
});

module.exports = router;