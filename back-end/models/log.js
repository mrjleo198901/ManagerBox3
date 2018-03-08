var restful = require("node-restful");
var mongoose = restful.mongoose;

var logSchema = new mongoose.Schema({

    usuario: String,
    fecha: String,
    descripcion: String

});

module.exports = restful.model('log', logSchema);