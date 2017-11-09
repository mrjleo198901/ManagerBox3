
var fs = require('fs-extra');
var path = require('path');

module.exports.updatePhoto = function (req, res) {

    var file = req.files.uploadFile;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var uploadDate = (new Date(Date.now() - tzoffset)).toISOString().replace(/T/, 'H').replace(/\..+/, '').replace(":", "_").replace(":", "_")
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../../angular-src/src/assets/img/marcas/" + uploadDate + "-" + file.originalFilename);
    var savePath = "assets/img/marcas/" + uploadDate + "-" + file.originalFilename;

    fs.copy(tempPath, targetPath, function (err) {
        if (err) {
            console.log("Error: " + err)
        } else {
            res.json(savePath);
        }
    })
};