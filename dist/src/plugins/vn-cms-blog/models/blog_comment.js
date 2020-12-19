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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Model_1 = __importDefault(require("../../../core/Model"));
var BlogComment = /** @class */ (function (_super) {
    __extends(BlogComment, _super);
    function BlogComment() {
        return _super.call(this, 'blog_comment', {
            // id: {
            // },
            content: {
                type: String
            },
            user: {
                relation: 'blog_user',
                required: true
            },
            post: {
                relation: 'blog_post',
                required: true
            }
        }) || this;
    }
    return BlogComment;
}(Model_1["default"]));
exports["default"] = new BlogComment;
