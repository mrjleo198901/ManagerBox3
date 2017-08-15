
var fs = require('fs-extra');
var path = require('path');

module.exports.updatePhoto = function (req, res) {

    var file = req.files.uploadFile;
    var uploadDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(":", "_").replace(":", "_")
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../uploads/" + uploadDate + " " + file.originalFilename);
    var savePath = "/uploads/" + uploadDate + file.originalFilename;
    fs.copy(tempPath, targetPath, function (err) {
        if (err) {
            console.log("Erroreee: " + err)
        } else {
            res.json(savePath);
        }
    })
};