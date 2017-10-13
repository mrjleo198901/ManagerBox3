var restful = require("node-restful");
var mongoose = restful.mongoose;

var activeCardsSchema = new mongoose.Schema({

    idFactura: mongoose.Schema.Types.ObjectId,
    ci: String,
    nombre: String,
    cardNumber: String,
    cantMujeres: Number,
    cantHombres: Number,
    egresoMujeres: Number,
    egresoHombres: Number

});

module.exports = restful.model('active_cards', activeCardsSchema);