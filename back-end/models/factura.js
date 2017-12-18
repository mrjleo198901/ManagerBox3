var restful = require("node-restful");
var mongoose = restful.mongoose;

var facturaSchema = new mongoose.Schema({

    cedula: String,
    num_factura: String,
    num_autorizacion: String,
    ruc: String,
    nombre: String,
    telefono: String,
    direccion: String,
    detalleFacturaV: Array,
    formaPago: String,
    cajero: mongoose.Schema.Types.ObjectId

});

module.exports = restful.model('factura', facturaSchema);