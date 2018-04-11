var restful = require("node-restful");
var mongoose = restful.mongoose;


var subSchema = mongoose.Schema({
    vendedor: mongoose.Schema.Types.ObjectId,
    precio_venta: String,
    total: String,
    descripcion: String,
    cantidad: String,
    fecha: Date,
    promocion: Array
}, { _id: false });

var facturaSchema = new mongoose.Schema({
    cedula: String,
    num_factura: String,
    num_autorizacion: String,
    ruc: String,
    nombre: String,
    telefono: String,
    direccion: String,
    fecha_emision: Date,
    //detalleFacturaV: Array,
    detalleFacturaV: [subSchema],
    formaPago: Array,
    cajero: mongoose.Schema.Types.ObjectId
});

module.exports = restful.model('factura', facturaSchema);