var restful = require("node-restful");
var mongoose = restful.mongoose;

var tarjetaSchema = new mongoose.Schema({
    cedula: String,
    nombre: String,
    apellido: String,
    numero: String,
    limite: Number,
    descripcion: String,
    tipo: String
});

module.exports = restful.model('tarjeta', tarjetaSchema);