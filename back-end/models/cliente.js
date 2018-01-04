var restful = require("node-restful");
var mongoose = restful.mongoose;

var clienteSchema = new mongoose.Schema({

    cedula: String,
    nombre: String,
    apellido: String,
    telefono: String,
    correo: String,
    fecha_nacimiento: String,
    sexo: String,
    id_tipo_cliente: mongoose.Schema.Types.ObjectId

});

module.exports = restful.model('cliente', clienteSchema);