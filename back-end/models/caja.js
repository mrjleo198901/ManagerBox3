var restful = require("node-restful");
var mongoose = restful.mongoose;

var cajaSchema = new mongoose.Schema({

    idUser: mongoose.Schema.Types.ObjectId,
    montoInicial: String,
    montoFinal: String,
    fecha: String

});

module.exports = restful.model('caja', cajaSchema);