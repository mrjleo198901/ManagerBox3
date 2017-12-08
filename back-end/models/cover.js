var restful = require("node-restful");
var mongoose = restful.mongoose;

var coverSchema = new mongoose.Schema({

    nombre: String,
    numMujeres: String,
    precioMujeres: String,
    productoMujeres: Object,
    cantProdMujeres: String,
    numHombres: String,
    precioHombres: String,
    productoHombres: Object,
    cantProdHombres: String

});

module.exports = restful.model('cover', coverSchema);