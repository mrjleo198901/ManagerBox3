var restful = require("node-restful");
var mongoose = restful.mongoose;

var coverSchema = new mongoose.Schema({

    nombre: String,

    numMujeres: String,
    productoMujeres: Array,
    precioMujeres: String,
    numHombres: String,
    productoHombres: Array,
    precioHombres: String

});

module.exports = restful.model('cover', coverSchema);