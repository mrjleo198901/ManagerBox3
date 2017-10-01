var restful = require("node-restful");
var mongoose = restful.mongoose;

var productoSchema = new mongoose.Schema({

    nombre: String,
    precio_costo: String,
    precio_venta: String,
    utilidad: String,
    cant_existente: String,
    subproductoV: Array,
    id_tipo_producto: mongoose.Schema.Types.ObjectId,
    path: String,
    contenido: String,
    promocion: Array

});

module.exports = restful.model('producto', productoSchema);