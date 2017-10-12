var restful = require("node-restful");
var mongoose = restful.mongoose;

var activeCardsSchema = new mongoose.Schema({

    idFactura: mongoose.Schema.Types.ObjectId,
    ci: String,
    cardNumber: String

});

module.exports = restful.model('active_cards', activeCardsSchema);