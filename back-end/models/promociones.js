var restful = require("node-restful");
var mongoose = restful.mongoose;

var promocionesSchema = new mongoose.Schema({

    nombre: String,
    producto: String,
    desde: Number,
    hasta: Number,
    precio_promo: Number

});

module.exports = restful.model('promociones', promocionesSchema);