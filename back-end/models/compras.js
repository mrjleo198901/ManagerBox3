var restful = require("node-restful");
var mongoose = restful.mongoose;

var comprasSchema = new mongoose.Schema({

    fecha : Date,
    cantidad : Number,
    desc_producto: String,
    total: Number

}); 

module.exports= restful.model('compras',comprasSchema);