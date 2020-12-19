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
var BlogPost = /** @class */ (function (_super) {
    __extends(BlogPost, _super);
    function BlogPost() {
        return _super.call(this, 'blog_post', {
            // id: {
            //     type: Number,
            //     unique: true
            // },
            author: {
                relation: 'blog_author'
            },
            slug: {
                type: String,
                unique: true
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            content: {
                type: String
            },
            published_at: {
                type: Date
            },
            cover: {
                type: String
            },
            time_read: {
                type: Number
            },
            tags: {
                relation: 'blog_tag',
                multi: true
            },
            categories: {
                relation: 'blog_category',
                multi: true
            }
        }) || this;
    }
    return BlogPost;
}(Model_1["default"]));
exports["default"] = new BlogPost;
