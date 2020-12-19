"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Hook_1 = __importDefault(require("../../core/Hook"));
var MySQL_1 = __importDefault(require("../../core/model/MySQL"));
var MongoDB_1 = require("../../core/model/MongoDB");
var mysql = new MySQL_1["default"];
function getAuthor() {
    return __awaiter(this, void 0, void 0, function () {
        var data, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql.find('author', 2000)];
                case 1:
                    data = (_a.sent()).data;
                    for (i in data) {
                        data[i].avatar = 'https://picsum.photos/300/300';
                    }
                    return [4 /*yield*/, MongoDB_1.getModel('blog_author').insertMany(data)];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function getCategory() {
    return __awaiter(this, void 0, void 0, function () {
        var data, category;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql.find('category', 2000)];
                case 1:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, MongoDB_1.getModel('blog_category').insertMany(data)];
                case 2:
                    category = _a.sent();
                    return [2 /*return*/, category];
            }
        });
    });
}
function getTag() {
    return __awaiter(this, void 0, void 0, function () {
        var data, tag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql.find('tag', 2000)];
                case 1:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, MongoDB_1.getModel('blog_tag').insertMany(data)];
                case 2:
                    tag = _a.sent();
                    return [2 /*return*/, tag];
            }
        });
    });
}
function getUser() {
    return __awaiter(this, void 0, void 0, function () {
        var data, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql.find('user', 2000)];
                case 1:
                    data = (_a.sent()).data;
                    for (i in data) {
                        data[i].avatar = 'https://picsum.photos/300/300';
                    }
                    return [4 /*yield*/, MongoDB_1.getModel('blog_user').insertMany(data)];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function getPost() {
    return __awaiter(this, void 0, void 0, function () {
        var category, tags, authors, data, j, i, cat, tag1, tag2, author, tag, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MongoDB_1.getModel('blog_category').findMany()];
                case 1:
                    category = (_a.sent()).data;
                    return [4 /*yield*/, MongoDB_1.getModel('blog_tag').findMany()];
                case 2:
                    tags = (_a.sent()).data;
                    return [4 /*yield*/, MongoDB_1.getModel('blog_author').findMany()];
                case 3:
                    authors = (_a.sent()).data;
                    return [4 /*yield*/, mysql.find('posts', 10000)];
                case 4:
                    data = (_a.sent()).data;
                    j = 0;
                    for (i in data) {
                        cat = category[Math.round(Math.random() * (category.length - 1))]._id;
                        tag1 = tags[Math.round(Math.random() * (tags.length - 1))]._id;
                        tag2 = tags[Math.round(Math.random() * (tags.length - 1))]._id;
                        author = authors[Math.round(Math.random() * (authors.length - 1))]._id;
                        tag = [];
                        tag.push(tag1);
                        if (tag1 !== tag2) {
                            tag.push(tag2);
                        }
                        data[i].author = author;
                        data[i].tags = tag;
                        data[i].categories = [cat];
                        data[i].cover = 'https://picsum.photos/1400/700';
                        // getModel('blog_post').updateOne({ _id: data[i]._id }, {
                        //     category: [cat],
                        //     tags: tag,
                        //     author: author
                        // })
                        //     .then(res => {
                        //         console.log(++j)
                        //     })
                    }
                    return [4 /*yield*/, MongoDB_1.getModel('blog_post').insertMany(data)];
                case 5:
                    m = _a.sent();
                    return [2 /*return*/, m];
            }
        });
    });
}
function getComment() {
    return __awaiter(this, void 0, void 0, function () {
        var data, posts, users, i, p, u, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql.find('comment', 10000)];
                case 1:
                    data = (_a.sent()).data;
                    return [4 /*yield*/, MongoDB_1.getModel('blog_post').findMany()];
                case 2:
                    posts = (_a.sent()).data;
                    return [4 /*yield*/, MongoDB_1.getModel('blog_user').findMany()];
                case 3:
                    users = (_a.sent()).data;
                    for (i in data) {
                        p = posts[Math.round(Math.random() * (posts.length - 1))]._id;
                        u = users[Math.round(Math.random() * (users.length - 1))]._id;
                        data[i].post = p;
                        data[i].user = u;
                    }
                    return [4 /*yield*/, MongoDB_1.getModel('blog_comment').insertMany(data)];
                case 4:
                    m = _a.sent();
                    return [2 /*return*/, m];
            }
        });
    });
}
function init(app, server) {
    var _this = this;
    app.get('/mysql', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var comment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getComment()];
                case 1:
                    comment = _a.sent();
                    res.json(comment);
                    return [2 /*return*/];
            }
        });
    }); });
}
Hook_1["default"].add_action('before-router', init);
