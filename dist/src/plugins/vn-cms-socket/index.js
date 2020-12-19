"use strict";
// import Chat from '../../Model/Chat.js';
// import Room from '../../Model/Room.js';
// import User from '../../Model/User.js';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Socket = require('socket.io');
var Hook = require('core/Hook');
var getModel = require('../../core/Model').getModel;
// setTimeout(async () => {
//     let [data, error] = await Chat.find()
//     console.log(data);
// }, 5000)
function init(express, server) {
    var io = Socket.listen(server);
    var users = {}, hosts = {};
    // function getCollection(name, host) {
    //     if (!(name in hosts[host].collections)) {
    //         hosts[host].collections[name] = ModelFlexible(name);
    //     }
    //     return hosts[host].collections[name];
    // }
    io.sockets.on('connection', function (socket) {
        var _this = this;
        socket.on('init', function (data) {
            console.log('user init');
            if (!(data.host in hosts)) {
                hosts[data.host] = {
                    collections: {},
                    users: {}
                };
            }
            if (!(data.uniqueId in users)) {
                users[data.uniqueId] = socket;
                socket.uniqueId = data.uniqueId;
            }
            socket.host = data.host;
            socket.join(data.host);
        });
        socket.on('push', function (data, callback) {
            var _this = this;
            var database = data.database;
            delete data.database;
            // data._id = Date.now();
            callback && callback(data);
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var collection, _a, res, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            collection = getModel(database);
                            return [4 /*yield*/, collection.insertOrUpdate(data)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), res = _a[0], error = _a[1];
                            if (error == null) {
                                socket["in"](socket.host).emit('child_added_' + database, data);
                                socket.emit('child_added_' + database, data);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        socket.on('get_collection_data', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var collection, _a, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        collection = getModel(data.database);
                        return [4 /*yield*/, collection.find()];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), res = _a[0];
                        callback(res);
                        return [2 /*return*/];
                }
            });
        }); });
        console.log('a user connected');
        // socket.on('new user', function (name, data) {
        //     if (name in users) {
        //         data(false);
        //     } else {
        //         data(true);
        //         socket.nickname = name;
        //         users[socket.nickname] = socket;
        //         console.log('add nickName');
        //         updateNickNames();
        //     }
        // });
        // function updateNickNames() {
        //     io.sockets.emit('usernames', Object.keys(users));
        // }
        // socket.on('open-chatbox', function (data) {
        //     users[data].emit('openbox', { nick: socket.nickname });
        // });
        // socket.on('send message', function (data, sendto) {
        //     console.log(data, sendto)
        //     if(users[sendto]){
        //         users[sendto].emit('new message', { msg: data, nick: socket.nickname, sendto: sendto });
        //     }
        //     users[socket.nickname].emit('new message', { msg: data, nick: socket.nickname, sendto: sendto });
        //     console.log(data);
        // });
        socket.on('disconnect', function (data) {
            if (!socket.uniqueId)
                return;
            delete users[socket.uniqueId];
            // updateNickNames();
        });
    });
}
Hook.add_action('before-router', init);
