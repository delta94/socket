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
var Register = /** @class */ (function (_super) {
    __extends(Register, _super);
    function Register() {
        var _this = _super.call(this, 'elearning_register', {
            id: {
                type: Number,
                unique: true
            },
            coin_use: Number,
            payment_method: {
                "enum": ['Chuyển khoản', 'Tiền mặt'],
                "default": 'Chuyển khoản'
            },
            trang_thai: {
                "enum": ['duoc-duyet', 'chua-duoc-duyet'],
                "default": 'duoc-duyet'
            },
            cfd_student: Number,
            cfd_course: Number,
            payment: [],
            title: String
            // user: {
            //     relation: 'user',
            //     required: true
            //     // unique: true
            // },
            // course: {
            //     relation: 'elearning_course'
            // },
            // confirm: {
            //     enum: [true, false],
            //     default: false
            // }
        }) || this;
        _this.restFulTagName = 'Elearning API';
        return _this;
    }
    return Register;
}(Model_1["default"]));
exports["default"] = new Register;
