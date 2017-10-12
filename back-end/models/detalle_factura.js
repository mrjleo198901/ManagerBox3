var restful = require("node-restful");
var mongoose = restful.mongoose;

var detalleFacturaSchema = new mongoose.Schema({

    fecha: Date,
    cantidad: Number,
    desc_producto: String,
    total: Number,
    id_producto: mongoose.Schema.Types.ObjectId

});

module.exports = restful.model('detalle_factura', detalleFacturaSchema);