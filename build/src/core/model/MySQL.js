"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getAllModel = exports.getModel = void 0;
var mysql_1 = __importDefault(require("mysql"));
var con = mysql_1["default"].createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_database'
});
con.connect(function (err) {
    if (err) {
        console.log('mysql connect fail');
    }
    else {
        console.log('mysql connect success');
    }
});
var MySQL = /** @class */ (function () {
    function MySQL() {
    }
    MySQL.prototype.count = function (table) {
        return new Promise(function (res, rej) {
            con.query("SELECT COUNT(*) as count FROM `" + table + "`", function (err, result) {
                if (err)
                    return res({ error: err });
                console.log(result === null || result === void 0 ? void 0 : result[0]);
                return res(result === null || result === void 0 ? void 0 : result[0]);
            });
        });
    };
    MySQL.prototype.find = function (table, limit, page) {
        if (limit === void 0) { limit = 20; }
        if (page === void 0) { page = 0; }
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM `" + table + "` LIMIT " + limit + " OFFSET " + page * limit, function (err, result, fields) {
                if (err)
                    return resolve({ error: err });
                return resolve({ data: result });
            });
        });
    };
    MySQL.prototype.findOne = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.findMany = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.insert = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.insertOne = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.insertMany = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.update = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.updateOne = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.updateMany = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype["delete"] = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.deleteOne = function () {
        throw new Error('Method not implemented.');
    };
    MySQL.prototype.deleteMany = function () {
        throw new Error('Method not implemented.');
    };
    return MySQL;
}());
exports["default"] = MySQL;
function getModel(name, fields) {
    if (fields === void 0) { fields = {}; }
    var ref = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        ref[_i - 2] = arguments[_i];
    }
}
exports.getModel = getModel;
function getAllModel() {
    // return _.instance;
    return {};
}
exports.getAllModel = getAllModel;
