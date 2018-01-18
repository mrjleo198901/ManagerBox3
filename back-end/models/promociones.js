var restful = require("node-restful");
var mongoose = restful.mongoose;

var promocionesSchema = new mongoose.Schema({
    nombre: String,
    productosV: Array,
});

module.exports = restful.model('promociones', promocionesSchema);