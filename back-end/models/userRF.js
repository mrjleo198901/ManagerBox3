var restful = require("node-restful");
var mongoose = restful.mongoose;

//User schema
var UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


module.exports = restful.model('userRF', UserSchema);