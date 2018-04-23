'use strict'
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multer = require('multer');
var fs = require('fs');
var crypto = require("crypto");
var mime = require("mime");

const app = express();

//Connect to database
mongoose.connect(config.database);

//Port number
const port = 3000;
//const port = process.env.PORT || 8080;

//cors middleware
app.use(cors());
//set static folder
/*app.use(express.static(path.join(__dirname, 'public')));*/

//body-parser middleware
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//index route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
})
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/cargoPersonalApi'));
app.use('/api', require('./routes/clienteApi'));
app.use('/api', require('./routes/comprasApi'));
app.use('/api', require('./routes/configuracionApi'));
app.use('/api', require('./routes/detalleFacturaApi'));
app.use('/api', require('./routes/facturaApi'));
app.use('/api', require('./routes/logApi'));
app.use('/api', require('./routes/personalApi'));
app.use('/api', require('./routes/productoApi'));
app.use('/api', require('./routes/promocionesApi'));
app.use('/api', require('./routes/proveedorApi'));
app.use('/api', require('./routes/tipoClienteApi'));
app.use('/api', require('./routes/tipoProductoApi'));
app.use('/api', require('./routes/tipoPromocionApi'));
app.use('/api', require('./routes/tarjetaApi'));
app.use('/api', require('./routes/activeCardsApi'));
app.use('/api', require('./routes/coverApi'));
app.use('/api', require('./routes/cajaApi'));
app.use('/api', require('./routes/userApi'));
app.use('/api', require('./routes/materiaPrimaApi'));
app.use('/api', require('./routes/ciudadApi'));
app.use('/api', require('./routes/kardexApi'));

var profileController = require('./routes/uploadFiles');

app.use(multipartMiddleware);

app.use('/uploads', express.static(__dirname + "/uploads"));

app.post('/api/imagen', multipartMiddleware, profileController.updatePhoto);

app.post('/api/pdf', multipartMiddleware, profileController.updatePDFs);

//start server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});