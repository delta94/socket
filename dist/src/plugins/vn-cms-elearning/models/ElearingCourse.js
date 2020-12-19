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
var Course = /** @class */ (function (_super) {
    __extends(Course, _super);
    function Course() {
        var _this = _super.call(this, 'elearning_course', {
            id: {
                unique: true
            },
            benefits: [],
            cfd_teacher: {
                relation: 'elearning_teacher'
            },
            close_time: String,
            content: [],
            count_video: Number,
            course_status: {
                "enum": ['sap-khai-giang'],
                "default": 'sap-khai-giang'
            },
            khoa: Number,
            money: Number,
            course_type: {
                "enum": ['offline', 'online'],
                "default": 'offline'
            },
            opening_time: String,
            schedule: String,
            required: [],
            short_description: String,
            slug: {
                type: String,
                unique: true
            },
            title: String,
            visibility: {
                "enum": ['publish', 'trash'],
                "default": 'offline'
            },
            mentor: {
                relation: 'elearning_teacher',
                multi: true
            },
            thumbnail: {}
            // title: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // teacher: {
            //     relation: 'elearning_teacher',
            //     required: true
            // },
            // cover: String,
            // price: Number,
            // short_content: String,
            // description: String,
            // open_date: Number,
            // date_count: Number,
            // close_date: Number,
            // status: {
            //     enum: ['publish' , 'ready', 'finish'],
            //     default: 'publish'
            // },
            // type: {
            //     enum: ['offline', 'online'],
            //     default: 'offline'
            // },
            // content: [
            //     // {
            //     //     name: String,
            //     //     content: String
            //     // }
            // ],
            // required: [
            //     // {
            //     //     name: String
            //     // }
            // ],
            // formula: [
            //     // {
            //     //     name: String
            //     // }
            // ],
            // schedule: {
            //     struct: {
            //         start: Number,
            //         time: String
            //     }
            // },
        }) || this;
        _this.restFulTagName = 'Elearning API';
        return _this;
    }
    return Course;
}(Model_1["default"]));
exports["default"] = new Course;
