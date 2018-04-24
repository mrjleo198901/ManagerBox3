var restful = require("node-restful");
var mongoose = restful.mongoose;

var subSchema = new mongoose.Schema({
   
    precio_compra: String,
    total: String,
    descripcion: String,
    cantidad: String,
    fecha: Date,
    contenido: String,
    unidadMedida: String,
    promocion: String //Inicialmente solo se admitiran descuentas v1
}, { _id: false });

var comprasSchema = new mongoose.Schema({

    num_factura: String,
    fecha: String,
    proveedor: mongoose.Schema.Types.ObjectId,
    formaPago: Array,
    total: String,
    descuento: String,

    detalleFacturaC: [subSchema],
    vendedor: mongoose.Schema.Types.ObjectId,

});

module.exports = restful.model('compras', comprasSchema);