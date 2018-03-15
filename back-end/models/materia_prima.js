var restful = require("node-restful");
var mongoose = restful.mongoose;

var materiaPrimaSchema = new mongoose.Schema({

    nombre: String,
    precio_costo: String,
    unidad_medida: String,
    contenido: String,
    cant_existente: String

});

module.exports = restful.model('materia_prima', materiaPrimaSchema);