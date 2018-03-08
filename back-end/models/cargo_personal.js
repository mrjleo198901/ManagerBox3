var restful = require("node-restful");
var mongoose = restful.mongoose;

var cargoPersonalSchema = new mongoose.Schema({

    descripcion_cargo_personal: String,
    id_estado: String,
    descripcion: String

});

module.exports = restful.model('cargo_personal', cargoPersonalSchema);