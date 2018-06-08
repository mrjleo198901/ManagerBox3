var restful = require("node-restful");
var mongoose = restful.mongoose;

var subSchema = new mongoose.Schema({
    cantidad: String,
    fecha: Date,
    impuestos: [],
    pcUnitario: String,
    producto: [],
    total: String
}, { _id: false });

var comprasSchema = new mongoose.Schema({

    desglose: Array,
    fecha: Date,
    formaPago: Array,
    num_factura: String,
    productosV: [subSchema],
    proveedor: mongoose.Schema.Types.ObjectId,
    vendedor: mongoose.Schema.Types.ObjectId,
    total: String,

});

module.exports = restful.model('compras', comprasSchema);