var restful = require("node-restful");
var mongoose = restful.mongoose;

var personalSchema = new mongoose.Schema({

    cedula: String,
    nombres: String,
    apellidos: String,
    fecha_nacimiento: String,
    sexo: String,
    telefono: String,
    email: String,
    id_cargo: String

});

module.exports = restful.model('personal', personalSchema);