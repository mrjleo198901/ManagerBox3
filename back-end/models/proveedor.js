var restful = require("node-restful");
var mongoose = restful.mongoose;

var proveedorSchema = new mongoose.Schema({

    nombre_proveedor : String,
    ruc : String,
    direccion: String,
    ciudad: String,
    telefono: String,
    correo : String,
    comprasV: Array

}); 

module.exports= restful.model('proveedor',proveedorSchema);