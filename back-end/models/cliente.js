var restful = require("node-restful");
var mongoose = restful.mongoose;

var clienteSchema = new mongoose.Schema({

    cedula: String,
    nombre: String,
    apellido: String,
    tarjeta: Number,
    telefono: String,
    correo: String,
    fecha_nacimiento: Date,
    sexo: String,

    id_tipo_clienteV: Array

});

module.exports = restful.model('cliente', clienteSchema);