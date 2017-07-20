var restful = require("node-restful");
var mongoose = restful.mongoose;

var tipoClienteSchema = new mongoose.Schema({

    desc_tipo_cliente: String

});

module.exports = restful.model('tipo_cliente', tipoClienteSchema);