"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// import swaggerJSDoc from "swagger-jsdoc";
var Hook_1 = __importDefault(require("../../core/Hook"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import { config } from "../../core/helper/helper.js";
var rest_1 = __importDefault(require("../../config/rest"));
var helper_1 = require("../../core/helper/helper");
var Model_1 = require("../../core/Model");
var Authentication_1 = require("../../core/Authentication");
var node_fetch_1 = __importDefault(require("node-fetch"));
var type = {
    STATUS_SUCCESS: 200,
    // STATUS_CREATED: 201,
    // STATUS_NOCONTENT: 207,
    STATUS_BAD_REQUEST: 400,
    STATUS_UNAUTHORIZED: 401,
    STATUS_FORBIDEN: 403,
    STATUS_NOT_FOUND: 404,
    STATUS_SERVER_ERROR: 500
};
var prefix = (rest_1["default"].prefix ? ('/' + rest_1["default"].prefix.replace(/^\//, '')) : null) || '/rest';
var defaultConfig = {
    limit: 15
};
var swaggerOptions = {
    paths: {}
};
function selectSomeProperties(object, keys) {
    return Object.keys(object).reduce(function (obj, k) {
        if (keys.includes(k)) {
            obj[k] = object[k];
        }
        return obj;
    }, {});
}
function getCourse() {
    return __awaiter(this, void 0, void 0, function () {
        var coins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"]('https://www.cfdtraining.vn/api/rest/cfd_course', {}).then(function (res) { return res.json(); })];
                case 1:
                    coins = _a.sent();
                    return [2 /*return*/, coins.map(function (e) {
                            var _a, _b;
                            try {
                                e.benefits = JSON.parse(e.benefits);
                                e.mentor = JSON.parse(e.mentor);
                                e.required = JSON.parse(e.required);
                                e.thumbnail = JSON.parse(e.thubnail);
                                if (e.course_status === 'sap-khai-gian') {
                                    e.course_status = 'sap-khai-giang';
                                }
                                if (e.thumbnail) {
                                    e.thumbnail.link = '//cfdtraining.vn/' + e.thumbnail.link;
                                    if ((_a = e.thumbnail.thumbnail) === null || _a === void 0 ? void 0 : _a['thubnail-1']) {
                                        e.thumbnail.thumbnail['thumbnail-1'] = '//cfdtraining.vn/' + e.thumbnail.thumbnail['thubnail-1'];
                                        delete e.thumbnail.thumbnail['thubnail-1'];
                                    }
                                    if ((_b = e.thumbnail.thumbnail) === null || _b === void 0 ? void 0 : _b['thumbnail-2']) {
                                        e.thumbnail.thumbnail['thumbnail-2'] = '//cfdtraining.vn/' + e.thumbnail.thumbnail['thumbnail-2'];
                                    }
                                }
                                e.content = JSON.parse(e.content);
                                e.cfd_teacher = JSON.parse(e.cfd_teacher);
                            }
                            catch (err) {
                            }
                            // return e
                            return selectSomeProperties(e, ['benefits', 'cfd_teacher', 'close_time', 'content', 'count_video', 'course_status', 'course_type', 'created_at', 'created_time', 'id', 'khoa', 'long_description', 'mentor', 'money', 'money_affiliate_1', 'money_affiliate_2', 'number_student_default', 'opening_time', 'required', 'schedule', 'short_description', 'slug', 'thumbnail', 'title', 'visibility', 'template_color_btn', 'template_color_banner']);
                        })];
            }
        });
    });
}
function getStudent() {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"]('https://www.cfdtraining.vn/api/rest/cfd_student', {}).then(function (res) { return res.json(); })];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, users.map(function (e) {
                            var _a, _b;
                            var avatar = null;
                            try {
                                avatar = JSON.parse(e.avatar);
                                if (avatar.thumbnail) {
                                    if (avatar.type_link !== 'external') {
                                        avatar.link = '//cfdtraining.vn/' + avatar.link;
                                    }
                                    if ((_a = avatar.thumbnail) === null || _a === void 0 ? void 0 : _a['thumbnail-1']) {
                                        avatar.thumbnail['thumbnail-1'] = '//cfdtraining.vn/' + avatar.thumbnail['thumbnail-1'];
                                        // delete avatar.thumbnail['thumbnail-1']
                                    }
                                    if ((_b = avatar.thumbnail) === null || _b === void 0 ? void 0 : _b['thumbnail-2']) {
                                        avatar.thumbnail['thumbnail-2'] = '//cfdtraining.vn/' + avatar.thumbnail['thumbnail-2'];
                                        // delete avatar.thumbnail['thumbnail-2']
                                    }
                                }
                                e.avatar = avatar;
                            }
                            catch (err) {
                            }
                            e = selectSomeProperties(e, ['title', 'avatar', 'id', 'email', 'phone', 'review', 'skype', 'student_type', 'total_coin_current']);
                            e.password = e.email;
                            return e;
                        })];
            }
        });
    });
}
function getTeacher() {
    return __awaiter(this, void 0, void 0, function () {
        var teacher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"]('https://www.cfdtraining.vn/api/rest/cfd_teacher', {}).then(function (res) { return res.json(); })];
                case 1:
                    teacher = _a.sent();
                    return [2 /*return*/, teacher.map(function (e) {
                            var _a, _b;
                            var avatar = null;
                            try {
                                avatar = JSON.parse(e.avatar);
                                if (avatar.thumbnail) {
                                    avatar.link = '//cfdtraining.vn/' + avatar.link;
                                    if ((_a = avatar.thumbnail) === null || _a === void 0 ? void 0 : _a['thubnail-1']) {
                                        avatar.thumbnail['thumbnail-1'] = '//cfdtraining.vn/' + avatar.thumbnail['thubnail-1'];
                                        delete avatar.thumbnail['thubnail-1'];
                                    }
                                    if ((_b = avatar.thumbnail) === null || _b === void 0 ? void 0 : _b['thubnail-2']) {
                                        avatar.thumbnail['thumbnail-2'] = '//cfdtraining.vn/' + avatar.thumbnail['thubnail-2'];
                                        delete avatar.thumbnail['thubnail-2'];
                                    }
                                }
                                e.avatar = avatar;
                            }
                            catch (err) {
                            }
                            // return e;
                            return selectSomeProperties(e, ['avatar', 'description', 'id', 'position', 'slug', 'title', 'website']);
                        })];
            }
        });
    });
}
function getRegister(params) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"]('https://www.cfdtraining.vn/api/rest/cfd_course_register', {}).then(function (res) { return res.json(); })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.map(function (e) {
                            try {
                                e.attendance = JSON.parse(e.attendance);
                                e.payment = JSON.parse(e.payment);
                            }
                            catch (err) {
                            }
                            return selectSomeProperties(e, ['id', 'cfd_course', 'cfd_student', 'coin_use', 'payment', 'payment_method', 'title', 'trang_thai']);
                        })];
            }
        });
    });
}
var models;
function init(app, server) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        var _this = this;
        return __generator(this, function (_a) {
            models = Model_1.getAllModel();
            models = models.filterFun(function (e) { return rest_1["default"].list.includes(e.name); });
            for (i in models) {
                if (rest_1["default"].list.includes(models[i].name)) {
                    generateApiDocs(models[i]);
                    generateRouter(models[i], app);
                }
            }
            app.get('/rest/generator', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var course, _a, _b, _i, i, e, teacher, _c, data, error, mentors, mentor, _d, _e, _f, j, _g, data_1, error_1;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, getCourse()];
                        case 1:
                            course = _h.sent();
                            _a = [];
                            for (_b in course)
                                _a.push(_b);
                            _i = 0;
                            _h.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            i = _a[_i];
                            e = course[i];
                            teacher = e.cfd_teacher[0];
                            return [4 /*yield*/, Model_1.getModel('elearning_teacher').findOne({ email: teacher.email })];
                        case 3:
                            _c = _h.sent(), data = _c.data, error = _c.error;
                            mentors = e.mentor;
                            mentor = [];
                            _d = [];
                            for (_e in mentors)
                                _d.push(_e);
                            _f = 0;
                            _h.label = 4;
                        case 4:
                            if (!(_f < _d.length)) return [3 /*break*/, 7];
                            j = _d[_f];
                            return [4 /*yield*/, Model_1.getModel('elearning_teacher').findOne({ id: mentors[j].id })];
                        case 5:
                            _g = _h.sent(), data_1 = _g.data, error_1 = _g.error;
                            if (data_1) {
                                mentor.push(data_1._id);
                            }
                            _h.label = 6;
                        case 6:
                            _f++;
                            return [3 /*break*/, 4];
                        case 7:
                            e.mentor = mentor;
                            // e.mentor = e.mentor.map(e => teacher.find(e1 => e.id === e1.id))
                            if (data) {
                                e.cfd_teacher = data._id;
                            }
                            _h.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 2];
                        case 9:
                            Model_1.getModel('elearning_course').insertMany(course);
                            // Step 3
                            // let register = await getRegister();
                            // let course = await getCourse();
                            // register = register.map(e => {
                            //     e.cfd_course =  parseInt(e.cfd_course)
                            //     e.cfd_student = parseInt(e.cfd_student)
                            //     return e;
                            // })
                            // getModel('elearning_register').insertMany(register);
                            res.json({ course: course });
                            return [2 /*return*/];
                    }
                });
            }); });
            swaggerOptions = __assign(__assign(__assign(__assign({}, swaggerOptions), { 
                /* ... */
                components: {
                    schemas: __assign({}, (function () {
                        var object = {};
                        for (var i in models) {
                            if (models[i].restAPI === false)
                                continue;
                            var item = {
                                type: 'object',
                                properties: {}
                            };
                            for (var j in models[i]._fields) {
                                var field = models[i]._fields[j];
                                var schema = {
                                    type: 'string'
                                };
                                switch (field.resolve.name) {
                                    case 'String':
                                        schema.type = 'string';
                                        break;
                                    case 'Number':
                                        schema.type = 'number';
                                        break;
                                    case 'Date':
                                        schema.type = 'number';
                                        break;
                                    case 'ModelTypeRelation':
                                        if (field.multi) {
                                            schema = {
                                                items: {
                                                    $ref: '#/components/schemas/' + field.relation
                                                },
                                                type: 'array'
                                            };
                                        }
                                        else {
                                            schema.$ref = '#/components/schemas/' + field.relation;
                                        }
                                        break;
                                    case 'ModelTypeList':
                                        // schema.items = {
                                        //     $ref  : '#/components/schemas/' + field.relation
                                        // }
                                        // schema.type = 'array'
                                        break;
                                    case 'Enum':
                                        schema.type = 'string';
                                        schema["enum"] = field["enum"];
                                        schema["default"] = field["default"] || field["enum"][0];
                                        break;
                                    case 'ObjectID':
                                        schema.type = 'string';
                                    default:
                                        break;
                                }
                                item.properties[j] = schema;
                            }
                            object[i] = item;
                        }
                        return object;
                    })()
                    // identificationNumber: {
                    //     type: 'integer',
                    //     description: 'User identification number',
                    //     example: 1234
                    // },
                    // username: {
                    //     type: 'string',
                    //     example: 'raparicio'
                    // },
                    // userType: {
                    //     type: 'string',
                    //     // enum: USER_TYPES,
                    //     // default: REGULAR
                    // },
                    // companyId: {
                    //     type: 'integer',
                    //     description: 'Company id where the user works',
                    //     example: 15
                    // },
                    // User: {
                    //     type: 'object',
                    //     properties: {
                    //         identificationNumber: {
                    //             $ref: '#/components/schemas/identificationNumber'
                    //         },
                    //         username: {
                    //             $ref: '#/components/schemas/username'
                    //         },
                    //         userType: {
                    //             $ref: '#/components/schemas/userType'
                    //         },
                    //         companyId: {
                    //             $ref: '#/components/schemas/companyId'
                    //         }
                    //     }
                    // },
                    // Users: {
                    //     type: 'object',
                    //     properties: {
                    //         users: {
                    //             type: 'array',
                    //             items: {
                    //                 $ref: '#/components/schemas/User'
                    //             }
                    //         }
                    //     }
                    // },
                    // Error: {
                    //     type: 'object',
                    //     properties: {
                    //         message: {
                    //             type: 'string'
                    //         },
                    //         internal_code: {
                    //             type: 'string'
                    //         }
                    //     }
                    // }
                    ),
                    /* ... */
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                            // name: 'Authorization'
                        }
                    }
                }, 
                /* ... */
                security: [
                    {
                        bearerAuth: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwiaWF0IjoxNjA3MzE1MDg2LCJleHAiOjIwODA2NzkwODZ9.cDPTTv6nN8z5PwBQh4EeYGGvO0rFxb_TR9wReFedtHo']
                    }
                ] }), defaultConfig), rest_1["default"].rest);
            // const swaggerDocs = swaggerJSDoc(swaggerOptions)
            app.use('/rest-docs', swagger_ui_express_1["default"].serve, swagger_ui_express_1["default"].setup(swaggerOptions));
            return [2 /*return*/];
        });
    });
}
function generateApiDocs(model) {
    var capitalName = helper_1.capitalizeFirstLetter(model.name);
    // let name = model.c
    swaggerOptions.paths['/' + model.name] = {
        get: {
            tags: [model.name],
            description: 'Get ' + model.name,
            operationId: 'get' + capitalName,
            parameters: __spread((function () {
                var object = [];
                for (var i in model._fields) {
                    var field = model._fields[i];
                    var item = {
                        name: i,
                        "in": 'query'
                    };
                    var schema = {
                        type: 'string'
                    };
                    switch (field.resolve.name) {
                        case 'String':
                            schema.type = 'string';
                            break;
                        case 'Number':
                            schema.type = 'number';
                            break;
                        case 'Date':
                            schema.type = 'number';
                            break;
                        case 'ModelTypeRelation':
                            break;
                        case 'ModelTypeList':
                            break;
                        case 'Enum':
                            schema.type = 'string';
                            schema["enum"] = field["enum"];
                            schema["default"] = field["default"] || field["enum"][0];
                            break;
                        case 'ObjectID':
                            schema.type = 'string';
                        default:
                            break;
                    }
                    // item.required = field.required || false;
                    object.push(item);
                }
                object.push({
                    name: 'page',
                    "in": 'query'
                });
                object.push({
                    name: 'limit',
                    "in": 'query'
                });
                return object;
            })())
        },
        post: {
            // tags: [model.restFulTagName || 'CRUD operations generator'],
            tags: [model.name],
            description: 'Create ' + model.name,
            operationId: 'create' + capitalName,
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: __assign({}, (function () {
                                var object = {};
                                for (var i in model._fields) {
                                    if (['_id', 'created_at', 'updated_at'].includes(i))
                                        continue;
                                    var field = model._fields[i];
                                    var item = {
                                    // name: i,
                                    // in: 'body'
                                    };
                                    var schema = {
                                        type: 'string'
                                    };
                                    switch (field.resolve.name) {
                                        case 'String':
                                            schema.type = 'string';
                                            break;
                                        case 'Number':
                                            schema.type = 'number';
                                            break;
                                        case 'Date':
                                            schema.type = 'number';
                                            break;
                                        case 'ModelTypeRelation':
                                            schema.type = field.relation;
                                            // item.in = field.relation;
                                            break;
                                        case 'ModelTypeList':
                                            schema.type = 'number';
                                            break;
                                        case 'Enum':
                                            schema.type = 'string';
                                            schema["enum"] = field["enum"];
                                            schema["default"] = field["default"] || field["enum"][0];
                                            break;
                                        case 'ObjectID':
                                            schema.type = 'string';
                                        default:
                                            break;
                                    }
                                    // item.required = field.required || false;
                                    object[i] = schema;
                                }
                                return object;
                            })())
                        }
                    }
                },
                required: true
            }
        },
        put: {
            // tags: [model.restFulTagName || 'CRUD operations generator'],
            tags: [model.name],
            description: 'Update ' + model.name,
            operationId: 'update' + capitalName,
            parameters: []
        },
        "delete": {
            // tags: [model.restFulTagName || 'CRUD operations generator'],
            tags: [model.name],
            description: 'Delete ' + model.name,
            operationId: 'delete' + capitalName,
            parameters: []
        }
    };
}
function generateRouter(model, app) {
    var _this = this;
    var Model = Model_1.getModel(model.name);
    app.get(prefix + '/' + model.name + '/:id?', Authentication_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data_2, error_2, _b, _c, page, _d, limit, query, i, _e, data, error, paginate;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!req.params.id) return [3 /*break*/, 2];
                    return [4 /*yield*/, Model.findOne(req.params.id)];
                case 1:
                    _a = _f.sent(), data_2 = _a.data, error_2 = _a.error;
                    if (error_2) {
                        return [2 /*return*/, res.status(type.STATUS_SERVER_ERROR).json({ error: error_2 })];
                    }
                    return [2 /*return*/, res.json(data_2)];
                case 2:
                    _b = req.query, _c = _b.page, page = _c === void 0 ? 1 : _c, _d = _b.limit, limit = _d === void 0 ? defaultConfig.limit : _d, query = req.query;
                    delete query.page;
                    delete query.limit;
                    for (i in query) {
                        if (i in model._fields) {
                            if (model._fields[i].resolve.name === 'Number') {
                                query[i] = parseInt(query[i]);
                            }
                        }
                    }
                    return [4 /*yield*/, Model.find(query, { page: parseInt(page), limit: parseInt(limit) })];
                case 3:
                    _e = _f.sent(), data = _e.data, error = _e.error, paginate = _e.paginate;
                    if (error) {
                        return [2 /*return*/, res.status(type.STATUS_SERVER_ERROR).json({ error: error })];
                    }
                    res.json({ data: data, paginate: paginate });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post(prefix + '/' + model.name, Authentication_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Model.insertOne(req.body)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, res.status(type.STATUS_BAD_REQUEST).json({ error: error })];
                    }
                    res.json(data);
                    return [2 /*return*/];
            }
        });
    }); });
    app.put(prefix + '/' + model.name + '/:id', Authentication_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Model.updateOne({ id: req.params.id }, req.body)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, res.status(type.STATUS_BAD_REQUEST).json({ error: error })];
                    }
                    res.json(data);
                    return [2 /*return*/];
            }
        });
    }); });
    app["delete"](prefix + '/' + model.name + '/:id', Authentication_1.authenticateToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, deleteCount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Model["delete"]({ id: req.params.id })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error, deleteCount = _a.deleteCount;
                    if (error) {
                        return [2 /*return*/, res.status(type.STATUS_BAD_REQUEST).json({ error: error })];
                    }
                    res.json({ deleteCount: deleteCount });
                    return [2 /*return*/];
            }
        });
    }); });
}
// function initModel(model){  
//     generateApiDocs(model)
//     generateRouter(model);
// }
// Hook.do_action('init-model', initModel)
Hook_1["default"].add_action('before-router', init);
