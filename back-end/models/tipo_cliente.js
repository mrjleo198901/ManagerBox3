var restful = require("node-restful");
var mongoose = restful.mongoose;

var tipoClienteSchema = new mongoose.Schema({

    nombre_producto: String,
    precio_venta_normal: String,
    tipoClienteV: Array
    
});

module.exports = restful.model('tipo_cliente', tipoClienteSchema);