var restful = require("node-restful");
var mongoose = restful.mongoose;

var configuracionSchema = new mongoose.Schema({

    descripcion: String,
    valor: Number

});

module.exports = restful.model('configuracion', configuracionSchema);