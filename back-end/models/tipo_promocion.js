var restful = require("node-restful");
var mongoose = restful.mongoose;

var tipoPromocionSchema = new mongoose.Schema({

    desc_tipo_promocion: String

});

module.exports = restful.model('tipo_promocion', tipoPromocionSchema);