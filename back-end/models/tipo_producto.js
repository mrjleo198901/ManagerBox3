var restful = require("node-restful");
var mongoose = restful.mongoose;

var tipoProductoSchema = new mongoose.Schema({

    desc_tipo_producto: String

});

module.exports = restful.model('tipo_producto', tipoProductoSchema);