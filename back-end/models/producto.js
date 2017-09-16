var restful = require("node-restful");
var mongoose = restful.mongoose;

var productoSchema = new mongoose.Schema({

    nombre: String,
    precio_costo: Number,
    precio_venta: Number,
    utilidad: Number,
    cant_existente: Number,
    subproductoV: Array,
    id_tipo_producto: mongoose.Schema.Types.ObjectId,
    path: String,
    contenido: Number

});

module.exports = restful.model('producto', productoSchema);