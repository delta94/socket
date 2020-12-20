"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var Model_1 = require("../../../core/Model");
console.log('aaa');
function default_1(app, server) {
    app.use('admin', function (req, res, next) {
        // console.log(fs.existsSync(__dirname + '/views/index.html'))
        if (fs_1["default"].existsSync(__dirname + '/views' + req.path + '.html')) {
            console.log('pageview');
            return res.sendFile(__dirname + '/views' + req.path + '.html');
        }
        next();
        // res.sendFile(__dirname + '/views/index.html');
    });
    app.get('/get-uml-json', function (req, res) {
        var models = Model_1.getAllModel();
        var responseJson = {};
        for (var i in models) {
            responseJson[i] = models[i]._fields;
        }
        // res.json(JSON.parse(JSON.stringify(models['token'])))
        res.json(responseJson);
    });
    // app.get('/aaaa', function(req,res){
    //     res.json({a: 1});
    // })
}
exports["default"] = default_1;
