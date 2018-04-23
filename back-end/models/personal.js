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
    id_cargo: String,
    modulosV: Array,
    estado:Boolean,
    permission:Array

});

module.exports = restful.model('personal', personalSchema);