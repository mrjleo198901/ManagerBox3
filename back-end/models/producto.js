var restful = require("node-restful");
var mongoose = restful.mongoose;

var productoSchema = new mongoose.Schema({

    precio_unitario : Number,
    utilidad : Number,
    cant_existente: Number,
    subproductoV : Array,

    id_tipo_producto: mongoose.Schema.Types.ObjectId

}); 

module.exports= restful.model('producto',productoSchema);