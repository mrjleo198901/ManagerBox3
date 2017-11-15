var restful = require("node-restful");
var mongoose = restful.mongoose;

var comprasSchema = new mongoose.Schema({

    cantidad: String,
    desc_producto: mongoose.Schema.Types.ObjectId,
    fecha: String,
    num_factura: String,
    proveedor: mongoose.Schema.Types.ObjectId,
    total: String,
    contenido: String

});

module.exports = restful.model('compras', comprasSchema);