var restful = require("node-restful");
var mongoose = restful.mongoose;

var kardexSchema = new mongoose.Schema({

    fecha: Date,
    concepto: String,
    empresa: String,
    unidades: String,
    balance: String,
    precio: String

});

module.exports = restful.model('kardex', kardexSchema);