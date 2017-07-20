var restful = require("node-restful");
var mongoose = restful.mongoose;

var promocionesSchema = new mongoose.Schema({

    descuento : Number,
    cantidad : Number,
    sexo : String,

    id_tipo_promocion: mongoose.Schema.Types.ObjectId

}); 

module.exports= restful.model('promociones',promocionesSchema);