"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.authenticateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var Model_1 = __importStar(require("./Model"));
var TokenExpiredError = jsonwebtoken_1["default"].TokenExpiredError, JsonWebTokenError = jsonwebtoken_1["default"].JsonWebTokenError;
dotenv_1["default"].config();
function generateAccessToken(user) {
    var email = user.email, _id = user._id;
    return jsonwebtoken_1["default"].sign({ email: email, _id: _id }, process.env.ACCESS_TOKEN_SECRET || 'AccessToken', { expiresIn: process.env.EXPIRE_TOKEN });
}
function cacheError(err, res) {
    if (err instanceof TokenExpiredError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_EXPIRED', message: 'Token was expired' });
    }
    if (err instanceof JsonWebTokenError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_INVALID', message: 'Token Invalid' });
    }
    console.log(err);
    return res.sendStatus(403);
}
function authenticateToken(req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1["default"].verify(token, process.env.ACCESS_TOKEN_SECRET || 'AccessToken', function (err, user) {
        if (err)
            return cacheError(err, res);
        req.user = user;
        next();
    });
}
exports.authenticateToken = authenticateToken;
exports["default"] = (function (app) {
    var Token = new /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this, 'token', {
                accessToken: String,
                refreshToken: String,
                user: {
                    relation: 'user'
                }
            }) || this;
            _this.graphql = false;
            return _this;
        }
        return class_1;
    }(Model_1["default"]));
    var User = Model_1.getModel('user');
    app.get('/api/generate-token', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var accessToken;
        return __generator(this, function (_a) {
            accessToken = jsonwebtoken_1["default"].sign({ 'email': 'admin' }, window.process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15y' });
            return [2 /*return*/, res.json({ accessToken: accessToken })];
        });
    }); });
    app.get('/api/get-user-info', authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = req.user;
                    if (!user) return [3 /*break*/, 2];
                    return [4 /*yield*/, User.findOne(user._id)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (data) {
                        return [2 /*return*/, res.json(data)];
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/, res.json({ error: 'Server internal have some error' })];
            }
        });
    }); });
    app.post('/api/refresh-token', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var refreshToken, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    refreshToken = req.body.refreshToken;
                    if (refreshToken == null) {
                        return [2 /*return*/, res.status(403).json({
                                error: 1,
                                error_code: 'REFRESH_TOKEN_REQUIRED',
                                message: 'refreshToken is required'
                            })];
                    }
                    return [4 /*yield*/, User.findOne({
                            refreshToken: refreshToken
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (data == null) {
                        return [2 /*return*/, res.status(403).json({
                                error: 1,
                                error_code: 'REFRESH_TOKEN_INVALID',
                                message: 'refreshToken invalid'
                            })];
                    }
                    jsonwebtoken_1["default"].verify(refreshToken, window.process.env.REFRESH_TOKEN_SECRET, function (err, user) {
                        if (err)
                            return cacheError(err, res);
                        var accessToken = generateAccessToken(user);
                        User.findOneAndUpdate({ refreshToken: refreshToken }, {
                            accessToken: accessToken
                        });
                        return res.json({ accessToken: accessToken });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    app["delete"]('/logout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Token.find({ refreshToken: req.body.refreshToken })];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), data = _a[0], error = _a[1];
                    res.sendStatus(204);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post('/api/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, reqAccessToken, _b, _c, user, userError, _d, token, tokenError, email_1, _id, avatar, name_1, accessToken, refreshToken, _e, data, error;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password, reqAccessToken = _a.accessToken;
                    return [4 /*yield*/, Promise.all([User.findOne({ email: email }), Token.findOne({ email: email })])];
                case 1:
                    _b = __read.apply(void 0, [_f.sent(), 2]), _c = _b[0], user = _c.data, userError = _c.error, _d = _b[1], token = _d.data, tokenError = _d.error;
                    if (!user) return [3 /*break*/, 3];
                    email_1 = user.email, _id = user._id, avatar = user.avatar, name_1 = user.name;
                    accessToken = generateAccessToken(user);
                    refreshToken = jsonwebtoken_1["default"].sign({ email: email_1, _id: _id }, window.process.env.REFRESH_TOKEN_SECRET);
                    return [4 /*yield*/, User.findOneAndUpdate({ _id: _id }, { accessToken: accessToken, refreshToken: refreshToken })];
                case 2:
                    _e = _f.sent(), data = _e.data, error = _e.error;
                    console.log(data, error);
                    // let [data, error] = await Token.insertOrUpdate({
                    //     accessToken, refreshToken, user: user._id, email: user.email
                    // })
                    if (data) {
                        return [2 /*return*/, res.json({ accessToken: accessToken, refreshToken: refreshToken, email: email_1, _id: _id, avatar: avatar, name: name_1 })];
                    }
                    else {
                        return [2 /*return*/, res.sendStatus(500)];
                    }
                    return [3 /*break*/, 4];
                case 3: 
                // return res.sendStatus(403)
                return [2 /*return*/, res.json({
                        error: 1, message: {
                            email: 'Email not exists'
                        }
                    })];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
