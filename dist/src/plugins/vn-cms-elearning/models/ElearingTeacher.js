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
var Teacher = /** @class */ (function (_super) {
    __extends(Teacher, _super);
    function Teacher() {
        var _this = _super.call(this, 'elearning_teacher', {
            id: {
                type: Number,
                unique: true
            },
            website: String,
            avatar: {},
            description: String,
            position: String,
            slug: {
                type: String,
                unique: true
            },
            title: String
        }) || this;
        _this.restFulTagName = 'Elearning API';
        return _this;
    }
    return Teacher;
}(Model_1["default"]));
exports["default"] = new Teacher;
