var restful = require("node-restful");
var mongoose = restful.mongoose;

var cajaSchema = new mongoose.Schema({

    idUser: mongoose.Schema.Types.ObjectId,
    montoO: String,
    montoF: String,
    fechaO: String,
    fechaF: String

});

module.exports = restful.model('caja', cajaSchema);