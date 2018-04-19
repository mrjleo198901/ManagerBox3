var restful = require("node-restful");
var mongoose = restful.mongoose;

var proveedorSchema = new mongoose.Schema({

    nombre_proveedor: String,
    ruc: String,
    direccion: String,
    ciudad: Object,
    telefono: String,
    correo: String,
    comprasV: Array,
    representanteV: Array

});

module.exports = restful.model('proveedor', proveedorSchema);