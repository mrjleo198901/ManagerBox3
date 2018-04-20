var restful = require("node-restful");
var mongoose = restful.mongoose;

var ciudadSchema = new mongoose.Schema({

    nombre: String,
    provincia: String
    
});

module.exports = restful.model('ciudad', ciudadSchema);